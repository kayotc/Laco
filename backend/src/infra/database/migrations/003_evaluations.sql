-- MIGRATION 003: tabela de avaliações
-- Execute no Supabase: Dashboard → SQL Editor → New query → cole e rode

CREATE TABLE IF NOT EXISTS evaluations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  remetente_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  destinatario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  oportunidade_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  nota            INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario      TEXT,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(remetente_id, oportunidade_id)
);

CREATE INDEX IF NOT EXISTS idx_evaluations_destinatario ON evaluations(destinatario_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_remetente    ON evaluations(remetente_id);
