import { supabase } from '../database/supabase.js'
import { IUserRepository } from '../../domain/repositories/IUserRepository.js'
import { User } from '../../domain/entities/User.js'
import { AppError } from '../../shared/errors/AppError.js'

export class UserRepository extends IUserRepository {
  _map(row) {
    if (!row) return null
    return new User(row)
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role, nome, ativo, criado_em, atualizado_em')
      .eq('id', id)
      .single()
    if (error && error.code !== 'PGRST116') throw new AppError(error.message, 500)
    return this._map(data)
  }

  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()
    if (error && error.code !== 'PGRST116') throw new AppError(error.message, 500)
    return data ?? null
  }

  async create(data) {
    const { data: row, error } = await supabase
      .from('users')
      .insert({ ...data, email: data.email.toLowerCase() })
      .select()
      .single()
    if (error) throw new AppError(error.message, 500)
    return this._map(row)
  }

  async update(id, data) {
    const { data: row, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', id)
      .select('id, email, role, nome, ativo, criado_em, atualizado_em')
      .single()
    if (error) throw new AppError(error.message, 500)
    return this._map(row)
  }

  async delete(id) {
    const { error } = await supabase.from('users').delete().eq('id', id)
    if (error) throw new AppError(error.message, 500)
  }

  async findAll({ role, ativo, page = 1, limit = 20 } = {}) {
    let q = supabase
      .from('users')
      .select('id, email, role, nome, ativo, criado_em', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1)
      .order('criado_em', { ascending: false })

    if (role) q = q.eq('role', role)
    if (ativo !== undefined) q = q.eq('ativo', ativo)

    const { data, error, count } = await q
    if (error) throw new AppError(error.message, 500)
    return { data: data.map(this._map), total: count }
  }

  async saveRefreshToken(userId, token, expiresAt) {
    const { error } = await supabase
      .from('refresh_tokens')
      .insert({ user_id: userId, token, expira_em: expiresAt })
    if (error) throw new AppError(error.message, 500)
  }

  async findRefreshToken(token) {
    const { data, error } = await supabase
      .from('refresh_tokens')
      .select('*, users!inner(id, email, role, nome, ativo)')
      .eq('token', token)
      .gt('expira_em', new Date().toISOString())
      .single()
    if (error && error.code !== 'PGRST116') throw new AppError(error.message, 500)
    return data ?? null
  }

  async deleteRefreshToken(token) {
    const { error } = await supabase.from('refresh_tokens').delete().eq('token', token)
    if (error) throw new AppError(error.message, 500)
  }
}
