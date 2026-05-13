import { createLogger, format, transports } from 'winston'
import { env } from '../config/env.js'

export const logger = createLogger({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    env.nodeEnv === 'production'
      ? format.json()
      : format.combine(format.colorize(), format.simple()),
  ),
  transports: [new transports.Console()],
})
