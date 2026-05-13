import jwt from 'jsonwebtoken'
import { env } from '../../shared/config/env.js'
import { UnauthorizedError } from '../../shared/errors/AppError.js'

export class TokenProvider {
  generateAccessToken(payload) {
    return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn })
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn })
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, env.jwt.secret)
    } catch {
      throw new UnauthorizedError('Token inválido ou expirado')
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, env.jwt.refreshSecret)
    } catch {
      throw new UnauthorizedError('Refresh token inválido ou expirado')
    }
  }

  getRefreshExpiresAt() {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d.toISOString()
  }
}
