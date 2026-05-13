import { supabase } from '../database/supabase.js'
import { IInstitutionRepository } from '../../domain/repositories/IInstitutionRepository.js'
import { InstitutionProfile } from '../../domain/entities/InstitutionProfile.js'
import { AppError } from '../../shared/errors/AppError.js'

const SELECT_PUBLIC = `
  id, user_id, nome_lar, cnpj, descricao, logo_url,
  endereco, cidade, estado, cep, telefone, email_contato,
  responsavel, site, area_atuacao, categorias,
  chave_pix, verificado, criado_em, atualizado_em
`

export class InstitutionRepository extends IInstitutionRepository {
  _map(row) {
    if (!row) return null
    return new InstitutionProfile(row)
  }

  async findByUserId(userId) {
    const { data, error } = await supabase
      .from('institution_profiles')
      .select(SELECT_PUBLIC)
      .eq('user_id', userId)
      .single()
    if (error && error.code !== 'PGRST116') throw new AppError(error.message, 500)
    return this._map(data)
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('institution_profiles')
      .select(SELECT_PUBLIC)
      .eq('id', id)
      .single()
    if (error && error.code !== 'PGRST116') throw new AppError(error.message, 500)
    return this._map(data)
  }

  async create(data) {
    const { data: row, error } = await supabase
      .from('institution_profiles')
      .insert(data)
      .select(SELECT_PUBLIC)
      .single()
    if (error) throw new AppError(error.message, 500)
    return this._map(row)
  }

  async update(userId, data) {
    const { data: row, error } = await supabase
      .from('institution_profiles')
      .update(data)
      .eq('user_id', userId)
      .select(SELECT_PUBLIC)
      .single()
    if (error) throw new AppError(error.message, 500)
    return this._map(row)
  }

  async findAll({ cidade, estado, categorias, verificado, termo }, page = 1, limit = 20) {
    let q = supabase
      .from('institution_profiles')
      .select(SELECT_PUBLIC, { count: 'exact' })
      .order('verificado', { ascending: false })
      .order('total_voluntarios', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (cidade) q = q.ilike('cidade', `%${cidade}%`)
    if (estado) q = q.eq('estado', estado)
    if (categorias?.length) q = q.overlaps('categorias', categorias)
    if (verificado !== undefined) q = q.eq('verificado', verificado)
    if (termo) q = q.or(`nome_lar.ilike.%${termo}%,descricao.ilike.%${termo}%`)

    const { data, error, count } = await q
    if (error) throw new AppError(error.message, 500)
    return { data: data.map(this._map), total: count, page, limit }
  }

  async verificar(id, verificado) {
    const { error } = await supabase
      .from('institution_profiles')
      .update({ verificado })
      .eq('id', id)
    if (error) throw new AppError(error.message, 500)
  }
}
