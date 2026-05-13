import { supabase } from '../database/supabase.js'
import { IVolunteerRepository } from '../../domain/repositories/IVolunteerRepository.js'
import { VolunteerProfile } from '../../domain/entities/VolunteerProfile.js'
import { AppError } from '../../shared/errors/AppError.js'

const SELECT_PUBLIC = `
  id, user_id, nome, bio, foto_url, cidade, estado,
  habilidades, interesses, disponibilidade, disponibilidade_locais,
  experiencias, certificados, redes_sociais,
  reputacao_score, total_horas, total_acoes, visivel, criado_em, atualizado_em
`

export class VolunteerRepository extends IVolunteerRepository {
  _map(row) {
    if (!row) return null
    return new VolunteerProfile(row)
  }

  async findByUserId(userId) {
    const { data, error } = await supabase
      .from('volunteer_profiles')
      .select(SELECT_PUBLIC)
      .eq('user_id', userId)
      .single()
    if (error && error.code !== 'PGRST116') throw new AppError(error.message, 500)
    return this._map(data)
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('volunteer_profiles')
      .select(SELECT_PUBLIC)
      .eq('id', id)
      .single()
    if (error && error.code !== 'PGRST116') throw new AppError(error.message, 500)
    return this._map(data)
  }

  async create(data) {
    const { data: row, error } = await supabase
      .from('volunteer_profiles')
      .insert(data)
      .select(SELECT_PUBLIC)
      .single()
    if (error) throw new AppError(error.message, 500)
    return this._map(row)
  }

  async update(userId, data) {
    const { data: row, error } = await supabase
      .from('volunteer_profiles')
      .update(data)
      .eq('user_id', userId)
      .select(SELECT_PUBLIC)
      .single()
    if (error) throw new AppError(error.message, 500)
    return this._map(row)
  }

  async search({ cidade, estado, habilidades, interesses, disponibilidade, termo, visivel = true }, page = 1, limit = 20) {
    let q = supabase
      .from('volunteer_profiles')
      .select(SELECT_PUBLIC, { count: 'exact' })
      .eq('visivel', visivel)
      .order('reputacao_score', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (cidade) q = q.ilike('cidade', `%${cidade}%`)
    if (estado) q = q.eq('estado', estado)
    if (habilidades?.length) q = q.overlaps('habilidades', habilidades)
    if (interesses?.length) q = q.overlaps('interesses', interesses)
    if (disponibilidade?.length) q = q.overlaps('disponibilidade', disponibilidade)
    if (termo) q = q.or(`nome.ilike.%${termo}%,bio.ilike.%${termo}%`)

    const { data, error, count } = await q
    if (error) throw new AppError(error.message, 500)
    return { data: data.map(this._map), total: count, page, limit }
  }

  async updateReputacao(voluntarioId, delta) {
    const { error } = await supabase.rpc('incrementar_reputacao', {
      p_voluntario_id: voluntarioId,
      p_delta: delta,
    })
    if (error) {
      // Fallback manual se RPC não existir
      const { data: current } = await supabase
        .from('volunteer_profiles')
        .select('reputacao_score')
        .eq('id', voluntarioId)
        .single()
      const novo = Math.max(0, (current?.reputacao_score ?? 0) + delta)
      await supabase.from('volunteer_profiles').update({ reputacao_score: novo }).eq('id', voluntarioId)
    }
  }

  async findFavoritosByLar(larId) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`voluntario_id, volunteer_profiles!inner(${SELECT_PUBLIC})`)
      .eq('lar_id', larId)
    if (error) throw new AppError(error.message, 500)
    return data.map((f) => this._map(f.volunteer_profiles))
  }

  async toggleFavorito(larId, voluntarioId) {
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('lar_id', larId)
      .eq('voluntario_id', voluntarioId)
      .single()

    if (existing) {
      await supabase.from('favorites').delete().eq('id', existing.id)
      return { favoritado: false }
    } else {
      await supabase.from('favorites').insert({ lar_id: larId, voluntario_id: voluntarioId })
      return { favoritado: true }
    }
  }
}
