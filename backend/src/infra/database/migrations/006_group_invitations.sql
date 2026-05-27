CREATE TABLE IF NOT EXISTS group_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  invitante_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
  convidado_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
  mensagem TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceito', 'recusado')),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  respondido_em TIMESTAMPTZ,
  UNIQUE (group_id, convidado_id)
);
