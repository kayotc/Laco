import { Router } from 'express'
import { authenticate } from '../middlewares/auth.js'

export function makeEvaluationRoutes(controller) {
  const router = Router()

  router.post('/', authenticate, (req, res, next) =>
    controller.create(req, res).catch(next))

  router.get('/usuario/:userId', (req, res, next) =>
    controller.listByUser(req, res).catch(next))

  return router
}
