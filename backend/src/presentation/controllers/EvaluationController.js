import { ok, created } from '../../shared/utils/response.js'
import { ValidationError, ConflictError } from '../../shared/errors/AppError.js'

export class EvaluationController {
  constructor(evaluationRepo) {
    this._repo = evaluationRepo
    this.create = this.create.bind(this)
    this.listByUser = this.listByUser.bind(this)
    this.getMedia = this.getMedia.bind(this)
  }

  async create(req, res) {
    const { destinatario_id, oportunidade_id, nota, comentario } = req.body

    if (!destinatario_id) throw new ValidationError('destinatario_id é obrigatório')
    if (!nota || nota < 1 || nota > 5) throw new ValidationError('Nota deve ser entre 1 e 5')

    if (req.user.id === destinatario_id) {
      throw new ValidationError('Você não pode se autoavaliar')
    }

    if (oportunidade_id) {
      const existing = await this._repo.findByRemetenteAndOportunidade(req.user.id, oportunidade_id)
      if (existing) throw new ConflictError('Você já avaliou esta participação')
    }

    const avaliacao = await this._repo.create({
      remetente_id: req.user.id,
      destinatario_id,
      oportunidade_id: oportunidade_id ?? null,
      nota: Number(nota),
      comentario: comentario?.trim() || null,
    })
    created(res, avaliacao, 'Avaliação registrada com sucesso!')
  }

  async listByUser(req, res) {
    const avaliacoes = await this._repo.findByDestinatario(req.params.userId)
    const media = await this._repo.getMediaForUser(req.params.userId)
    ok(res, { avaliacoes, media, total: avaliacoes.length })
  }

  async getMedia(req, res) {
    const media = await this._repo.getMediaForUser(req.params.userId)
    ok(res, { media })
  }
}
