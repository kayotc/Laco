import { ok } from '../../shared/utils/response.js'
import { NotFoundError } from '../../shared/errors/AppError.js'

export class VolunteerController {
  constructor(volunteerRepo, searchUseCase, updateUseCase, opportunityRepo) {
    this.list = this.list.bind(this)
    this.getById = this.getById.bind(this)
    this.getMyProfile = this.getMyProfile.bind(this)
    this.updateMyProfile = this.updateMyProfile.bind(this)
    this.toggleFavorito = this.toggleFavorito.bind(this)
    this.getFavoritos = this.getFavoritos.bind(this)
    this.listMyCandidaturas = this.listMyCandidaturas.bind(this)

    this._repo = volunteerRepo
    this._search = searchUseCase
    this._update = updateUseCase
    this._opps = opportunityRepo
  }

  async list(req, res) {
    const { cidade, estado, habilidades, interesses, disponibilidade, termo, page = 1, limit = 20 } = req.query
    const filters = {
      cidade,
      estado,
      habilidades: habilidades ? habilidades.split(',') : undefined,
      interesses: interesses ? interesses.split(',') : undefined,
      disponibilidade: disponibilidade ? disponibilidade.split(',') : undefined,
      termo,
    }
    const result = await this._search.execute(filters, Number(page), Number(limit))
    ok(res, result)
  }

  async getById(req, res) {
    const perfil = await this._repo.findById(req.params.id)
    if (!perfil) throw new NotFoundError('Voluntário')
    ok(res, perfil)
  }

  async getMyProfile(req, res) {
    const perfil = await this._repo.findByUserId(req.user.id)
    if (!perfil) throw new NotFoundError('Perfil')
    ok(res, perfil)
  }

  async updateMyProfile(req, res) {
    const perfil = await this._update.execute(req.user.id, req.body)
    ok(res, perfil, 'Perfil atualizado')
  }

  async toggleFavorito(req, res) {
    const { voluntario_id } = req.params
    // req.user.id é o user_id do lar — precisamos do institution id
    const result = await this._repo.toggleFavorito(req.larId, voluntario_id)
    ok(res, result)
  }

  async getFavoritos(req, res) {
    const lista = await this._repo.findFavoritosByLar(req.larId)
    ok(res, lista)
  }

  async listMyCandidaturas(req, res) {
    const vol = await this._repo.findByUserId(req.user.id)
    if (!vol) throw new NotFoundError('Perfil de voluntário')
    const candidaturas = await this._opps.findApplicationsByVoluntario(vol.id)
    ok(res, candidaturas)
  }
}
