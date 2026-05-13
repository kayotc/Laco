import { z } from 'zod'
import { ForbiddenError, NotFoundError, ValidationError, AppError } from '../../../shared/errors/AppError.js'

const schema = z.object({
  resposta: z.enum(['aceito', 'recusado']),
})

export class RespondInvitationUseCase {
  constructor(invitationRepo, volunteerRepo) {
    this.invitationRepo = invitationRepo
    this.volunteerRepo = volunteerRepo
  }

  async execute(voluntarioUserId, conviteId, input) {
    const result = schema.safeParse(input)
    if (!result.success) throw new ValidationError('Resposta inválida', result.error.errors)

    const convite = await this.invitationRepo.findById(conviteId)
    if (!convite) throw new NotFoundError('Convite')

    const voluntario = await this.volunteerRepo.findByUserId(voluntarioUserId)
    if (!voluntario || voluntario.id !== convite.voluntario_id) {
      throw new ForbiddenError('Este convite não pertence a você')
    }

    if (!convite.estaPendente()) {
      throw new AppError('Convite não está mais pendente', 400)
    }

    return this.invitationRepo.updateStatus(conviteId, result.data.resposta)
  }
}
