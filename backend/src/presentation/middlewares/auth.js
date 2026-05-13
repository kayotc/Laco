import { TokenProvider } from '../../infra/providers/TokenProvider.js'
import { UnauthorizedError, ForbiddenError } from '../../shared/errors/AppError.js'

const tokenProvider = new TokenProvider()

export function authenticate(req, _res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) throw new UnauthorizedError('Token não fornecido')

  const token = header.slice(7)
  req.user = tokenProvider.verifyAccessToken(token)
  next()
}

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) throw new UnauthorizedError()
    if (!roles.includes(req.user.role)) throw new ForbiddenError('Acesso restrito')
    next()
  }
}
