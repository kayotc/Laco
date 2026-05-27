import { ok } from '../../shared/utils/response.js'
import { AppError } from '../../shared/errors/AppError.js'

export class GroupController {
  constructor(groupRepo, volunteerRepo, createGroupUC, joinGroupUC, leaveGroupUC, groupInvitationRepo) {
    this.groupRepo = groupRepo
    this.volunteerRepo = volunteerRepo
    this._create = createGroupUC
    this._join = joinGroupUC
    this._leave = leaveGroupUC
    this.groupInvitationRepo = groupInvitationRepo
  }

  async list(req, res) {
    const grupos = await this.groupRepo.findAll()
    ok(res, grupos)
  }

  async getById(req, res) {
    const grupo = await this.groupRepo.findById(req.params.id)
    if (!grupo) return res.status(404).json({ message: 'Grupo não encontrado' })
    res.json(grupo)
  }

  async listMine(req, res) {
    const voluntario = await this.volunteerRepo.findByUserId(req.user.id)
    if (!voluntario) return ok(res, [])
    const grupos = await this.groupRepo.findByVoluntario(voluntario.id)
    ok(res, grupos)
  }

  async create(req, res) {
    const grupo = await this._create.execute(req.user.id, req.body)
    res.status(201).json(grupo)
  }

  async members(req, res) {
    const membros = await this.groupRepo.listMembers(req.params.id)
    res.json(membros)
  }

  async join(req, res) {
    await this._join.execute(req.user.id, req.params.id)
    res.json({ success: true })
  }

  async leave(req, res) {
    await this._leave.execute(req.user.id, req.params.id)
    res.json({ success: true })
  }

  async addMemberByCreator(req, res) {
    const voluntario = await this.volunteerRepo.findByUserId(req.user.id)
    if (!voluntario) return res.status(403).json({ message: 'Perfil não encontrado' })
    const grupo = await this.groupRepo.findById(req.params.id)
    if (!grupo) return res.status(404).json({ message: 'Grupo não encontrado' })
    if (grupo.criado_por !== voluntario.id) return res.status(403).json({ message: 'Apenas o criador pode adicionar membros' })
    const { voluntario_id } = req.body
    if (!voluntario_id) return res.status(400).json({ message: 'voluntario_id é obrigatório' })
    await this.groupRepo.addMember(req.params.id, voluntario_id)
    res.json({ success: true })
  }

  async removeMemberByCreator(req, res) {
    const voluntario = await this.volunteerRepo.findByUserId(req.user.id)
    if (!voluntario) return res.status(403).json({ message: 'Perfil não encontrado' })
    const grupo = await this.groupRepo.findById(req.params.id)
    if (!grupo) return res.status(404).json({ message: 'Grupo não encontrado' })
    if (grupo.criado_por !== voluntario.id) return res.status(403).json({ message: 'Apenas o criador pode remover membros' })
    await this.groupRepo.removeMember(req.params.id, req.params.voluntarioId)
    res.json({ success: true })
  }

  async sendGroupInvitation(req, res) {
    const voluntario = await this.volunteerRepo.findByUserId(req.user.id)
    if (!voluntario) return res.status(403).json({ message: 'Perfil não encontrado' })
    const grupo = await this.groupRepo.findById(req.params.id)
    if (!grupo) return res.status(404).json({ message: 'Grupo não encontrado' })
    if (grupo.criado_por !== voluntario.id) return res.status(403).json({ message: 'Apenas o criador pode convidar' })
    const { convidado_id, mensagem } = req.body
    if (!convidado_id) return res.status(400).json({ message: 'convidado_id é obrigatório' })
    const jaMembro = await this.groupRepo.isMember(req.params.id, convidado_id)
    if (jaMembro) return res.status(409).json({ message: 'Voluntário já é membro do grupo' })
    const convite = await this.groupInvitationRepo.create({
      group_id: req.params.id,
      invitante_id: voluntario.id,
      convidado_id,
      mensagem,
    })
    res.status(201).json(convite)
  }

  async listReceivedGroupInvitations(req, res) {
    const voluntario = await this.volunteerRepo.findByUserId(req.user.id)
    if (!voluntario) return res.json([])
    const convites = await this.groupInvitationRepo.findByConvidado(voluntario.id)
    res.json(convites)
  }

  async respondGroupInvitation(req, res) {
    const voluntario = await this.volunteerRepo.findByUserId(req.user.id)
    if (!voluntario) return res.status(403).json({ message: 'Perfil não encontrado' })
    const convite = await this.groupInvitationRepo.findById(req.params.id)
    if (!convite) return res.status(404).json({ message: 'Convite não encontrado' })
    if (convite.convidado_id !== voluntario.id) return res.status(403).json({ message: 'Sem permissão' })
    if (convite.status !== 'pendente') return res.status(422).json({ message: 'Convite já respondido' })
    const { resposta } = req.body
    if (!['aceito', 'recusado'].includes(resposta)) return res.status(400).json({ message: 'Resposta inválida' })
    await this.groupInvitationRepo.updateStatus(req.params.id, resposta)
    if (resposta === 'aceito') {
      await this.groupRepo.addMember(convite.group_id, voluntario.id).catch(() => {})
    }
    res.json({ success: true })
  }
}
