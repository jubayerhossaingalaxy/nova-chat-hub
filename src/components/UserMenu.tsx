import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  const initials = (user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full gradient-gold text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md hover:scale-105 transition-transform"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 top-12 w-56 glass-surface rounded-xl shadow-2xl py-2 z-50 animate-fade-in">
          <div className="px-4 py-3 border-b border-border/50">
            <p className="text-sm font-semibold text-foreground">{user.user_metadata?.full_name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <Link to="/chat" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/60 transition-colors">
            <MessageSquare className="w-4 h-4 text-muted-foreground" /> Chat
          </Link>
          <Link to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/60 transition-colors">
            <Settings className="w-4 h-4 text-muted-foreground" /> Settings
          </Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-secondary/60 transition-colors">
              <Shield className="w-4 h-4" /> Admin Panel
            </Link>
          )}
          <button onClick={() => { signOut(); setOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-secondary/60 transition-colors text-left">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
