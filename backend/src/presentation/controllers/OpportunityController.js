import { ok, created, noContent } from '../../shared/utils/response.js'
import { NotFoundError, ForbiddenError, ValidationError, ConflictError } from '../../shared/errors/AppError.js'

export class OpportunityController {
  constructor(opportunityRepo, institutionRepo, volunteerRepo) {
    this._opps = opportunityRepo
    this._insts = institutionRepo
    this._vols = volunteerRepo

    this.list = this.list.bind(this)
    this.getById = this.getById.bind(this)
    this.listMine = this.listMine.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.delete = this.delete.bind(this)
    this.candidatar = this.candidatar.bind(this)
    this.listCandidatos = this.listCandidatos.bind(this)
    this.responderCandidatura = this.responderCandidatura.bind(this)
  }

  async list(req, res) {
    const { status = 'aberta', categorias, cidade, termo, presencial, page = 1, limit = 20 } = req.query
    const result = await this._opps.findAll(
      {
        status,
        categorias: categorias ? categorias.split(',') : undefined,
        cidade,
        termo,
        presencial: presencial !== undefined ? presencial === 'true' : undefined,
      },
      Number(page),
      Number(limit)
    )
    ok(res, result)
  }

  async getById(req, res) {
    const opp = await this._opps.findById(req.params.id)
    if (!opp) throw new NotFoundError('Oportunidade')
    ok(res, opp)
  }

  async listMine(req, res) {
    const inst = await this._insts.findByUserId(req.user.id)
    if (!inst) throw new NotFoundError('Perfil do lar')
    const { status } = req.query
    const data = await this._opps.findByLar(inst.id, { status })
    ok(res, data)
  }

  async create(req, res) {
    const inst = await this._insts.findByUserId(req.user.id)
    if (!inst) throw new NotFoundError('Perfil do lar')

    const {
      titulo, descricao, categorias, habilidades_requeridas,
      cidade, estado, data_inicio, data_fim,
      vagas_totais, carga_horaria, presencial,
    } = req.body

    if (!titulo?.trim() || !descricao?.trim()) {
      throw new ValidationError('Título e descrição são obrigatórios')
    }

    const opp = await this._opps.create({
      lar_id: inst.id,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      categorias: categorias ?? [],
      habilidades_requeridas: habilidades_requeridas ?? [],
      cidade: cidade ?? inst.cidade,
      estado: estado ?? inst.estado,
      data_inicio: data_inicio || null,
      data_fim: data_fim || null,
      vagas_totais: Number(vagas_totais) || 1,
      carga_horaria: carga_horaria || null,
      presencial: presencial ?? true,
    })
    created(res, opp)
  }

  async update(req, res) {
    const inst = await this._insts.findByUserId(req.user.id)
    if (!inst) throw new NotFoundError('Perfil do lar')
    const opp = await this._opps.findById(req.params.id)
    if (!opp) throw new NotFoundError('Oportunidade')
    if (opp.lar_id !== inst.id) throw new ForbiddenError()
    const updated = await this._opps.update(req.params.id, req.body)
    ok(res, updated)
  }

  async updateStatus(req, res) {
    const inst = await this._insts.findByUserId(req.user.id)
    if (!inst) throw new NotFoundError('Perfil do lar')
    const opp = await this._opps.findById(req.params.id)
    if (!opp) throw new NotFoundError('Oportunidade')
    if (opp.lar_id !== inst.id) throw new ForbiddenError()

    const { status } = req.body
    const validos = ['aberta', 'encerrada', 'cancelada', 'concluida']
    if (!validos.includes(status)) throw new ValidationError('Status inválido')

    const updated = await this._opps.update(req.params.id, { status })
    ok(res, updated)
  }

  async delete(req, res) {
    const inst = await this._insts.findByUserId(req.user.id)
    if (!inst) throw new NotFoundError('Perfil do lar')
    const opp = await this._opps.findById(req.params.id)
    if (!opp) throw new NotFoundError('Oportunidade')
    if (opp.lar_id !== inst.id) throw new ForbiddenError()
    await this._opps.delete(req.params.id)
    noContent(res)
  }

  async candidatar(req, res) {
    const vol = await this._vols.findByUserId(req.user.id)
    if (!vol) throw new NotFoundError('Perfil de voluntário')

    const opp = await this._opps.findById(req.params.id)
    if (!opp) throw new NotFoundError('Oportunidade')
    if (opp.status !== 'aberta') throw new ValidationError('Esta oportunidade não está aberta para candidaturas')

    const existing = await this._opps.findApplicationByVoluntario(opp.id, vol.id)
    if (existing) throw new ConflictError('Você já se candidatou a esta oportunidade')

    const { mensagem } = req.body
    const candidatura = await this._opps.apply(opp.id, vol.id, mensagem ?? null)
    created(res, candidatura, 'Candidatura enviada com sucesso!')
  }

  async listCandidatos(req, res) {
    const inst = await this._insts.findByUserId(req.user.id)
    if (!inst) throw new NotFoundError('Perfil do lar')

    const opp = await this._opps.findById(req.params.id)
    if (!opp) throw new NotFoundError('Oportunidade')
    if (opp.lar_id !== inst.id) throw new ForbiddenError()

    const candidatos = await this._opps.findApplications(req.params.id)
    ok(res, candidatos)
  }

  async responderCandidatura(req, res) {
    const inst = await this._insts.findByUserId(req.user.id)
    if (!inst) throw new NotFoundError('Perfil do lar')

    const opp = await this._opps.findById(req.params.id)
    if (!opp) throw new NotFoundError('Oportunidade')
    if (opp.lar_id !== inst.id) throw new ForbiddenError()

    const { status } = req.body
    if (!['aprovado', 'rejeitado'].includes(status)) throw new ValidationError('Status inválido')

    const candidatura = await this._opps.updateApplicationStatus(req.params.appId, status)
    ok(res, candidatura, status === 'aprovado' ? 'Candidatura aprovada!' : 'Candidatura rejeitada.')
  }
}
