import { Router } from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'

export function makeGroupRoutes(controller) {
  const router = Router()

  router.get('/', (req, res, next) => controller.list(req, res).catch(next))
  router.get('/meus', authenticate, authorize('voluntario'), (req, res, next) => controller.listMine(req, res).catch(next))

  // rotas de convites — devem vir ANTES de /:id para não colidir
  router.get('/convites/recebidos', authenticate, authorize('voluntario'), (req, res, next) => controller.listReceivedGroupInvitations(req, res).catch(next))
  router.patch('/convites/:id/responder', authenticate, authorize('voluntario'), (req, res, next) => controller.respondGroupInvitation(req, res).catch(next))

  router.post('/', authenticate, authorize('voluntario'), (req, res, next) => controller.create(req, res).catch(next))
  router.get('/:id', (req, res, next) => controller.getById(req, res).catch(next))
  router.get('/:id/membros', (req, res, next) => controller.members(req, res).catch(next))
  router.post('/:id/entrar', authenticate, authorize('voluntario'), (req, res, next) => controller.join(req, res).catch(next))
  router.delete('/:id/sair', authenticate, authorize('voluntario'), (req, res, next) => controller.leave(req, res).catch(next))
  router.post('/:id/membros', authenticate, authorize('voluntario'), (req, res, next) => controller.addMemberByCreator(req, res).catch(next))
  router.delete('/:id/membros/:voluntarioId', authenticate, authorize('voluntario'), (req, res, next) => controller.removeMemberByCreator(req, res).catch(next))
  router.post('/:id/convidar', authenticate, authorize('voluntario'), (req, res, next) => controller.sendGroupInvitation(req, res).catch(next))

  return router
}
