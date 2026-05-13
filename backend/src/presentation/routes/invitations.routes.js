import { Router } from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'

export function makeInvitationRoutes(controller) {
  const router = Router()

  // Lar envia convite e lista os enviados
  router.post('/', authenticate, authorize('lar'), (req, res, next) =>
    controller.send(req, res).catch(next))
  router.get('/enviados', authenticate, authorize('lar'), (req, res, next) =>
    controller.listByLar(req, res).catch(next))

  // Voluntário lista os recebidos e responde
  router.get('/recebidos', authenticate, authorize('voluntario'), (req, res, next) =>
    controller.listByVoluntario(req, res).catch(next))
  router.patch('/:id/responder', authenticate, authorize('voluntario'), (req, res, next) =>
    controller.respond(req, res).catch(next))

  return router
}
