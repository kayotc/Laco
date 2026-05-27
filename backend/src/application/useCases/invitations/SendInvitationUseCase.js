import { z } from 'zod'
import { ForbiddenError, ValidationError, AppError } from '../../../shared/errors/AppError.js'

const schema = z.object({
  voluntario_id: z.string().uuid(),
  oportunidade_id: z.string().uuid(),
  mensagem: z.string().max(500).optional(),
})

export class SendInvitationUseCase {
  constructor(invitationRepo, volunteerRepo, institutionRepo, opportunityRepo) {
    this.invitationRepo = invitationRepo
    this.volunteerRepo = volunteerRepo
    this.institutionRepo = institutionRepo
    this.opportunityRepo = opportunityRepo
  }

  async execute(larUserId, input) {
    const result = schema.safeParse(input)
    if (!result.success) throw new ValidationError('Dados inválidos', result.error.errors)

    const { voluntario_id, oportunidade_id, mensagem } = result.data

    const lar = await this.institutionRepo.findByUserId(larUserId)
    if (!lar) throw new ForbiddenError('Perfil do lar não encontrado')

    const oportunidade = await this.opportunityRepo.findById(oportunidade_id)
    if (!oportunidade) throw new AppError('Oportunidade não encontrada', 404)
    if (oportunidade.lar_id !== lar.id) throw new ForbiddenError('Esta oportunidade não pertence ao seu lar')
    if (oportunidade.status !== 'aberta') throw new AppError('Só é possível convidar para oportunidades abertas', 422)

    const voluntario = await this.volunteerRepo.findById(voluntario_id)
    if (!voluntario) throw new AppError('Voluntário não encontrado', 404)
    if (!voluntario.visivel) throw new ForbiddenError('Voluntário não está disponível')

    const pendentes = await this.invitationRepo.countPendentesHoje(lar.id, voluntario_id)
    if (pendentes >= 3) throw new AppError('Limite de convites diários para este voluntário atingido', 429)

    return this.invitationRepo.create({
      lar_id: lar.id,
      voluntario_id,
      oportunidade_id,
      mensagem,
    })
  }
}
