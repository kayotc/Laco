-- MIGRATION 002: colunas extras em volunteer_profiles
-- Execute no Supabase: Dashboard → SQL Editor → New query → cole e rode

ALTER TABLE volunteer_profiles
  ADD COLUMN IF NOT EXISTS disponibilidade_locais TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS experiencias            JSONB   DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS certificados            TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS reputacao_score         INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_horas             INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_acoes             INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_volunteer_reputacao
  ON volunteer_profiles(reputacao_score DESC);

-- Após rodar a migration, o SELECT_PUBLIC no VolunteerRepository.js
-- pode ser restaurado para incluir todas as colunas:
--
-- const SELECT_PUBLIC = `
--   id, user_id, nome, bio, foto_url, cidade, estado,
--   habilidades, interesses, disponibilidade, disponibilidade_locais,
--   experiencias, certificados, redes_sociais,
--   reputacao_score, total_horas, total_acoes, visivel, criado_em, atualizado_em
-- `
--
-- E o search pode voltar a ordernar por reputacao_score:
--   .order('reputacao_score', { ascending: false })
