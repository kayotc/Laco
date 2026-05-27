import { z } from 'zod'
import { ConflictError, ValidationError } from '../../../shared/errors/AppError.js'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'Senha deve ter mínimo 8 caracteres'),
  nome: z.string().min(2, 'Nome deve ter mínimo 2 caracteres'),
  role: z.enum(['lar', 'voluntario']),
  cnpj: z.string().optional(),
})

export class RegisterUseCase {
  constructor(userRepo, volunteerRepo, institutionRepo, hashProvider, tokenProvider) {
    this.userRepo = userRepo
    this.volunteerRepo = volunteerRepo
    this.institutionRepo = institutionRepo
    this.hashProvider = hashProvider
    this.tokenProvider = tokenProvider
  }

  async execute(input) {
    const result = schema.safeParse(input)
    if (!result.success) throw new ValidationError('Dados inválidos', result.error.errors)

    const { email, senha, nome, role, cnpj } = result.data

    const existing = await this.userRepo.findByEmail(email)
    if (existing) throw new ConflictError('E-mail já cadastrado')

    const senha_hash = await this.hashProvider.hash(senha)
    const user = await this.userRepo.create({ email, senha_hash, nome, role })

    // Criar perfil inicial baseado no role
    if (role === 'voluntario') {
      await this.volunteerRepo.create({ user_id: user.id, nome })
    } else if (role === 'lar') {
      await this.institutionRepo.create({ user_id: user.id, nome_lar: nome, cnpj: cnpj ?? null })
    }

    const payload = { id: user.id, email: user.email, role: user.role }
    const accessToken = this.tokenProvider.generateAccessToken(payload)
    const refreshToken = this.tokenProvider.generateRefreshToken(payload)
    await this.userRepo.saveRefreshToken(user.id, refreshToken, this.tokenProvider.getRefreshExpiresAt())

    return { user: { id: user.id, email: user.email, nome: user.nome, role: user.role }, accessToken, refreshToken }
  }
}
