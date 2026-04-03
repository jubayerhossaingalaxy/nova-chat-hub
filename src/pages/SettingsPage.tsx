import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ChatSidebar from '@/components/ChatSidebar';
import { PanelLeftOpen } from 'lucide-react';
import UserMenu from '@/components/UserMenu';

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (!loading && !user) navigate('/login');
    if (user) setDisplayName(user.user_metadata?.full_name || '');
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ChatSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(false)} sessions={[]} activeSessionId={null} onSelectSession={() => {}} onNewChat={() => {}} onDeleteSession={() => {}} />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors">
                <PanelLeftOpen className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-lg font-bold text-foreground">সেটিংস</h1>
          </div>
          <UserMenu />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-6 md:p-10 max-w-2xl">
          {/* Name */}
          <div className="glass-surface rounded-2xl p-6 mb-6">
            <h2 className="text-base font-bold text-foreground mb-1">তোমার নাম</h2>
            <p className="text-xs text-muted-foreground mb-4">ডিসপ্লে নাম সেট করো।</p>
            <div className="flex gap-3">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={32}
                className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
              <button className="gradient-gold text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                সেভ করো
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-surface rounded-2xl p-6 border-destructive/20">
            <h2 className="text-base font-bold text-destructive mb-1">ডেঞ্জার জোন</h2>
            <p className="text-xs text-muted-foreground mb-4">
              তোমার দেশি ভাই - AI একাউন্ট ডিলিট করো। এই অ্যাকশন undo করা যাবে না!
            </p>
            <button
              onClick={signOut}
              className="bg-destructive/10 border border-destructive/30 text-destructive px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-destructive/20 transition-colors"
            >
              🗑 একাউন্ট ডিলিট করো
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
