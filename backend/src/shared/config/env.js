import 'dotenv/config'

export const env = {
  port: parseInt(process.env.PORT ?? '3001'),
  nodeEnv: process.env.NODE_ENV ?? 'development',

  supabase: {
    url: process.env.SUPABASE_URL ?? '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY ?? '',
  },

  jwt: {
    secret: process.env.JWT_SECRET ?? 'fallback-secret-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },

  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS ?? '10'),
}
