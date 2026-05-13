import { Router } from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'

export function makeVolunteerRoutes(controller) {
  const router = Router()

  // Público — lares buscam voluntários
  router.get('/', (req, res, next) => controller.list(req, res).catch(next))
  router.get('/:id', (req, res, next) => controller.getById(req, res).catch(next))

  // Voluntário gerencia o próprio perfil
  router.get('/me/perfil', authenticate, authorize('voluntario'), (req, res, next) =>
    controller.getMyProfile(req, res).catch(next))
  router.put('/me/perfil', authenticate, authorize('voluntario'), (req, res, next) =>
    controller.updateMyProfile(req, res).catch(next))

  // Voluntário: ver suas próprias candidaturas
  router.get('/me/candidaturas', authenticate, authorize('voluntario'), (req, res, next) =>
    controller.listMyCandidaturas(req, res).catch(next))

  return router
}
