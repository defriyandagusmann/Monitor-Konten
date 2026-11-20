'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Channel, ContentItem, ContentStage, Platform, Profile } from '@/types';
import { MOCK_CHANNELS, MOCK_CONTENTS } from '@/lib/mockData';
import { isSupabaseConfigured, signInWithGoogle, signOut, supabase } from '@/lib/supabase/client';

interface ContentContextType {
  contents: ContentItem[];
  profiles: Profile[];
  channels: Channel[];
  currentUser: Profile | null;
  loading: boolean;
  
  // Theme Toggle (Light / Dark)
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
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
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [channels, setChannels] = useState<Channel[]>(MOCK_CHANNELS);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Theme: default 'light' (cerah/terang)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Filters
  const [activeTab, setActiveTab] = useState<'kanban' | 'calendar' | 'scriptlab' | 'analytics'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [memberFilter, setMemberFilter] = useState('all');

  // Modals
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('mk_theme') as 'light' | 'dark' | null;
      const initialTheme = savedTheme || 'light';
      setTheme(initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('mk_theme', next);
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return next;
    });
  };

  // Helper to map assignee & creator to contents
  const enrichContents = (rawContents: ContentItem[], currentProfiles: Profile[]) => {
    return rawContents.map((c) => ({
      ...c,
      assignee: currentProfiles.find((p) => p.id === c.assigned_to),
      creator: currentProfiles.find((p) => p.id === c.created_by),
    }));
  };

  // Initialize data & authentication
  useEffect(() => {
    let contentSubscription: any = null;
    let profileSubscription: any = null;

    async function initData() {
      setLoading(true);

      if (isSupabaseConfigured && supabase) {
        try {
          // 1. Check Auth Session
          const { data: { session } } = await supabase.auth.getSession();
          let activeProfile: Profile | null = null;

          if (session?.user) {
            activeProfile = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Kreator',
              avatar_url: session.user.user_metadata?.avatar_url || '',
              role: 'creator',
            };
            setCurrentUser(activeProfile);

            // Auto-upsert profile directly to public.profiles table
            try {
              await supabase.from('profiles').upsert({
                id: activeProfile.id,
                email: activeProfile.email,
                full_name: activeProfile.full_name,
                avatar_url: activeProfile.avatar_url,
                updated_at: new Date().toISOString(),
              });
            } catch (err) {
              console.warn('Upsert profile error:', err);
            }
          }

          // 2. Fetch Profiles from Supabase
          let loadedProfiles: Profile[] = [];
          const { data: profilesData } = await supabase.from('profiles').select('*');
          if (profilesData && profilesData.length > 0) {
            loadedProfiles = profilesData;
          } else if (activeProfile) {
            loadedProfiles = [activeProfile];
          }
          setProfiles(loadedProfiles);

          // 3. Listen to auth changes (when user logs in via Google)
          supabase.auth.onAuthStateChange(async (_event, currentSession) => {
            if (currentSession?.user) {
              const uProfile: Profile = {
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                full_name: currentSession.user.user_metadata?.full_name || currentSession.user.email?.split('@')[0] || 'Kreator',
                avatar_url: currentSession.user.user_metadata?.avatar_url || '',
                role: 'creator',
              };
              setCurrentUser(uProfile);

              // Upsert to DB
              if (supabase) {
                await supabase.from('profiles').upsert({
                  id: uProfile.id,
                  email: uProfile.email,
                  full_name: uProfile.full_name,
                  avatar_url: uProfile.avatar_url,
                  updated_at: new Date().toISOString(),
                });

                // Re-fetch all profiles
                const { data: pList } = await supabase.from('profiles').select('*');
                if (pList) {
                  setProfiles(pList);
                }
              }
            } else {
              setCurrentUser(null);
            }
          });

          // 4. Fetch Channels
          const { data: channelsData } = await supabase.from('channels').select('*');
          if (channelsData && channelsData.length > 0) {
            setChannels(channelsData);
          }

          // 5. Fetch Contents (Using simple select(*) to avoid relation 400 errors)
          const { data: contentsData, error } = await supabase
            .from('contents')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && contentsData) {
            setContents(enrichContents(contentsData, loadedProfiles));
          } else if (error) {
            console.error('Supabase select error:', error);
            loadFromLocalOrMock(loadedProfiles);
          }

          // 6. Realtime Subscription: contents
          contentSubscription = supabase
            .channel('realtime:contents')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'contents' },
              (payload: any) => {
                if (payload.eventType === 'INSERT') {
                  setContents((prev) => {
                    if (prev.some((c) => c.id === payload.new.id)) return prev;
                    return [payload.new as ContentItem, ...prev];
                  });
                } else if (payload.eventType === 'UPDATE') {
                  setContents((prev) =>
                    prev.map((c) => (c.id === payload.new.id ? { ...c, ...payload.new } : c))
                  );
                } else if (payload.eventType === 'DELETE') {
                  setContents((prev) => prev.filter((c) => c.id !== payload.old.id));
                }
              }
            )
            .subscribe();

          // 7. Realtime Subscription: profiles (when another team member logs in!)
          profileSubscription = supabase
            .channel('realtime:profiles')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'profiles' },
              (payload: any) => {
                if (payload.eventType === 'INSERT') {
                  setProfiles((prev) => {
                    if (prev.some((p) => p.id === payload.new.id)) return prev;
                    return [...prev, payload.new as Profile];
                  });
                } else if (payload.eventType === 'UPDATE') {
                  setProfiles((prev) =>
                    prev.map((p) => (p.id === payload.new.id ? { ...p, ...payload.new } : p))
                  );
                } else if (payload.eventType === 'DELETE') {
                  setProfiles((prev) => prev.filter((p) => p.id !== payload.old.id));
                }
              }
            )
            .subscribe();

        } catch (err) {
          console.warn('Error connecting to Supabase:', err);
          loadFromLocalOrMock([]);
        }
      } else {
        loadFromLocalOrMock([]);
      }

      setLoading(false);
    }

    function loadFromLocalOrMock(currentProfiles: Profile[]) {
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

        const localProfiles = localStorage.getItem('mk_profiles_data');
        if (localProfiles && currentProfiles.length === 0) {
          try {
            const parsed = JSON.parse(localProfiles);
            setProfiles(parsed);
            if (parsed.length > 0) setCurrentUser(parsed[0]);
          } catch {
            setProfiles([]);
          }
        }
      } else {
        setContents(MOCK_CONTENTS);
      }
    }

    initData();

    return () => {
      if (contentSubscription && supabase) {
        supabase.removeChannel(contentSubscription);
      }
      if (profileSubscription && supabase) {
        supabase.removeChannel(profileSubscription);
      }
    };
  }, []);

  // Save to localStorage only as offline backup
  useEffect(() => {
    if (!isSupabaseConfigured && contents.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('mk_contents_data', JSON.stringify(contents));
    }
  }, [contents]);

  // Actions
  const addContent = async (newItem: Partial<ContentItem>): Promise<ContentItem> => {
    const itemToAdd: any = {
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
      channel_id: newItem.channel_id || (channels[0] ? channels[0].id : null),
      assigned_to: newItem.assigned_to || (currentUser ? currentUser.id : null),
      created_by: currentUser ? currentUser.id : null,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('contents')
          .insert(itemToAdd)
          .select('*')
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }

        const enriched = {
          ...data,
          assignee: profiles.find((p) => p.id === data.assigned_to),
          creator: profiles.find((p) => p.id === data.created_by),
        };

        setContents((prev) => [enriched, ...prev]);
        return enriched;
      } catch (e) {
        console.error('Insert fallback to local state:', e);
      }
    }

    // Local fallback
    const localItem: ContentItem = {
      ...itemToAdd,
      id: `cnt_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assignee: profiles.find((p) => p.id === itemToAdd.assigned_to),
      creator: currentUser || undefined,
    };

    setContents((prev) => [localItem, ...prev]);
    return localItem;
  };

  const updateContent = async (id: string, updates: Partial<ContentItem>) => {
    const updatedTimestamp = new Date().toISOString();
    
    // Strip virtual properties before sending to database
    const { assignee, creator, ...cleanUpdates } = updates as any;

    // Optimistic local update
    setContents((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...cleanUpdates, updated_at: updatedTimestamp };
          if (cleanUpdates.assigned_to !== undefined) {
            updated.assignee = profiles.find((p) => p.id === cleanUpdates.assigned_to) || undefined;
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
            ...cleanUpdates,
            updated_at: updatedTimestamp,
          })
          .eq('id', id);

        if (error) console.error('Supabase update error:', error);
      } catch (err) {
        console.error('Supabase update exception:', err);
      }
    }
  };

  const deleteContent = async (id: string) => {
    // Optimistic local deletion
    setContents((prev) => prev.filter((item) => item.id !== id));
    if (selectedContentId === id) setSelectedContentId(null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('contents').delete().eq('id', id);
        if (error) console.error('Supabase delete error:', error);
      } catch (err) {
        console.error('Supabase delete exception:', err);
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
      // Local demo mode: create a mock Google user
      const dummyGoogleUser: Profile = {
        id: `usr_${Date.now()}`,
        email: 'tim.kreator@gmail.com',
        full_name: 'Akun Google (Tim)',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'creator',
      };
      setCurrentUser(dummyGoogleUser);
      setProfiles((prev) => [dummyGoogleUser, ...prev]);
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
        loading,
        theme,
        toggleTheme,
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
