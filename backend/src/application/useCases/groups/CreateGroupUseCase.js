import { z } from 'zod'
import { ValidationError, ForbiddenError } from '../../../shared/errors/AppError.js'

const schema = z.object({
  nome: z.string().min(3).max(80),
  descricao: z.string().max(300).optional(),
})

export class CreateGroupUseCase {
  constructor(groupRepo, volunteerRepo) {
    this.groupRepo = groupRepo
    this.volunteerRepo = volunteerRepo
  }

  async execute(userId, input) {
    const result = schema.safeParse(input)
    if (!result.success) throw new ValidationError('Dados inválidos', result.error.errors)

    const voluntario = await this.volunteerRepo.findByUserId(userId)
    if (!voluntario) throw new ForbiddenError('Perfil de voluntário não encontrado')

    const grupo = await this.groupRepo.create({ ...result.data, criado_por: voluntario.id })
    await this.groupRepo.addMember(grupo.id, voluntario.id)
    return grupo
  }
}
