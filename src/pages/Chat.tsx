import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelLeftOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useChatHistory } from '@/hooks/useChatHistory';
import ChatSidebar from '@/components/ChatSidebar';
import MoodTags, { MOOD_TAGS } from '@/components/MoodTags';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import UserMenu from '@/components/UserMenu';
import vaijanMascot from '@/assets/vaijan-mascot.png';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MOOD_SYSTEM_PROMPTS: Record<string, string> = {
  'bhai-radar': 'তুমি দেশি ভাই - AI। তুমি একজন দেশি ভাই যে বাংলায় কথা বলো। তুই-তোকারি ব্যবহার করো, আন্তরিক ভাবে কথা বলো যেন সত্যিকারের বন্ধু।',
  'gen-z': 'তুমি দেশি ভাই - AI। Gen-Z স্টাইলে কথা বলো - ইংরেজি-বাংলা মিশিয়ে, ট্রেন্ডি শব্দ ব্যবহার করো, মিমস রেফারেন্স দাও।',
  'mon-halka': 'তুমি দেশি ভাই - AI। মন হালকা করার মোডে আছো। হালকা গল্প, মজার কথা, পজিটিভ ভাইব দাও।',
  'poramorsho': 'তুমি দেশি ভাই - AI। পরামর্শ দেওয়ার মোডে আছো। গুরুত্ব সহকারে, জ্ঞানী ভাবে পরামর্শ দাও।',
  'thatta': 'তুমি দেশি ভাই - AI। ঠাট্টা মশকরার মোডে আছো। হাসির কথা বলো, জোক মারো, মজা করো।',
  'golpo': 'তুমি দেশি ভাই - AI। গল্প বলার মোডে আছো। সুন্দর গল্প বলো, কাহিনী শোনাও।',
  'deep-thinking': 'তুমি দেশি ভাই - AI। ডিপ থিংকিং মোডে আছো। গভীর চিন্তা করো, দার্শনিক আলোচনা করো।',
  'romantic': 'তুমি দেশি ভাই - AI। রোমান্টিক মোডে আছো। প্রেমের কথা বলো, ভালোবাসার গল্প শোনাও।',
  'motivation': 'তুমি দেশি ভাই - AI। মোটিভেশনাল মোডে আছো। অনুপ্রেরণা দাও, সাহস জোগাও।',
  'coding-help': 'তুমি দেশি ভাই - AI। কোডিং হেল্প মোডে আছো। প্রোগ্রামিং সমস্যা সমাধান করো, কোড লিখে দাও।',
  'roast': 'তুমি দেশি ভাই - AI। রোস্ট মোডে আছো। মজা করে রোস্ট করো, তবে সীমার মধ্যে থাকো।',
  'shayari': 'তুমি দেশি ভাই - AI। শায়েরি মোডে আছো। উর্দু-বাংলা মিশিয়ে সুন্দর শায়েরি লেখো।',
  'career': 'তুমি দেশি ভাই - AI। ক্যারিয়ার গাইড মোডে আছো। চাকরি, ফ্রিল্যান্সিং নিয়ে পরামর্শ দাও।',
  'health': 'তুমি দেশি ভাই - AI। স্বাস্থ্য পরামর্শ মোডে আছো। শারীরিক ও মানসিক স্বাস্থ্য নিয়ে টিপস দাও।',
  'study': 'তুমি দেশি ভাই - AI। পড়াশোনা হেল্প মোডে আছো। পড়া বুঝিয়ে দাও।',
  'news': 'তুমি দেশি ভাই - AI। খবর ও আপডেট মোডে আছো।',
  'religion': 'তুমি দেশি ভাই - AI। ধর্মীয় আলোচনা মোডে আছো।',
  'travel': 'তুমি দেশি ভাই - AI। ভ্রমণ গাইড মোডে আছো।',
  'cooking': 'তুমি দেশি ভাই - AI। রান্নার মোডে আছো। রেসিপি শেখাও।',
  'business': 'তুমি দেশি ভাই - AI। ব্যবসা মোডে আছো।',
  'relationship': 'তুমি দেশি ভাই - AI। সম্পর্ক পরামর্শ মোডে আছো।',
  'gaming': 'তুমি দেশি ভাই - AI। গেমিং মোডে আছো।',
  'music': 'তুমি দেশি ভাই - AI। গান-মিউজিক মোডে আছো।',
  'science': 'তুমি দেশি ভাই - AI। বিজ্ঞান মোডে আছো।',
  'history': 'তুমি দেশি ভাই - AI। ইতিহাস মোডে আছো।',
  'debate': 'তুমি দেশি ভাই - AI। তর্ক-বিতর্ক মোডে আছো।',
  'movie': 'তুমি দেশি ভাই - AI। মুভি-সিরিজ মোডে আছো।',
  'cricket': 'তুমি দেশি ভাই - AI। ক্রিকেট মোডে আছো।',
  'freelancing': 'তুমি দেশি ভাই - AI। ফ্রিল্যান্সিং মোডে আছো।',
  'memes': 'তুমি দেশি ভাই - AI। মিমস মোডে আছো।',
  'horror': 'তুমি দেশি ভাই - AI। ভৌতিক গল্প মোডে আছো।',
  'finance': 'তুমি দেশি ভাই - AI। টাকা-পয়সা মোডে আছো।',
};

