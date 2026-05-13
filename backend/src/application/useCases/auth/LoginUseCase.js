import { z } from 'zod'
import { UnauthorizedError, ValidationError } from '../../../shared/errors/AppError.js'

const schema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
})

export class LoginUseCase {
  constructor(userRepo, hashProvider, tokenProvider) {
    this.userRepo = userRepo
    this.hashProvider = hashProvider
    this.tokenProvider = tokenProvider
  }

  async execute(input) {
    const result = schema.safeParse(input)
    if (!result.success) throw new ValidationError('Dados inválidos', result.error.errors)

    const { email, senha } = result.data

    const userRow = await this.userRepo.findByEmail(email)
    if (!userRow) throw new UnauthorizedError('E-mail ou senha incorretos')
    if (!userRow.ativo) throw new UnauthorizedError('Conta desativada. Entre em contato com o suporte.')

    const senhaCorreta = await this.hashProvider.compare(senha, userRow.senha_hash)
    if (!senhaCorreta) throw new UnauthorizedError('E-mail ou senha incorretos')

    const payload = { id: userRow.id, email: userRow.email, role: userRow.role }
    const accessToken = this.tokenProvider.generateAccessToken(payload)
    const refreshToken = this.tokenProvider.generateRefreshToken(payload)
    await this.userRepo.saveRefreshToken(userRow.id, refreshToken, this.tokenProvider.getRefreshExpiresAt())

    return {
      user: { id: userRow.id, email: userRow.email, nome: userRow.nome, role: userRow.role },
      accessToken,
      refreshToken,
    }
  }
}
