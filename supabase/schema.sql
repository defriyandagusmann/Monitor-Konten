-- ==============================================================================
-- DATABASE SCHEMA: CONTENT PIPELINE MONITOR (SUPABASE POSTGRESQL)
-- FIX: FULL COLLABORATIVE ACCESS & REALTIME SYNC FOR TEAM
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table (Synced with Google Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'creator',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Channels Table
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  handle TEXT,
  color_hex TEXT DEFAULT '#F43F5E',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Contents Table (From Idea, Script to Posting)
CREATE TABLE IF NOT EXISTS public.contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'tiktok',
  stage TEXT NOT NULL DEFAULT 'idea',
  priority TEXT NOT NULL DEFAULT 'medium',
  
  -- SCRIPT STRUCTURE
  hook_script TEXT DEFAULT '',
  body_script TEXT DEFAULT '',
  cta_script TEXT DEFAULT '',
  visual_notes TEXT DEFAULT '',
  
  -- METRICS & ASSETS
  video_duration_sec INT DEFAULT 0,
  target_audience TEXT DEFAULT '',
  storage_asset_url TEXT DEFAULT '',
  published_url TEXT DEFAULT '',
  
  -- DATES
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  
  -- RELATIONS
  channel_id UUID REFERENCES public.channels(id) ON DELETE SET NULL,
  assigned_to TEXT,
  created_by TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Content Activities & Review Logs
CREATE TABLE IF NOT EXISTS public.content_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  user_id TEXT,
  activity_type TEXT NOT NULL,
  from_stage TEXT,
  to_stage TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Trigger to automatically save profile on Google Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. GRANT FULL PRIVILEGES (CRUCIAL: Prevents 42501 Permission Denied Error)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 8. ROW LEVEL SECURITY (RLS) - SHARED TEAM WORKSPACE
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_activities ENABLE ROW LEVEL SECURITY;

-- Allow ALL (anon + authenticated) to view, insert, update, delete shared content
DROP POLICY IF EXISTS "Allow all read contents" ON public.contents;
DROP POLICY IF EXISTS "Allow authenticated read contents" ON public.contents;
CREATE POLICY "Allow all read contents" ON public.contents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all insert contents" ON public.contents;
DROP POLICY IF EXISTS "Allow authenticated insert contents" ON public.contents;
CREATE POLICY "Allow all insert contents" ON public.contents FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all update contents" ON public.contents;
DROP POLICY IF EXISTS "Allow authenticated update contents" ON public.contents;
CREATE POLICY "Allow all update contents" ON public.contents FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow all delete contents" ON public.contents;
DROP POLICY IF EXISTS "Allow authenticated delete contents" ON public.contents;
CREATE POLICY "Allow all delete contents" ON public.contents FOR DELETE USING (true);

-- Allow ALL to read, insert, update profiles
DROP POLICY IF EXISTS "Allow all read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated read profiles" ON public.profiles;
CREATE POLICY "Allow all read profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated insert profiles" ON public.profiles;
CREATE POLICY "Allow all insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated update profiles" ON public.profiles;
CREATE POLICY "Allow all update profiles" ON public.profiles FOR UPDATE USING (true);

-- Channels
DROP POLICY IF EXISTS "Allow all read channels" ON public.channels;
DROP POLICY IF EXISTS "Allow authenticated read channels" ON public.channels;
CREATE POLICY "Allow all read channels" ON public.channels FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all manage channels" ON public.channels;
DROP POLICY IF EXISTS "Allow authenticated manage channels" ON public.channels;
CREATE POLICY "Allow all manage channels" ON public.channels FOR ALL USING (true);

-- Activities
DROP POLICY IF EXISTS "Allow all read activities" ON public.content_activities;
CREATE POLICY "Allow all read activities" ON public.content_activities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all insert activities" ON public.content_activities;
CREATE POLICY "Allow all insert activities" ON public.content_activities FOR INSERT WITH CHECK (true);

-- 9. REPLICA IDENTITY & REALTIME BROADCAST
ALTER TABLE public.contents REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'contents'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.contents;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
END $$;

-- 10. Seed Default Channels
INSERT INTO public.channels (name, platform, handle, color_hex) VALUES
  ('TikTok Utama', 'tiktok', '@kreatorkonten', '#F43F5E'),
  ('Instagram Reels', 'instagram', '@kreatorkonten.id', '#E11D48'),
  ('YouTube Shorts', 'youtube_shorts', 'Kreator Shorts Channel', '#DC2626'),
  ('YouTube Studio', 'youtube_long', 'Kreator Official Channel', '#EA580C')
ON CONFLICT DO NOTHING;
