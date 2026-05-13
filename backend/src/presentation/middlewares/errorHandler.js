import { AppError, ValidationError } from '../../shared/errors/AppError.js'
import { logger } from '../../shared/utils/logger.js'
import { error as sendError } from '../../shared/utils/response.js'

export function errorHandler(err, req, res, _next) {
  if (err instanceof ValidationError) {
    return sendError(res, err.message, 422, err.code, err.errors)
  }

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.code)
  }

  // Erro não tratado
  logger.error(err)
  return sendError(res, 'Erro interno do servidor', 500, 'INTERNAL_ERROR')
}
