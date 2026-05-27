CREATE TABLE IF NOT EXISTS groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  descricao   TEXT,
  criado_por  UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS group_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id      UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  voluntario_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
  entrou_em     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(group_id, voluntario_id)
);
