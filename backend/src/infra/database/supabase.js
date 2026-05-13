import { createClient } from '@supabase/supabase-js'
import { env } from '../../shared/config/env.js'
import { logger } from '../../shared/utils/logger.js'

if (!env.supabase.url || !env.supabase.serviceKey) {
  logger.warn('SUPABASE_URL ou SUPABASE_SERVICE_KEY não configurados')
}

export const supabase = createClient(env.supabase.url, env.supabase.serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export async function query(table) {
  return supabase.from(table)
}
