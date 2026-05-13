import { supabase } from '../database/supabase.js'
import { IInvitationRepository } from '../../domain/repositories/IInvitationRepository.js'
import { Invitation } from '../../domain/entities/Invitation.js'
import { AppError } from '../../shared/errors/AppError.js'

export class InvitationRepository extends IInvitationRepository {
  _map(row) {
    if (!row) return null
    return new Invitation({
      ...row,
      lar_nome: row.institution_profiles?.nome_lar,
      voluntario_nome: row.volunteer_profiles?.nome,
    })
  }

  async create(data) {
    const { data: row, error } = await supabase
      .from('invitations')
      .insert(data)
      .select()
      .single()
    if (error) throw new AppError(error.message, 500)
    return new Invitation(row)
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('invitations')
      .select('*, institution_profiles!inner(nome_lar), volunteer_profiles!inner(nome, user_id)')
      .eq('id', id)
      .single()
    if (error && error.code !== 'PGRST116') throw new AppError(error.message, 500)
    return this._map(data)
  }

  async findByLar(larId, status) {
    let q = supabase
      .from('invitations')
      .select('*, institution_profiles!inner(nome_lar), volunteer_profiles!inner(nome, foto_url, cidade, habilidades)')
      .eq('lar_id', larId)
      .order('criado_em', { ascending: false })

    if (status) q = q.eq('status', status)
    const { data, error } = await q
    if (error) throw new AppError(error.message, 500)
    return data.map(this._map)
  }

  async findByVoluntario(voluntarioId, status) {
    let q = supabase
      .from('invitations')
      .select('*, institution_profiles!inner(nome_lar, logo_url, cidade), volunteer_profiles!inner(nome)')
      .eq('voluntario_id', voluntarioId)
      .order('criado_em', { ascending: false })

    if (status) q = q.eq('status', status)
    const { data, error } = await q
    if (error) throw new AppError(error.message, 500)
    return data.map(this._map)
  }

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('invitations')
      .update({ status, respondido_em: status !== 'pendente' ? new Date().toISOString() : null })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new AppError(error.message, 500)
    return new Invitation(data)
  }

  async countPendentesHoje(larId, voluntarioId) {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const { count, error } = await supabase
      .from('invitations')
      .select('id', { count: 'exact', head: true })
      .eq('lar_id', larId)
      .eq('voluntario_id', voluntarioId)
      .eq('status', 'pendente')
      .gte('criado_em', hoje.toISOString())
    if (error) throw new AppError(error.message, 500)
    return count ?? 0
  }

  async expireOld() {
    const { error } = await supabase
      .from('invitations')
      .update({ status: 'expirado' })
      .eq('status', 'pendente')
      .lt('expira_em', new Date().toISOString())
    if (error) throw new AppError(error.message, 500)
  }
}
