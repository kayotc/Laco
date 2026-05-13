import 'dotenv/config'
import http from 'http'
import { app } from './app.js'
import { env } from './shared/config/env.js'
import { logger } from './shared/utils/logger.js'

const server = http.createServer(app)

server.listen(env.port, () => {
  logger.info(`🚀 Laço API rodando em http://localhost:${env.port}`)
  logger.info(`   Ambiente: ${env.nodeEnv}`)
})

server.on('error', (err) => {
  logger.error('Erro no servidor:', err)
  process.exit(1)
})
