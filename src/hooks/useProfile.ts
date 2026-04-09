import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Profile {
  display_name: string | null;
  preferred_language: string;
  theme: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await (supabase as any)
      .from('profiles')
      .select('display_name, preferred_language, theme')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setProfile(data as Profile);
    } else {
      // Create profile if doesn't exist
      await (supabase as any).from('profiles').insert({
        user_id: user.id,
        display_name: user.user_metadata?.full_name || null,
      });
      setProfile({
        display_name: user.user_metadata?.full_name || null,
        preferred_language: 'bn',
        theme: 'dark',
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return false;
    const { error } = await (supabase as any)
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);
    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    }
    return false;
  }, [user]);

  return { profile, loading, updateProfile, loadProfile };
}
