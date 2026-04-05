import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ChatSession {
  id: string;
  title: string;
  mood: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function useChatHistory() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const loadSessions = useCallback(async () => {
    if (!user) return;
    setLoadingSessions(true);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await (supabase as any)
      .from('chat_sessions')
      .select('*')
      .gte('created_at', sevenDaysAgo)
      .order('updated_at', { ascending: false });
    setSessions((data as ChatSession[]) || []);
    setLoadingSessions(false);
  }, [user]);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  const createSession = useCallback(async (mood: string, firstMessage: string): Promise<string | null> => {
    if (!user) return null;
    const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '');
    const { data, error } = await (supabase as any)
      .from('chat_sessions')
      .insert({ user_id: user.id, title, mood })
      .select('id')
      .single();
    if (error || !data) return null;
    const sessionId = (data as { id: string }).id;
    setActiveSessionId(sessionId);
    loadSessions();
    return sessionId;
  }, [user, loadSessions]);

  const saveMessage = useCallback(async (sessionId: string, role: 'user' | 'assistant', content: string) => {
    await (supabase as any).from('chat_messages').insert({ session_id: sessionId, role, content });
    await (supabase as any).from('chat_sessions').update({ updated_at: new Date().toISOString() }).eq('id', sessionId);
  }, []);

  const loadMessages = useCallback(async (sessionId: string): Promise<ChatMessage[]> => {
    const { data } = await (supabase as any)
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    return (data as ChatMessage[]) || [];
  }, []);

  const deleteSession = useCallback(async (sessionId: string) => {
    await (supabase as any).from('chat_sessions').delete().eq('id', sessionId);
    if (activeSessionId === sessionId) setActiveSessionId(null);
    loadSessions();
  }, [activeSessionId, loadSessions]);

  const getSessionMood = useCallback((sessionId: string): string => {
    const session = sessions.find(s => s.id === sessionId);
    return session?.mood || 'bhai-radar';
  }, [sessions]);

  useEffect(() => {
    if (user) {
      (supabase as any).rpc('delete_old_chat_sessions').then(() => {});
    }
  }, [user]);

  return {
    sessions,
    activeSessionId,
    setActiveSessionId,
    loadingSessions,
    createSession,
    saveMessage,
    loadMessages,
    deleteSession,
    getSessionMood,
    loadSessions,
  };
}
