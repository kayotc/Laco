import { UnauthorizedError } from '../../../shared/errors/AppError.js'

export class RefreshTokenUseCase {
  constructor(userRepo, tokenProvider) {
    this.userRepo = userRepo
    this.tokenProvider = tokenProvider
  }

  async execute(token) {
    if (!token) throw new UnauthorizedError('Refresh token não fornecido')

    const stored = await this.userRepo.findRefreshToken(token)
    if (!stored) throw new UnauthorizedError('Refresh token inválido ou expirado')

    this.tokenProvider.verifyRefreshToken(token)

    const user = stored.users
    const payload = { id: user.id, email: user.email, role: user.role }
    const newAccessToken = this.tokenProvider.generateAccessToken(payload)
    const newRefreshToken = this.tokenProvider.generateRefreshToken(payload)

    await this.userRepo.deleteRefreshToken(token)
    await this.userRepo.saveRefreshToken(user.id, newRefreshToken, this.tokenProvider.getRefreshExpiresAt())

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }
}
