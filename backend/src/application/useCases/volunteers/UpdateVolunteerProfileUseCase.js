import { z } from 'zod'
import { NotFoundError, ValidationError } from '../../../shared/errors/AppError.js'

const schema = z.object({
  nome: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  cidade: z.string().optional(),
  estado: z.string().max(2).optional(),
  habilidades: z.array(z.string()).optional(),
  interesses: z.array(z.string()).optional(),
  disponibilidade: z.array(z.string()).optional(),
  redes_sociais: z.record(z.string()).optional(),
  visivel: z.boolean().optional(),
})

export class UpdateVolunteerProfileUseCase {
  constructor(volunteerRepo) {
    this.volunteerRepo = volunteerRepo
  }

  async execute(userId, input) {
    const result = schema.safeParse(input)
    if (!result.success) throw new ValidationError('Dados inválidos', result.error.errors)

    const perfil = await this.volunteerRepo.findByUserId(userId)
    if (!perfil) throw new NotFoundError('Perfil de voluntário')

    return this.volunteerRepo.update(userId, result.data)
  }
}
