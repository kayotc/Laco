import { ok, created } from '../../shared/utils/response.js'

export class InvitationController {
  constructor(invitationRepo, sendUseCase, respondUseCase, institutionRepo, volunteerRepo) {
    this.send = this.send.bind(this)
    this.listByLar = this.listByLar.bind(this)
    this.listByVoluntario = this.listByVoluntario.bind(this)
    this.respond = this.respond.bind(this)

    this._repo = invitationRepo
    this._send = sendUseCase
    this._respond = respondUseCase
    this._institutionRepo = institutionRepo
    this._volunteerRepo = volunteerRepo
  }

  async send(req, res) {
    const convite = await this._send.execute(req.user.id, req.body)
    created(res, convite, 'Convite enviado com sucesso')
  }

  async listByLar(req, res) {
    const lar = await this._institutionRepo.findByUserId(req.user.id)
    const { status } = req.query
    const convites = await this._repo.findByLar(lar.id, status)
    ok(res, convites)
  }

  async listByVoluntario(req, res) {
    const voluntario = await this._volunteerRepo.findByUserId(req.user.id)
    const { status } = req.query
    const convites = await this._repo.findByVoluntario(voluntario.id, status)
    ok(res, convites)
  }

  async respond(req, res) {
    const convite = await this._respond.execute(req.user.id, req.params.id, req.body)
    ok(res, convite, 'Resposta registrada')
  }
}
