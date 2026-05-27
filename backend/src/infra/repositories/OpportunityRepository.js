import { supabase } from '../database/supabase.js'
import { IOpportunityRepository } from '../../domain/repositories/IOpportunityRepository.js'
import { Opportunity } from '../../domain/entities/Opportunity.js'
import { AppError } from '../../shared/errors/AppError.js'

const SELECT_WITH_LAR = `
  id, lar_id, titulo, descricao, categorias, habilidades_requeridas,
  cidade, estado, data_inicio, data_fim, vagas_totais, vagas_preenchidas,
  carga_horaria, endereco, presencial, status, criado_em, atualizado_em,
  institution_profiles!inner(nome_lar, logo_url)
`

export class OpportunityRepository extends IOpportunityRepository {
  _map(row) {
    if (!row) return null
    return new Opportunity({
      ...row,
      lar_nome: row.institution_profiles?.nome_lar,
      lar_logo: row.institution_profiles?.logo_url,
    })
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('opportunities')
      .select(SELECT_WITH_LAR)
      .eq('id', id)
      .single()
    if (error && error.code !== 'PGRST116') throw new AppError(error.message, 500)
    return this._map(data)
  }

  async findByLar(larId, { status } = {}) {
    let q = supabase
      .from('opportunities')
      .select(SELECT_WITH_LAR)
      .eq('lar_id', larId)
      .order('criado_em', { ascending: false })

    if (status) q = q.eq('status', status)
    const { data, error } = await q
    if (error) throw new AppError(error.message, 500)
    return data.map(this._map)
  }

  async findAll({ status = 'aberta', categorias, cidade, termo, presencial }, page = 1, limit = 20) {
    let q = supabase
      .from('opportunities')
      .select(SELECT_WITH_LAR, { count: 'exact' })
      .order('criado_em', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (status) q = q.eq('status', status)
    if (categorias?.length) q = q.overlaps('categorias', categorias)
    if (cidade) q = q.ilike('cidade', `%${cidade}%`)
    if (presencial !== undefined) q = q.eq('presencial', presencial)
    if (termo) q = q.or(`titulo.ilike.%${termo}%,descricao.ilike.%${termo}%`)

    const { data, error, count } = await q
    if (error) throw new AppError(error.message, 500)
    return { data: data.map(this._map), total: count, page, limit }
  }

  async create(data) {
    const { data: row, error } = await supabase
      .from('opportunities')
      .insert(data)
      .select(SELECT_WITH_LAR)
      .single()
    if (error) throw new AppError(error.message, 500)
    return this._map(row)
  }

  async update(id, data) {
    const { data: row, error } = await supabase
      .from('opportunities')
      .update(data)
      .eq('id', id)
      .select(SELECT_WITH_LAR)
      .single()
    if (error) throw new AppError(error.message, 500)
    return this._map(row)
  }

  async delete(id) {
    const { error } = await supabase.from('opportunities').delete().eq('id', id)
    if (error) throw new AppError(error.message, 500)
  }

  async incrementVagas(id) {
    const { error } = await supabase.rpc('incrementar_vagas', { p_oportunidade_id: id })
    if (error) {
      const { data } = await supabase.from('opportunities').select('vagas_preenchidas').eq('id', id).single()
      await supabase.from('opportunities').update({ vagas_preenchidas: (data?.vagas_preenchidas ?? 0) + 1 }).eq('id', id)
    }
  }

  async findApplications(oportunidadeId) {
    const { data, error } = await supabase
      .from('applications')
      .select('*, volunteer_profiles!inner(id, nome, foto_url, cidade, habilidades, reputacao_score)')
      .eq('oportunidade_id', oportunidadeId)
      .order('criado_em', { ascending: false })
    if (error) throw new AppError(error.message, 500)
    return data
  }

  async apply(oportunidadeId, voluntarioId, mensagem) {
    const { data, error } = await supabase
      .from('applications')
      .insert({ oportunidade_id: oportunidadeId, voluntario_id: voluntarioId, mensagem })
      .select()
      .single()
    if (error) throw new AppError(error.message, 500)
    return data
  }

  async updateApplicationStatus(id, status) {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new AppError(error.message, 500)
    return data
  }

  async findApplicationByVoluntario(oportunidadeId, voluntarioId) {
    const { data } = await supabase
      .from('applications')
      .select('id, status')
      .eq('oportunidade_id', oportunidadeId)
      .eq('voluntario_id', voluntarioId)
      .single()
    return data ?? null
  }

  async findApplicationsByVoluntario(voluntarioId) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        id, oportunidade_id, mensagem, status, criado_em, atualizado_em,
        opportunities!inner(
          id, titulo, descricao, cidade, presencial, status,
          data_inicio, data_fim, vagas_totais,
          institution_profiles!inner(nome_lar, logo_url)
        )
      `)
      .eq('voluntario_id', voluntarioId)
      .order('criado_em', { ascending: false })
    if (error) throw new AppError(error.message, 500)
    return (data ?? []).map(a => ({
      id: a.id,
      oportunidade_id: a.oportunidade_id,
      mensagem: a.mensagem,
      status: a.status,
      criado_em: a.criado_em,
      oportunidade: a.opportunities
        ? {
            ...a.opportunities,
            lar_nome: a.opportunities.institution_profiles?.nome_lar,
            lar_logo: a.opportunities.institution_profiles?.logo_url,
          }
        : null,
    }))
  }
}
