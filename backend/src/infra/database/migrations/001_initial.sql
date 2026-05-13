CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role          AS ENUM ('admin', 'lar', 'voluntario');
CREATE TYPE invitation_status  AS ENUM ('pendente', 'aceito', 'recusado', 'expirado');
CREATE TYPE opportunity_status AS ENUM ('aberta', 'encerrada', 'cancelada', 'concluida');
CREATE TYPE application_status AS ENUM ('pendente', 'aprovado', 'rejeitado', 'retirado');

-- USERS
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT NOT NULL UNIQUE,
  senha_hash    TEXT NOT NULL,
  role          user_role NOT NULL DEFAULT 'voluntario',
  nome          TEXT NOT NULL,
  ativo         BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);

-- REFRESH TOKENS
CREATE TABLE refresh_tokens (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token     TEXT NOT NULL UNIQUE,
  expira_em TIMESTAMPTZ NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

-- CATEGORIAS
CREATE TABLE categorias (
  id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome  TEXT NOT NULL UNIQUE,
  icone TEXT
);

INSERT INTO categorias (nome, icone) VALUES
  ('Educacao', ''),
  ('Saude', ''),
  ('Assistencia Social', ''),
  ('Idosos', ''),
  ('Criancas e Adolescentes', ''),
  ('Deficiencia', ''),
  ('Meio Ambiente', ''),
  ('Cultura e Arte', ''),
  ('Esporte', ''),
  ('Tecnologia', ''),
  ('Juridico', ''),
  ('Psicologia', '');

-- PERFIL DO VOLUNTARIO
CREATE TABLE volunteer_profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  bio           TEXT,
  foto_url      TEXT,
  cidade        TEXT,
  estado        TEXT,
  habilidades   TEXT[]  DEFAULT '{}',
  interesses    TEXT[]  DEFAULT '{}',
  disponibilidade TEXT[] DEFAULT '{}',
  redes_sociais JSONB   DEFAULT '{}',
  visivel       BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_volunteer_user_id     ON volunteer_profiles(user_id);
CREATE INDEX idx_volunteer_cidade      ON volunteer_profiles(cidade);
CREATE INDEX idx_volunteer_habilidades ON volunteer_profiles USING GIN(habilidades);
CREATE INDEX idx_volunteer_interesses  ON volunteer_profiles USING GIN(interesses);

-- PERFIL DO LAR
CREATE TABLE institution_profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  nome_lar      TEXT NOT NULL,
  cnpj          TEXT UNIQUE,
  descricao     TEXT,
  logo_url      TEXT,
  endereco      TEXT,
  cidade        TEXT,
  estado        TEXT,
  cep           TEXT,
  telefone      TEXT,
  email_contato TEXT,
  responsavel   TEXT,
  site          TEXT,
  area_atuacao  TEXT,
  categorias    TEXT[] DEFAULT '{}',
  chave_pix     TEXT,
  verificado    BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_institution_user_id    ON institution_profiles(user_id);
CREATE INDEX idx_institution_cidade     ON institution_profiles(cidade);
CREATE INDEX idx_institution_categorias ON institution_profiles USING GIN(categorias);

-- OPORTUNIDADES
CREATE TABLE opportunities (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lar_id                 UUID NOT NULL REFERENCES institution_profiles(id) ON DELETE CASCADE,
  titulo                 TEXT NOT NULL,
  descricao              TEXT NOT NULL,
  categorias             TEXT[] DEFAULT '{}',
  habilidades_requeridas TEXT[] DEFAULT '{}',
  cidade                 TEXT,
  estado                 TEXT,
  data_inicio            DATE,
  data_fim               DATE,
  vagas_totais           INTEGER NOT NULL DEFAULT 1,
  vagas_preenchidas      INTEGER NOT NULL DEFAULT 0,
  carga_horaria          TEXT,
  presencial             BOOLEAN NOT NULL DEFAULT TRUE,
  status                 opportunity_status NOT NULL DEFAULT 'aberta',
  criado_em              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_opportunities_lar_id     ON opportunities(lar_id);
CREATE INDEX idx_opportunities_status     ON opportunities(status);
CREATE INDEX idx_opportunities_cidade     ON opportunities(cidade);
CREATE INDEX idx_opportunities_categorias ON opportunities USING GIN(categorias);

-- CANDIDATURAS
CREATE TABLE applications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  oportunidade_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  voluntario_id   UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
  mensagem        TEXT,
  status          application_status NOT NULL DEFAULT 'pendente',
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(oportunidade_id, voluntario_id)
);

CREATE INDEX idx_applications_oportunidade ON applications(oportunidade_id);
CREATE INDEX idx_applications_voluntario   ON applications(voluntario_id);

-- CONVITES
CREATE TABLE invitations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lar_id          UUID NOT NULL REFERENCES institution_profiles(id) ON DELETE CASCADE,
  voluntario_id   UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
  oportunidade_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  mensagem        TEXT,
  status          invitation_status NOT NULL DEFAULT 'pendente',
  expira_em       TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  respondido_em   TIMESTAMPTZ,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invitations_lar        ON invitations(lar_id);
CREATE INDEX idx_invitations_voluntario ON invitations(voluntario_id);
CREATE INDEX idx_invitations_status     ON invitations(status);

-- FAVORITOS
CREATE TABLE favorites (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lar_id        UUID NOT NULL REFERENCES institution_profiles(id) ON DELETE CASCADE,
  voluntario_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(lar_id, voluntario_id)
);

CREATE INDEX idx_favorites_lar ON favorites(lar_id);

-- TRIGGER atualizar atualizado_em
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.atualizado_em = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated         BEFORE UPDATE ON users               FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_volunteer_updated     BEFORE UPDATE ON volunteer_profiles   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_institution_updated   BEFORE UPDATE ON institution_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_opportunities_updated BEFORE UPDATE ON opportunities         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_applications_updated  BEFORE UPDATE ON applications          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
