import { supabase } from '../database/supabase.js'
import { AppError } from '../../shared/errors/AppError.js'

export class EvaluationRepository {
  async create({ remetente_id, destinatario_id, oportunidade_id, nota, comentario }) {
    const { data, error } = await supabase
      .from('evaluations')
      .insert({ remetente_id, destinatario_id, oportunidade_id, nota, comentario })
      .select()
      .single()
    if (error) throw new AppError(error.message, 500)
    return data
  }

  async findByDestinatario(userId) {
    const { data, error } = await supabase
      .from('evaluations')
      .select(`
        id, nota, comentario, criado_em,
        remetente_id,
        users!evaluations_remetente_id_fkey(nome)
      `)
      .eq('destinatario_id', userId)
      .order('criado_em', { ascending: false })
    if (error) throw new AppError(error.message, 500)
    return (data ?? []).map(e => ({
      id: e.id,
      nota: e.nota,
      comentario: e.comentario,
      criado_em: e.criado_em,
      remetente_nome: e.users?.nome,
    }))
  }

  async findByRemetenteAndOportunidade(remetenteId, oportunidadeId) {
    const { data } = await supabase
      .from('evaluations')
      .select('id')
      .eq('remetente_id', remetenteId)
      .eq('oportunidade_id', oportunidadeId)
      .single()
    return data ?? null
  }

  async getMediaForUser(userId) {
    const { data, error } = await supabase
      .from('evaluations')
      .select('nota')
      .eq('destinatario_id', userId)
    if (error) return 0
    if (!data?.length) return 0
    const soma = data.reduce((acc, e) => acc + e.nota, 0)
    return Math.round((soma / data.length) * 10) / 10
  }
}
