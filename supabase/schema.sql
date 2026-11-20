-- ==============================================================================
-- DATABASE SCHEMA: CONTENT PIPELINE MONITOR (SUPABASE POSTGRESQL)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table (Synced with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'creator', -- 'creator', 'editor', 'manager', 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Channels / Platforms Table
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'tiktok', 'instagram', 'youtube_shorts', 'youtube_long', 'linkedin'
  handle TEXT,
  color_hex TEXT DEFAULT '#F43F5E',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Contents Table (From Idea, Script to Posting)
CREATE TABLE IF NOT EXISTS public.contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'tiktok', -- 'tiktok', 'instagram', 'youtube_shorts', 'youtube_long'
  stage TEXT NOT NULL DEFAULT 'idea', -- 'idea', 'scripting', 'production', 'editing', 'review', 'published'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  
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
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Content Activities & Review Logs
CREATE TABLE IF NOT EXISTS public.content_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL, -- 'created', 'stage_change', 'comment', 'review_approved', 'revision_requested'
  from_stage TEXT,
  to_stage TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Trigger to automatically create profile on Supabase auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
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

-- 7. Row Level Security (RLS) - Shared Team Workspace
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_activities ENABLE ROW LEVEL SECURITY;

-- Shared workspace policy: All authenticated users can view, insert, update all contents
CREATE POLICY "Allow authenticated read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Allow authenticated read channels" ON public.channels FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated manage channels" ON public.channels FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated read contents" ON public.contents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert contents" ON public.contents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update contents" ON public.contents FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete contents" ON public.contents FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read activities" ON public.content_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert activities" ON public.content_activities FOR INSERT TO authenticated WITH CHECK (true);

-- 8. Enable Supabase Realtime for contents & activities
ALTER PUBLICATION supabase_realtime ADD TABLE public.contents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_activities;

-- 9. Seed Default Channels
INSERT INTO public.channels (name, platform, handle, color_hex) VALUES
  ('TikTok Utama', 'tiktok', '@kreatorkonten', '#F43F5E'),
  ('Instagram Reels', 'instagram', '@kreatorkonten.id', '#E11D48'),
  ('YouTube Shorts', 'youtube_shorts', 'Kreator Shorts Channel', '#DC2626'),
  ('YouTube Studio', 'youtube_long', 'Kreator Official Channel', '#EA580C')
ON CONFLICT DO NOTHING;

