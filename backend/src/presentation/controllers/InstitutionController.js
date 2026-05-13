import { ok } from '../../shared/utils/response.js'
import { NotFoundError } from '../../shared/errors/AppError.js'

export class InstitutionController {
  constructor(institutionRepo, updateUseCase) {
    this.list = this.list.bind(this)
    this.getById = this.getById.bind(this)
    this.getMyProfile = this.getMyProfile.bind(this)
    this.updateMyProfile = this.updateMyProfile.bind(this)

    this._repo = institutionRepo
    this._update = updateUseCase
  }

  async list(req, res) {
    const { cidade, estado, categorias, termo, page = 1, limit = 20 } = req.query
    const filters = {
      cidade,
      estado,
      categorias: categorias ? categorias.split(',') : undefined,
      termo,
    }
    const result = await this._repo.findAll(filters, Number(page), Number(limit))
    ok(res, result)
  }

  async getById(req, res) {
    const perfil = await this._repo.findById(req.params.id)
    if (!perfil) throw new NotFoundError('Lar')
    ok(res, perfil)
  }

  async getMyProfile(req, res) {
    const perfil = await this._repo.findByUserId(req.user.id)
    if (!perfil) throw new NotFoundError('Perfil do lar')
    ok(res, perfil)
  }

  async updateMyProfile(req, res) {
    const perfil = await this._update.execute(req.user.id, req.body)
    ok(res, perfil, 'Perfil atualizado')
  }
}
