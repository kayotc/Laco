import { supabase } from '../database/supabase.js'
import { AppError } from '../../shared/errors/AppError.js'

export class GroupRepository {
  async create({ nome, descricao, criado_por }) {
    const { data, error } = await supabase
      .from('groups')
      .insert({ nome, descricao, criado_por })
      .select('*, volunteer_profiles!criado_por(nome)')
      .single()
    if (error) throw new AppError(error.message, 500)
    return data
  }

  async findAll() {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        volunteer_profiles!criado_por(nome),
        group_members(count)
      `)
      .order('criado_em', { ascending: false })
    if (error) throw new AppError(error.message, 500)
    return data.map(g => ({ ...g, total_membros: g.group_members?.[0]?.count ?? 0 }))
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('groups')
      .select('*, volunteer_profiles!criado_por(nome)')
      .eq('id', id)
      .single()
    if (error && error.code !== 'PGRST116') throw new AppError(error.message, 500)
    return data ?? null
  }

  async findByVoluntario(voluntarioId) {
    const { data, error } = await supabase
      .from('group_members')
      .select('groups(*, volunteer_profiles!criado_por(nome))')
      .eq('voluntario_id', voluntarioId)
    if (error) throw new AppError(error.message, 500)
    return data.map(r => r.groups).filter(Boolean)
  }

  async addMember(groupId, voluntarioId) {
    const { error } = await supabase
      .from('group_members')
      .insert({ group_id: groupId, voluntario_id: voluntarioId })
    if (error) {
      if (error.code === '23505') throw new AppError('Você já faz parte deste grupo', 409)
      throw new AppError(error.message, 500)
    }
  }

  async removeMember(groupId, voluntarioId) {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('voluntario_id', voluntarioId)
    if (error) throw new AppError(error.message, 500)
  }

  async listMembers(groupId) {
    const { data, error } = await supabase
      .from('group_members')
      .select('voluntario_id, entrou_em, volunteer_profiles(id, user_id, nome, bio, foto_url, cidade, estado, habilidades, disponibilidade, reputacao_score)')
      .eq('group_id', groupId)
      .order('entrou_em')
    if (error) throw new AppError(error.message, 500)
    return data
  }

  async findAllWithCount() {
    const { data, error } = await supabase
      .from('groups')
      .select('*, volunteer_profiles!criado_por(nome), group_members(count)')
      .order('criado_em', { ascending: false })
    if (error) throw new AppError(error.message, 500)
    return data.map(g => ({ ...g, total_membros: g.group_members?.[0]?.count ?? 0 }))
  }

  async isMember(groupId, voluntarioId) {
    const { data } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('voluntario_id', voluntarioId)
      .maybeSingle()
    return !!data
  }
}
