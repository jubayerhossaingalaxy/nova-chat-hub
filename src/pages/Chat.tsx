import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelLeftOpen, Search, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useChatHistory } from '@/hooks/useChatHistory';
import ChatSidebar from '@/components/ChatSidebar';
import MoodTags, { MOOD_TAGS } from '@/components/MoodTags';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import UserMenu from '@/components/UserMenu';
import SuggestedReplies from '@/components/SuggestedReplies';
import vaijanMascot from '@/assets/vaijan-mascot.png';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { MOOD_SYSTEM_PROMPTS } from '@/data/moodPrompts';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Message { role: 'user' | 'assistant'; content: string; }

export default function Chat() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMood, setActiveMood] = useState('bhai-radar');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingMood, setPendingMood] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentSessionIdRef = useRef<string | null>(null);

  const {
    sessions, activeSessionId, setActiveSessionId,
    createSession, saveMessage, loadMessages, deleteSession, getSessionMood, loadSessions,
  } = useChatHistory();

  useEffect(() => {
    if (!isMobile) setSidebarOpen(true);
  }, [isMobile]);

  const handleMoodSelect = (id: string) => {
    if (id === activeMood) return;
    if (messages.length > 0) setPendingMood(id);
    else setActiveMood(id);
  };

  const confirmMoodSwitch = () => {
    if (pendingMood) {
      setActiveMood(pendingMood);
      setMessages([]);
      currentSessionIdRef.current = null;
      setActiveSessionId(null);
      setPendingMood(null);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    currentSessionIdRef.current = null;
    setActiveSessionId(null);
    setActiveMood('bhai-radar');
    if (isMobile) setSidebarOpen(false);
  };

  const handleSelectSession = useCallback(async (sessionId: string) => {
    setActiveSessionId(sessionId);
    currentSessionIdRef.current = sessionId;
    const mood = getSessionMood(sessionId);
    setActiveMood(mood);
    const msgs = await loadMessages(sessionId);
    setMessages(msgs);
    if (isMobile) setSidebarOpen(false);
  }, [setActiveSessionId, getSessionMood, loadMessages, isMobile]);

  const handleDeleteSession = useCallback(async (sessionId: string) => {
    await deleteSession(sessionId);
    if (currentSessionIdRef.current === sessionId) {
      setMessages([]);
      currentSessionIdRef.current = null;
    }
  }, [deleteSession]);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleRetry = useCallback(async (messageIndex: number) => {
    const userMsgIndex = messageIndex - 1;
    if (userMsgIndex < 0 || messages[userMsgIndex]?.role !== 'user') return;
    const userContent = messages[userMsgIndex].content;
    const trimmed = messages.slice(0, userMsgIndex);
    setMessages(trimmed);
    setTimeout(() => handleSend(userContent), 100);
  }, [messages]);

  const handleSend = async (input: string) => {
    const userMsg: Message = { role: 'user', content: input };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setIsStreaming(true);

    let sessionId = currentSessionIdRef.current;
    if (!sessionId) {
      sessionId = await createSession(activeMood, input);
      currentSessionIdRef.current = sessionId;
    }
    if (sessionId) await saveMessage(sessionId, 'user', input);

    let assistantContent = '';
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vaijan-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: allMessages.slice(-20),
            mood: activeMood,
            systemPrompt: MOOD_SYSTEM_PROMPTS[activeMood] || MOOD_SYSTEM_PROMPTS['bhai-radar'],
          }),
        }
      );

      if (!response.ok || !response.body) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error('rate_limit');
        }
        throw new Error(errData.error || 'AI response failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || !line.trim()) continue;
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      if (sessionId && assistantContent) {
        await saveMessage(sessionId, 'assistant', assistantContent);
        loadSessions();
      }
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const errorMsg = err instanceof Error && err.message === 'rate_limit'
        ? 'ভাই, অনেক বেশি মেসেজ পাঠাচ্ছিস! একটু পরে আবার চেষ্টা করো। ⏳'
        : 'ভাই, একটু সমস্যা হয়েছে। আবার চেষ্টা করো! 😅';
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const filteredMessages = searchQuery
    ? messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full gradient-gold animate-pulse-glow" />
    </div>
  );

  const sidebarContent = (
    <ChatSidebar
      collapsed={false}
      onToggle={() => setSidebarOpen(false)}
      sessions={sessions}
      activeSessionId={activeSessionId}
      onSelectSession={handleSelectSession}
      onNewChat={handleNewChat}
      onDeleteSession={handleDeleteSession}
    />
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {!isMobile && sidebarOpen && sidebarContent}

      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-72 border-sidebar-border">
            <SheetTitle className="sr-only">চ্যাট মেনু</SheetTitle>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-3 md:px-4 py-3 border-b border-border/50">
          <div className="flex items-center min-w-0 flex-1">
            {(!sidebarOpen || isMobile) && (
              <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground mr-2 md:mr-3 transition-colors flex-shrink-0" aria-label="সাইডবার খোলো">
                <PanelLeftOpen className="w-5 h-5" />
              </button>
            )}
            <div className="overflow-x-auto flex-1 min-w-0">
              <MoodTags activeTag={activeMood} onSelect={handleMoodSelect} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="চ্যাটে সার্চ করো"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
            <UserMenu />
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="flex items-center gap-2 px-3 md:px-4 py-2 border-b border-border/30 bg-secondary/30">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="চ্যাটে খোঁজো..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              autoFocus
              aria-label="চ্যাটে সার্চ করো"
            />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-muted-foreground hover:text-foreground" aria-label="সার্চ বন্ধ করো">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-3 md:px-8 py-4 md:py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in px-4">
              <div className="relative mb-4 md:mb-6">
                <div className="absolute inset-0 gradient-gold rounded-full blur-2xl opacity-15 scale-90" />
                <img src={vaijanMascot} alt="দেশি ভাই মাসকট" width={100} height={100} loading="lazy" className="relative animate-float drop-shadow-xl md:w-[140px] md:h-[140px]" />
              </div>
              <h1 className="text-lg md:text-2xl font-bold text-foreground mb-2 md:mb-3">
                👋 সালাম, আমি <span className="gradient-text-gold">দেশি ভাই - AI</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground max-w-md leading-relaxed mb-4">
                তোর মুডে, তোর স্টাইলে আমি আছি।
              </p>
              <SuggestedReplies mood={activeMood} onSelect={handleSend} />
            </div>
          )}
          {filteredMessages.map((msg, i) => (
            <ChatMessage
              key={i}
              role={msg.role}
              content={msg.content}
              onRetry={msg.role === 'assistant' && i === messages.length - 1 && !isStreaming ? () => handleRetry(i) : undefined}
            />
          ))}
          {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start mb-4">
              <div className="bg-chat-ai rounded-2xl px-4 md:px-5 py-3 md:py-4 text-sm text-muted-foreground border border-border/30">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>দেশি ভাই ভাবছে...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-3 md:px-8 pb-3 md:pb-4 pt-2">
          <ChatInput onSend={handleSend} disabled={isStreaming} />
        </div>
      </div>

      {/* Mood Switch Dialog */}
      <AlertDialog open={!!pendingMood} onOpenChange={(open) => !open && setPendingMood(null)}>
        <AlertDialogContent className="glass-surface border-border/50 mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">মোড পরিবর্তন করবে? 🔄</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              নতুন মোডে যেতে চাইলে বর্তমান চ্যাট মুছে যাবে। "{MOOD_TAGS.find(t => t.id === pendingMood)?.emoji} {MOOD_TAGS.find(t => t.id === pendingMood)?.label}" মোডে যেতে চাও?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary text-foreground border-border">না, থাক</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMoodSwitch} className="gradient-gold text-primary-foreground">হ্যাঁ, পরিবর্তন করো</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}