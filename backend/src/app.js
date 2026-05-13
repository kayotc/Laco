import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { env } from './shared/config/env.js'
import { errorHandler } from './presentation/middlewares/errorHandler.js'

// Controllers (via container)
import {
  authController,
  volunteerController,
  institutionController,
  invitationController,
  opportunityController,
  evaluationController,
} from './infra/container.js'

// Routes factories
import { makeAuthRoutes } from './presentation/routes/auth.routes.js'
import { makeVolunteerRoutes } from './presentation/routes/volunteers.routes.js'
import { makeInstitutionRoutes } from './presentation/routes/institutions.routes.js'
import { makeInvitationRoutes } from './presentation/routes/invitations.routes.js'
import { makeOpportunityRoutes } from './presentation/routes/opportunities.routes.js'
import { makeEvaluationRoutes } from './presentation/routes/evaluations.routes.js'

const app = express()

// Segurança básica
app.use(helmet())
app.use(cors({ origin: env.frontendUrl, credentials: true }))
app.use(express.json({ limit: '2mb' }))

// Rate limit global
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }))

// Rotas
app.use('/api/auth',          makeAuthRoutes(authController))
app.use('/api/voluntarios',  makeVolunteerRoutes(volunteerController))
app.use('/api/lares',        makeInstitutionRoutes(institutionController))
app.use('/api/convites',     makeInvitationRoutes(invitationController))
app.use('/api/oportunidades', makeOpportunityRoutes(opportunityController))
app.use('/api/avaliacoes',   makeEvaluationRoutes(evaluationController))

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }))

// 404
app.use((_req, res) => res.status(404).json({ success: false, message: 'Rota não encontrada' }))

// Error handler global
app.use(errorHandler)

export { app }
