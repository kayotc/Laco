import { Router } from 'express'
import { authenticate } from '../middlewares/auth.js'

export function makeAuthRoutes(controller) {
  const router = Router()

  router.post('/register', (req, res, next) => controller.register(req, res).catch(next))
  router.post('/login',    (req, res, next) => controller.login(req, res).catch(next))
  router.post('/refresh',  (req, res, next) => controller.refresh(req, res).catch(next))
  router.post('/logout',   (req, res, next) => controller.logout(req, res).catch(next))
  router.get('/me', authenticate, (req, res, next) => controller.me(req, res).catch(next))

  return router
}
