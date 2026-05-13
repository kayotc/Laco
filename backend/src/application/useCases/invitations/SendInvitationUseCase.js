import { z } from 'zod'
import { ForbiddenError, ValidationError, AppError } from '../../../shared/errors/AppError.js'

const schema = z.object({
  voluntario_id: z.string().uuid(),
  mensagem: z.string().max(500).optional(),
})

export class SendInvitationUseCase {
  constructor(invitationRepo, volunteerRepo, institutionRepo) {
    this.invitationRepo = invitationRepo
    this.volunteerRepo = volunteerRepo
    this.institutionRepo = institutionRepo
  }

  async execute(larUserId, input) {
    const result = schema.safeParse(input)
    if (!result.success) throw new ValidationError('Dados inválidos', result.error.errors)

    const { voluntario_id, mensagem } = result.data

    const lar = await this.institutionRepo.findByUserId(larUserId)
    if (!lar) throw new ForbiddenError('Perfil do lar não encontrado')

    const voluntario = await this.volunteerRepo.findById(voluntario_id)
    if (!voluntario) throw new AppError('Voluntário não encontrado', 404)
    if (!voluntario.visivel) throw new ForbiddenError('Voluntário não está disponível')

    // Regra: máximo 3 convites pendentes para o mesmo voluntário por lar
    const pendentes = await this.invitationRepo.countPendentesHoje(lar.id, voluntario_id)
    if (pendentes >= 3) throw new AppError('Limite de convites diários para este voluntário atingido', 429)

    return this.invitationRepo.create({
      lar_id: lar.id,
      voluntario_id,
      mensagem,
    })
  }
}
