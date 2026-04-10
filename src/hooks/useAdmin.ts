import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const checkAdmin = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        setIsAdmin(!error && !!data);
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [user]);

  return { isAdmin, loading };
}

export interface DashboardStats {
  total_users: number;
  total_sessions: number;
  total_messages: number;
  active_users_24h: number;
  sessions_24h: number;
  messages_24h: number;
  total_feedback: number;
  positive_feedback: number;
  negative_feedback: number;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  session_count: number;
  message_count: number;
  role: string | null;
}

export interface MoodStat {
  mood: string;
  count: number;
}

export interface DailyCount {
  day: string;
  msg_count?: number;
  user_count?: number;
}

export function useAdminData() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [moodStats, setMoodStats] = useState<MoodStat[]>([]);
  const [dailyMessages, setDailyMessages] = useState<DailyCount[]>([]);
  const [dailyUsers, setDailyUsers] = useState<DailyCount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, moodRes, msgRes, dauRes] = await Promise.all([
        supabase.rpc('get_admin_dashboard_stats'),
        supabase.rpc('get_admin_users_list', { p_limit: 100, p_offset: 0 }),
        supabase.rpc('get_mood_distribution'),
        supabase.rpc('get_daily_message_counts', { days_back: 30 }),
        supabase.rpc('get_daily_active_users', { days_back: 30 }),
      ]);

      if (statsRes.data) setStats(statsRes.data as unknown as DashboardStats);
      if (usersRes.data) setUsers((usersRes.data as unknown as AdminUser[]) || []);
      if (moodRes.data) setMoodStats(moodRes.data as unknown as MoodStat[]);
      if (msgRes.data) setDailyMessages(msgRes.data as unknown as DailyCount[]);
      if (dauRes.data) setDailyUsers(dauRes.data as unknown as DailyCount[]);
    } catch (e) {
      console.error('Admin data fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { stats, users, moodStats, dailyMessages, dailyUsers, loading, refresh: fetchAll };
}
