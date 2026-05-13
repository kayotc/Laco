import { z } from 'zod'
import { NotFoundError, ValidationError } from '../../../shared/errors/AppError.js'

const schema = z.object({
  nome_lar: z.string().min(2).optional(),
  cnpj: z.string().optional(),
  descricao: z.string().max(1000).optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().max(2).optional(),
  cep: z.string().optional(),
  telefone: z.string().optional(),
  email_contato: z.string().email().optional(),
  responsavel: z.string().optional(),
  site: z.string().url().optional().or(z.literal('')),
  area_atuacao: z.string().optional(),
  categorias: z.array(z.string()).optional(),
  chave_pix: z.string().optional(),
})

export class UpdateInstitutionProfileUseCase {
  constructor(institutionRepo) {
    this.institutionRepo = institutionRepo
  }

  async execute(userId, input) {
    const result = schema.safeParse(input)
    if (!result.success) throw new ValidationError('Dados inválidos', result.error.errors)

    const perfil = await this.institutionRepo.findByUserId(userId)
    if (!perfil) throw new NotFoundError('Perfil do lar')

    return this.institutionRepo.update(userId, result.data)
  }
}
