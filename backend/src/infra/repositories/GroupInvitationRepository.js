import { supabase } from '../database/supabase.js'
import { AppError } from '../../shared/errors/AppError.js'

export class GroupInvitationRepository {
  async create({ group_id, invitante_id, convidado_id, mensagem }) {
    const { data, error } = await supabase
      .from('group_invitations')
      .insert({ group_id, invitante_id, convidado_id, mensagem })
      .select()
      .single()
    if (error) {
      if (error.code === '23505') throw new AppError('Voluntário já foi convidado para este grupo', 409)
      throw new AppError(error.message, 500)
    }
    return data
  }

  async findByConvidado(convidadoId) {
    const { data, error } = await supabase
      .from('group_invitations')
      .select('*, groups(id, nome), volunteer_profiles!invitante_id(nome)')
      .eq('convidado_id', convidadoId)
      .order('criado_em', { ascending: false })
    if (error) throw new AppError(error.message, 500)
    return data
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('group_invitations')
      .select('*')
      .eq('id', id)
      .single()
    if (error && error.code !== 'PGRST116') throw new AppError(error.message, 500)
    return data ?? null
  }

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('group_invitations')
      .update({ status, respondido_em: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new AppError(error.message, 500)
    return data
  }
}
