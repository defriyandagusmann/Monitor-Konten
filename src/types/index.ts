export type ContentStage = 
  | 'idea' 
  | 'scripting' 
  | 'production' 
  | 'editing' 
  | 'review' 
  | 'published';

export type Platform = 
  | 'tiktok' 
  | 'instagram' 
  | 'youtube_shorts' 
  | 'youtube_long' 
  | 'linkedin';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'creator' | 'scriptwriter' | 'editor' | 'reviewer' | 'lead';
}

export interface Channel {
  id: string;
  name: string;
  platform: Platform;
  handle: string;
  color_hex: string;
}

export interface ContentItem {
  id: string;
  title: string;
  platform: Platform;
  stage: ContentStage;
  priority: Priority;
  
  // Script Breakdown
  hook_script: string;
  body_script: string;
  cta_script: string;
  visual_notes: string;
  
  // Media & Metadata
  video_duration_sec: number;
  target_audience?: string;
  storage_asset_url?: string;
  published_url?: string;
  
  // Dates
  scheduled_at?: string | null;
  published_at?: string | null;
  
  // Associations
  channel_id?: string;
  assigned_to?: string;
  created_by?: string;
  
  assignee?: Profile;
  creator?: Profile;
  
  created_at: string;
  updated_at: string;
}

export interface ContentActivity {
  id: string;
  content_id: string;
  user_id?: string;
  activity_type: 'created' | 'stage_change' | 'comment' | 'review_approved' | 'revision_requested';
  from_stage?: ContentStage;
  to_stage?: ContentStage;
  message?: string;
  created_at: string;
  user?: Profile;
}

export interface StageDefinition {
  id: ContentStage;
  title: string;
  subtitle: string;
  icon: string;
  badgeColor: string;
  glowColor: string;
}

