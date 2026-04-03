import { MessageSquare, PanelLeftClose, Plus, Trash2, Home, Settings, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { MOOD_TAGS } from '@/components/MoodTags';
import vaijanTea from '@/assets/vaijan-tea.png';

export interface ChatSession {
  id: string;
  title: string;
  mood: string;
  created_at: string;
  updated_at: string;
}

interface ChatSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
}

const navItems = [
  { icon: Home, label: 'হোম', path: '/' },
  { icon: Settings, label: 'সেটিংস', path: '/settings' },
  { icon: Users, label: 'টিম', path: '/team' },
];

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'আজ';
  if (diffDays === 1) return 'গতকাল';
  return `${diffDays} দিন আগে`;
}

export default function ChatSidebar({
  collapsed, onToggle, sessions, activeSessionId,
  onSelectSession, onNewChat, onDeleteSession,
}: ChatSidebarProps) {
  const location = useLocation();
  const getMoodEmoji = (mood: string) => MOOD_TAGS.find(t => t.id === mood)?.emoji || '💬';

  const grouped: Record<string, ChatSession[]> = {};
  sessions.forEach(s => {
    const label = formatRelativeDate(s.created_at);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(s);
  });

  return (
    <aside
      className={`h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${
        collapsed ? 'w-0 overflow-hidden' : 'w-72'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <img src={vaijanTea} alt="দেশি ভাই" className="w-8 h-8 rounded-full" />
          <span className="font-bold text-foreground text-sm">দেশি ভাই - AI</span>
        </div>
        <button onClick={onToggle} className="text-sidebar-foreground hover:text-foreground transition-colors">
          <PanelLeftClose className="w-5 h-5" />
        </button>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 gradient-gold text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:opacity-90 glow-gold"
        >
          <Plus className="w-4 h-4" />
          নতুন চ্যাট
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-1">
        {Object.entries(grouped).length === 0 ? (
          <div className="text-center text-muted-foreground text-xs py-8 px-4">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
            কোনো চ্যাট নেই
          </div>
        ) : (
          Object.entries(grouped).map(([dateLabel, groupSessions]) => (
            <div key={dateLabel} className="mb-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 py-1.5">
                {dateLabel}
              </p>
              {groupSessions.map((s) => (
                <div
                  key={s.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 mb-0.5 ${
                    activeSessionId === s.id
                      ? 'bg-sidebar-accent text-foreground border-l-2 border-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                  onClick={() => onSelectSession(s.id)}
                >
                  <span className="text-sm flex-shrink-0">{getMoodEmoji(s.mood)}</span>
                  <span className="text-xs truncate flex-1 leading-tight">{s.title}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteSession(s.id); }}
                    className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Navigation */}
      <div className="border-t border-sidebar-border p-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === path
                ? 'text-primary bg-sidebar-accent'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
