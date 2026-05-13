import { Router } from 'express'
import { authenticate, authorize } from '../middlewares/auth.js'

export function makeOpportunityRoutes(controller) {
  const router = Router()

  // Lar: listar próprias oportunidades (antes de /:id para não colidir)
  router.get('/me/lista', authenticate, authorize('lar'), (req, res, next) =>
    controller.listMine(req, res).catch(next))

  // Públicas
  router.get('/', (req, res, next) => controller.list(req, res).catch(next))
  router.get('/:id', (req, res, next) => controller.getById(req, res).catch(next))

  // Lar: criar
  router.post('/', authenticate, authorize('lar'), (req, res, next) =>
    controller.create(req, res).catch(next))

  // Lar: editar
  router.put('/:id', authenticate, authorize('lar'), (req, res, next) =>
    controller.update(req, res).catch(next))

  // Lar: mudar status (encerrar, reabrir, concluir)
  router.patch('/:id/status', authenticate, authorize('lar'), (req, res, next) =>
    controller.updateStatus(req, res).catch(next))

  // Lar: excluir
  router.delete('/:id', authenticate, authorize('lar'), (req, res, next) =>
    controller.delete(req, res).catch(next))

  // Voluntário: se candidatar
  router.post('/:id/candidatar', authenticate, authorize('voluntario'), (req, res, next) =>
    controller.candidatar(req, res).catch(next))

  // Lar: ver candidatos da oportunidade
  router.get('/:id/candidatos', authenticate, authorize('lar'), (req, res, next) =>
    controller.listCandidatos(req, res).catch(next))

  // Lar: aprovar/rejeitar candidatura
  router.patch('/:id/candidatos/:appId', authenticate, authorize('lar'), (req, res, next) =>
    controller.responderCandidatura(req, res).catch(next))

  return router
}
