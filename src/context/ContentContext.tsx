'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Channel, ContentActivity, ContentItem, ContentStage, Platform, Profile } from '@/types';
import { MOCK_CHANNELS, MOCK_CONTENTS, MOCK_PROFILES } from '@/lib/mockData';
import { isSupabaseConfigured, signInWithGoogle, signOut, supabase } from '@/lib/supabase/client';

interface ContentContextType {
  contents: ContentItem[];
  profiles: Profile[];
  channels: Channel[];
  currentUser: Profile | null;
  isRealtimeActive: boolean;
  isConfigured: boolean;
  loading: boolean;
  
  // Navigation & Filters
  activeTab: 'kanban' | 'calendar' | 'scriptlab' | 'analytics';
  setActiveTab: (tab: 'kanban' | 'calendar' | 'scriptlab' | 'analytics') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  platformFilter: string;
  setPlatformFilter: (platform: string) => void;
  memberFilter: string;
  setMemberFilter: (memberId: string) => void;
  
  // Actions
  addContent: (newItem: Partial<ContentItem>) => Promise<ContentItem>;
  updateContent: (id: string, updates: Partial<ContentItem>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  moveStage: (id: string, toStage: ContentStage) => Promise<void>;
  
  // Auth
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  
  // Active detail modal
  selectedContentId: string | null;
  setSelectedContentId: (id: string | null) => void;
  isNewModalOpen: boolean;
  setIsNewModalOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
  const [channels, setChannels] = useState<Channel[]>(MOCK_CHANNELS);
  const [currentUser, setCurrentUser] = useState<Profile | null>(MOCK_PROFILES[0]);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<'kanban' | 'calendar' | 'scriptlab' | 'analytics'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [memberFilter, setMemberFilter] = useState('all');

  // Modals
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    let channelSubscription: any = null;

    async function initData() {
      setLoading(true);

      if (isSupabaseConfigured && supabase) {
        try {
          // Check Auth Session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setCurrentUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Kreator',
              avatar_url: session.user.user_metadata?.avatar_url || '',
              role: 'creator',
            });
          }

          // Listen to auth state change (Google OAuth login / logout)
          supabase.auth.onAuthStateChange(async (_event, currentSession) => {
            if (currentSession?.user) {
              setCurrentUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                full_name: currentSession.user.user_metadata?.full_name || currentSession.user.email?.split('@')[0] || 'Kreator',
                avatar_url: currentSession.user.user_metadata?.avatar_url || '',
                role: 'creator',
              });
            } else {
              setCurrentUser(null);
            }
          });

          // Fetch Profiles
          const { data: profilesData } = await supabase.from('profiles').select('*');
          if (profilesData && profilesData.length > 0) {
            setProfiles(profilesData);
          }

          // Fetch Channels
          const { data: channelsData } = await supabase.from('channels').select('*');
          if (channelsData && channelsData.length > 0) {
            setChannels(channelsData);
          }

          // Fetch Contents
          const { data: contentsData, error } = await supabase
            .from('contents')
            .select('*, assignee:assigned_to(*), creator:created_by(*)')
            .order('created_at', { ascending: false });

          if (!error && contentsData && contentsData.length > 0) {
            setContents(contentsData);
          } else {
            // If table is empty, seed with initial mock data
            setContents(MOCK_CONTENTS);
          }

          // Setup Realtime Subscription
          channelSubscription = supabase
            .channel('public:contents')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'contents' },
              (payload: any) => {
                if (payload.eventType === 'INSERT') {
                  setContents((prev) => [payload.new as ContentItem, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                  setContents((prev) =>
                    prev.map((c) => (c.id === payload.new.id ? { ...c, ...payload.new } : c))
                  );
                } else if (payload.eventType === 'DELETE') {
                  setContents((prev) => prev.filter((c) => c.id === payload.old.id));
                }
              }
            )
            .subscribe((status: string) => {
              setIsRealtimeActive(status === 'SUBSCRIBED');
            });
        } catch (err) {
          console.warn('Gagal menghubungkan Supabase secara langsung, beralih ke mode lokal:', err);
          loadFromLocalOrMock();
        }
      } else {
        loadFromLocalOrMock();
      }

      setLoading(false);
    }

    function loadFromLocalOrMock() {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('mk_contents_data');
        if (local) {
          try {
            setContents(JSON.parse(local));
          } catch {
            setContents(MOCK_CONTENTS);
          }
        } else {
          setContents(MOCK_CONTENTS);
        }
      } else {
        setContents(MOCK_CONTENTS);
      }
    }

    initData();

    return () => {
      if (channelSubscription && supabase) {
        supabase.removeChannel(channelSubscription);
      }
    };
  }, []);

  // Save to localStorage when using mock mode
  useEffect(() => {
    if (!isSupabaseConfigured && contents.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('mk_contents_data', JSON.stringify(contents));
    }
  }, [contents]);

  // Actions
  const addContent = async (newItem: Partial<ContentItem>): Promise<ContentItem> => {
    const itemToAdd: ContentItem = {
      id: isSupabaseConfigured ? undefined as any : `cnt_${Date.now()}`,
      title: newItem.title || 'Konten Baru Tanpa Judul',
      platform: newItem.platform || 'tiktok',
      stage: newItem.stage || 'idea',
      priority: newItem.priority || 'medium',
      hook_script: newItem.hook_script || '',
      body_script: newItem.body_script || '',
      cta_script: newItem.cta_script || '',
      visual_notes: newItem.visual_notes || '',
      video_duration_sec: newItem.video_duration_sec || 0,
      target_audience: newItem.target_audience || '',
      storage_asset_url: newItem.storage_asset_url || '',
      published_url: newItem.published_url || '',
      scheduled_at: newItem.scheduled_at || null,
      published_at: newItem.published_at || null,
      channel_id: newItem.channel_id || channels[0]?.id,
      assigned_to: newItem.assigned_to || currentUser?.id,
      created_by: currentUser?.id,
      assignee: profiles.find((p) => p.id === (newItem.assigned_to || currentUser?.id)) || currentUser || undefined,
      creator: currentUser || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('contents')
          .insert({
            title: itemToAdd.title,
            platform: itemToAdd.platform,
            stage: itemToAdd.stage,
            priority: itemToAdd.priority,
            hook_script: itemToAdd.hook_script,
            body_script: itemToAdd.body_script,
            cta_script: itemToAdd.cta_script,
            visual_notes: itemToAdd.visual_notes,
            video_duration_sec: itemToAdd.video_duration_sec,
            target_audience: itemToAdd.target_audience,
            scheduled_at: itemToAdd.scheduled_at,
            channel_id: itemToAdd.channel_id,
            assigned_to: itemToAdd.assigned_to,
            created_by: itemToAdd.created_by,
          })
          .select('*, assignee:assigned_to(*), creator:created_by(*)')
          .single();

        if (error) throw error;
        setContents((prev) => [data, ...prev]);
        return data;
      } catch (e) {
        console.error('Supabase insert error, fallback to local:', e);
      }
    }

    setContents((prev) => [itemToAdd, ...prev]);
    return itemToAdd;
  };

  const updateContent = async (id: string, updates: Partial<ContentItem>) => {
    const updatedTimestamp = new Date().toISOString();
    
    // Optimistic local update
    setContents((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates, updated_at: updatedTimestamp };
          if (updates.assigned_to) {
            updated.assignee = profiles.find((p) => p.id === updates.assigned_to) || item.assignee;
          }
          return updated;
        }
        return item;
      })
    );

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('contents')
          .update({
            ...updates,
            updated_at: updatedTimestamp,
          })
          .eq('id', id);

        if (error) console.error('Supabase update error:', error);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteContent = async (id: string) => {
    setContents((prev) => prev.filter((item) => item.id !== id));
    if (selectedContentId === id) setSelectedContentId(null);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('contents').delete().eq('id', id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const moveStage = async (id: string, toStage: ContentStage) => {
    const content = contents.find((c) => c.id === id);
    if (!content) return;

    const updates: Partial<ContentItem> = {
      stage: toStage,
    };

    if (toStage === 'published' && !content.published_at) {
      updates.published_at = new Date().toISOString();
    }

    await updateContent(id, updates);
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured) {
      await signInWithGoogle();
    } else {
      // Toggle mock profiles in demo mode
      const nextIdx = (MOCK_PROFILES.findIndex((p) => p.id === currentUser?.id) + 1) % MOCK_PROFILES.length;
      setCurrentUser(MOCK_PROFILES[nextIdx]);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await signOut();
      setCurrentUser(null);
    } else {
      setCurrentUser(null);
    }
  };

  return (
    <ContentContext.Provider
      value={{
        contents,
        profiles,
        channels,
        currentUser,
        isRealtimeActive,
        isConfigured: isSupabaseConfigured,
        loading,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        platformFilter,
        setPlatformFilter,
        memberFilter,
        setMemberFilter,
        addContent,
        updateContent,
        deleteContent,
        moveStage,
        loginWithGoogle,
        logout,
        selectedContentId,
        setSelectedContentId,
        isNewModalOpen,
        setIsNewModalOpen,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

