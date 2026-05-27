import { Router } from 'express'
import multer from 'multer'
import { authenticate, authorize } from '../middlewares/auth.js'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

export function makeInstitutionRoutes(controller) {
  const router = Router()

  router.get('/', (req, res, next) => controller.list(req, res).catch(next))
  router.get('/:id', (req, res, next) => controller.getById(req, res).catch(next))

  router.get('/me/perfil', authenticate, authorize('lar'), (req, res, next) =>
    controller.getMyProfile(req, res).catch(next))
  router.put('/me/perfil', authenticate, authorize('lar'), (req, res, next) =>
    controller.updateMyProfile(req, res).catch(next))
  router.post('/me/logo', authenticate, authorize('lar'), upload.single('foto'), (req, res, next) =>
    controller.uploadLogo(req, res).catch(next))

  return router
}
