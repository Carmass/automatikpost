-- ══════════════════════════════════════════════════════════
-- AutomatikPOST — Initial Schema
-- Supabase PostgreSQL + RLS
-- ══════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── profiles (extends Supabase auth.users) ─────────────────
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT '',
  email       TEXT UNIQUE NOT NULL,
  role        TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin','editor','viewer')),
  avatar_url  TEXT,
  niche       TEXT DEFAULT 'marketing digital',
  site_name   TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── wordpress_sites ─────────────────────────────────────────
CREATE TABLE public.wordpress_sites (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  name            TEXT NOT NULL,
  url             TEXT NOT NULL,
  wp_user         TEXT NOT NULL,
  app_password    TEXT NOT NULL,   -- stored encrypted via pg_crypto
  status          TEXT DEFAULT 'unknown' CHECK (status IN ('online','offline','warning','unknown')),
  posts_count     INT DEFAULT 0,
  wp_version      TEXT,
  plugin_active   BOOLEAN DEFAULT FALSE,
  last_sync       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── posts ───────────────────────────────────────────────────
CREATE TABLE public.posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  title           TEXT NOT NULL DEFAULT '',
  content         TEXT DEFAULT '',
  excerpt         TEXT DEFAULT '',
  keyword         TEXT DEFAULT '',
  meta_desc       TEXT DEFAULT '',
  category        TEXT DEFAULT 'Geral',
  tags            TEXT[] DEFAULT '{}',
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft','scheduled','published','processing','archived')),
  seo_score       INT DEFAULT 0 CHECK (seo_score BETWEEN 0 AND 100),
  word_count      INT DEFAULT 0,
  readability     INT DEFAULT 0,
  featured_image  TEXT,
  author_id       UUID REFERENCES public.profiles,
  wp_site_id      UUID REFERENCES public.wordpress_sites,
  wp_post_id      INT,
  scheduled_at    TIMESTAMPTZ,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── post_tasks ──────────────────────────────────────────────
CREATE TABLE public.post_tasks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES public.posts ON DELETE CASCADE,
  title       TEXT NOT NULL,
  done        BOOLEAN DEFAULT FALSE,
  assignee_id UUID REFERENCES public.profiles,
  due_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── post_versions ────────────────────────────────────────────
CREATE TABLE public.post_versions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES public.posts ON DELETE CASCADE,
  version_num INT NOT NULL,
  title       TEXT,
  content     TEXT,
  saved_by    UUID REFERENCES public.profiles,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── post_comments ────────────────────────────────────────────
CREATE TABLE public.post_comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES public.posts ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES public.profiles,
  text        TEXT NOT NULL,
  position    INT DEFAULT 0,
  resolved    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── automations ──────────────────────────────────────────────
CREATE TABLE public.automations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  name        TEXT NOT NULL,
  trigger     TEXT NOT NULL,
  category    TEXT DEFAULT 'Publicação',
  active      BOOLEAN DEFAULT TRUE,
  runs        INT DEFAULT 0,
  last_run    TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── automation_logs ──────────────────────────────────────────
CREATE TABLE public.automation_logs (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_id  UUID REFERENCES public.automations ON DELETE SET NULL,
  post_id        UUID REFERENCES public.posts ON DELETE SET NULL,
  event          TEXT,
  status         TEXT DEFAULT 'success' CHECK (status IN ('success','error')),
  error_msg      TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── publish_logs ─────────────────────────────────────────────
CREATE TABLE public.publish_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID REFERENCES public.posts ON DELETE SET NULL,
  user_id     UUID REFERENCES public.profiles,
  wp_site_id  UUID REFERENCES public.wordpress_sites,
  wp_post_id  INT,
  status      TEXT DEFAULT 'success' CHECK (status IN ('success','error')),
  type        TEXT DEFAULT 'publicado',
  duration_ms INT,
  error_msg   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── backups ──────────────────────────────────────────────────
CREATE TABLE public.backups (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  name         TEXT NOT NULL,
  posts_count  INT DEFAULT 0,
  size_bytes   BIGINT DEFAULT 0,
  type         TEXT DEFAULT 'auto' CHECK (type IN ('auto','manual')),
  status       TEXT DEFAULT 'ok' CHECK (status IN ('ok','error','running')),
  storage_path TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── media ────────────────────────────────────────────────────
CREATE TABLE public.media (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  name         TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('image','video','pdf','audio','other')),
  size_bytes   BIGINT DEFAULT 0,
  url          TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  used_count   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── notifications ────────────────────────────────────────────
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  icon        TEXT DEFAULT '🔔',
  text        TEXT NOT NULL,
  type        TEXT DEFAULT 'info' CHECK (type IN ('info','success','warning','error')),
  read        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── recurring_schedules ──────────────────────────────────────
CREATE TABLE public.recurring_schedules (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  name        TEXT NOT NULL,
  template_id UUID,
  frequency   TEXT NOT NULL,
  time_of_day TIME NOT NULL DEFAULT '09:00',
  wp_site_id  UUID REFERENCES public.wordpress_sites,
  active      BOOLEAN DEFAULT TRUE,
  generated   INT DEFAULT 0,
  next_run    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── projects ─────────────────────────────────────────────────
CREATE TABLE public.projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  status      TEXT DEFAULT 'active' CHECK (status IN ('active','paused','completed','archived')),
  priority    TEXT DEFAULT 'med' CHECK (priority IN ('high','med','low')),
  progress    INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  owner_id    UUID REFERENCES public.profiles,
  deadline    DATE,
  target_posts INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── project_tasks ────────────────────────────────────────────
CREATE TABLE public.project_tasks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES public.projects ON DELETE CASCADE,
  title       TEXT NOT NULL,
  tag         TEXT DEFAULT 'Geral',
  priority    TEXT DEFAULT 'med' CHECK (priority IN ('high','med','low')),
  status      TEXT DEFAULT 'backlog' CHECK (status IN ('backlog','producao','revisao','publicado')),
  due_date    DATE,
  assignee_id UUID REFERENCES public.profiles,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── webhooks ─────────────────────────────────────────────────
CREATE TABLE public.webhooks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  name        TEXT NOT NULL,
  url         TEXT NOT NULL,
  event       TEXT NOT NULL,
  active      BOOLEAN DEFAULT TRUE,
  calls_count INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── sources ──────────────────────────────────────────────────
CREATE TABLE public.sources (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles ON DELETE CASCADE,
  name        TEXT NOT NULL,
  type        TEXT DEFAULT 'RSS' CHECK (type IN ('RSS','YouTube','Keyword','Scraper','Trend')),
  url         TEXT DEFAULT '',
  active      BOOLEAN DEFAULT TRUE,
  items_count INT DEFAULT 0,
  last_fetch  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════════════════════════
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_post_tasks_post_id ON public.post_tasks(post_id);
CREATE INDEX idx_post_versions_post_id ON public.post_versions(post_id);
CREATE INDEX idx_publish_logs_post_id ON public.publish_logs(post_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id, read, created_at DESC);
CREATE INDEX idx_automations_user_id ON public.automations(user_id);

-- ══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════════
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wordpress_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publish_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

-- Profiles: usuário vê/edita só o próprio, admin vê todos
CREATE POLICY "profiles_self" ON public.profiles
  FOR ALL USING (auth.uid() = id);
CREATE POLICY "profiles_admin_read" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Posts: usuário vê os próprios; admin vê todos
CREATE POLICY "posts_own" ON public.posts
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "posts_admin" ON public.posts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Macro policy: todas as demais tabelas seguem owner = auth.uid()
CREATE POLICY "own_rows" ON public.wordpress_sites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_rows" ON public.automations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_rows" ON public.backups FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_rows" ON public.media FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_rows" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_rows" ON public.recurring_schedules FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_rows" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_rows" ON public.webhooks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_rows" ON public.sources FOR ALL USING (auth.uid() = user_id);

-- Tasks/Versions/Comments: access via post ownership
CREATE POLICY "via_post" ON public.post_tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND user_id = auth.uid())
);
CREATE POLICY "via_post" ON public.post_versions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND user_id = auth.uid())
);
CREATE POLICY "via_post" ON public.post_comments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND user_id = auth.uid())
);
CREATE POLICY "via_post" ON public.publish_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "via_automation" ON public.automation_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.automations WHERE id = automation_id AND user_id = auth.uid())
);
CREATE POLICY "via_project" ON public.project_tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND user_id = auth.uid())
);

-- ══════════════════════════════════════════════════════════
-- TRIGGERS — updated_at automático
-- ══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ══════════════════════════════════════════════════════════
-- FUNCTION — criar profile automaticamente no signup
-- ══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'editor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ══════════════════════════════════════════════════════════
-- REALTIME — tabelas com realtime habilitado
-- ══════════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.automation_logs;
