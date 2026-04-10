import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BarChart3, MessageSquare, Settings, 
  ChevronLeft, Menu, Shield, LogOut, Home 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

const navItems = [
  { icon: LayoutDashboard, label: 'ড্যাশবোর্ড', path: '/admin' },
  { icon: Users, label: 'ইউজার ম্যানেজমেন্ট', path: '/admin/users' },
  { icon: BarChart3, label: 'অ্যানালিটিক্স', path: '/admin/analytics' },
  { icon: MessageSquare, label: 'ফিডব্যাক', path: '/admin/feedback' },
  { icon: Settings, label: 'সেটিংস', path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  if (authLoading || adminLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full gradient-gold animate-pulse-glow" />
          <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="glass-surface rounded-2xl p-8 text-center max-w-md mx-4">
          <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">অ্যাক্সেস অস্বীকৃত</h1>
          <p className="text-sm text-muted-foreground mb-6">
            তোমার অ্যাডমিন প্যানেলে অ্যাক্সেস নেই। শুধুমাত্র অ্যাডমিনরা এই পেজ দেখতে পারে।
          </p>
          <Link to="/chat" className="gradient-gold text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
            <Home className="w-4 h-4" /> চ্যাটে ফিরে যাও
          </Link>
        </div>
      </div>
    );
  }

  const sidebar = (
    <div className="flex flex-col h-full bg-sidebar w-64 border-r border-sidebar-border">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center text-sm font-bold">ভ</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">দেশি ভাই Admin</p>
          <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
        </div>
        {!isMobile && (
          <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? 'gradient-gold text-primary-foreground font-semibold glow-gold'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-sidebar-border space-y-1">
        <Link to="/chat" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <MessageSquare className="w-4 h-4" /> চ্যাটে যাও
        </Link>
        <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-destructive hover:bg-sidebar-accent transition-colors">
          <LogOut className="w-4 h-4" /> লগ আউট
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      {!isMobile && sidebarOpen && sidebar}

      {/* Mobile sidebar */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64 border-sidebar-border">
            <SheetTitle className="sr-only">অ্যাডমিন মেনু</SheetTitle>
            {sidebar}
          </SheetContent>
        </Sheet>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 md:px-6 py-3 border-b border-border/50 bg-background/80 backdrop-blur-sm">
          {(!sidebarOpen || isMobile) && (
            <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground">
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Admin Panel</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