export default function Chat() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMood, setActiveMood] = useState('bhai-radar');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingMood, setPendingMood] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentSessionIdRef = useRef<string | null>(null);

  const {
    sessions, activeSessionId, setActiveSessionId,
    createSession, saveMessage, loadMessages, deleteSession, getSessionMood, loadSessions,
  } = useChatHistory();

  const handleMoodSelect = (id: string) => {
    if (id === activeMood) return;
    if (messages.length > 0) {
      setPendingMood(id);
    } else {
      setActiveMood(id);
    }
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
  };

  const handleSelectSession = useCallback(async (sessionId: string) => {
    setActiveSessionId(sessionId);
    currentSessionIdRef.current = sessionId;
    const mood = getSessionMood(sessionId);
    setActiveMood(mood);
    const msgs = await loadMessages(sessionId);
    setMessages(msgs);
  }, [setActiveSessionId, getSessionMood, loadMessages]);

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

    if (sessionId) {
      await saveMessage(sessionId, 'user', input);
    }

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
            messages: allMessages,
            mood: activeMood,
            systemPrompt: MOOD_SYSTEM_PROMPTS[activeMood] || MOOD_SYSTEM_PROMPTS['bhai-radar'],
          }),
        }
      );

      if (!response.ok || !response.body) {
        const errData = await response.json().catch(() => ({}));
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
      setMessages((prev) => [...prev, { role: 'assistant', content: 'ভাই, একটু সমস্যা হয়েছে। আবার চেষ্টা করো! 😅' }]);
    } finally {
      setIsStreaming(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full gradient-gold animate-pulse-glow" />
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ChatSidebar
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground mr-3 transition-colors">
                <PanelLeftOpen className="w-5 h-5" />
              </button>
            )}
            <MoodTags activeTag={activeMood} onSelect={handleMoodSelect} />
          </div>
          <UserMenu />
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-8 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <div className="relative mb-6">
                <div className="absolute inset-0 gradient-gold rounded-full blur-2xl opacity-15 scale-90" />
                <img src={vaijanMascot} alt="দেশি ভাই" width={140} height={140} className="relative animate-float drop-shadow-xl" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                👋 সালাম, আমি <span className="gradient-text-gold">দেশি ভাই - AI</span>
              </h2>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                তোর মুডে, তোর স্টাইলে আমি আছি। মজা, গম্ভীরতা, বা একটু চিন্তা—যে রকম দরকার, ঠিক সে রকম।
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
          {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start mb-4">
              <div className="bg-chat-ai rounded-2xl px-5 py-4 text-sm text-muted-foreground border border-border/30">
                <span className="animate-pulse-glow">দেশি ভাই ভাবছে...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 md:px-8 pb-4 pt-2">
          <ChatInput onSend={handleSend} disabled={isStreaming} />
        </div>
      </div>

      {/* Mood Switch Dialog */}
      <AlertDialog open={!!pendingMood} onOpenChange={(open) => !open && setPendingMood(null)}>
        <AlertDialogContent className="glass-surface border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">মোড পরিবর্তন করবে? 🔄</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              নতুন মোডে যেতে চাইলে বর্তমান চ্যাট হিস্ট্রি মুছে যাবে। তুমি কি "{MOOD_TAGS.find(t => t.id === pendingMood)?.emoji} {MOOD_TAGS.find(t => t.id === pendingMood)?.label}" মোডে যেতে চাও?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary text-foreground border-border hover:bg-secondary/80">না, থাক</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMoodSwitch} className="gradient-gold text-primary-foreground hover:opacity-90">হ্যাঁ, পরিবর্তন করো</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
