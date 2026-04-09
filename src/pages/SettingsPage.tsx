import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import ChatSidebar from '@/components/ChatSidebar';
import { PanelLeftOpen, Save, Check, User, Shield, Database } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
    if (!isMobile) setSidebarOpen(true);
  }, [user, loading, navigate, isMobile]);

  useEffect(() => {
    if (profile) setDisplayName(profile.display_name || '');
  }, [profile]);

  const handleSaveName = async () => {
    setSaving(true);
    const success = await updateProfile({ display_name: displayName.trim() });
    setSaving(false);
    if (success) toast.success('নাম আপডেট হয়েছে! ✅');
    else toast.error('সেভ করতে সমস্যা হয়েছে');
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full gradient-gold animate-pulse-glow" />
    </div>
  );

  const sidebarContent = (
    <ChatSidebar collapsed={false} onToggle={() => setSidebarOpen(false)} sessions={[]} activeSessionId={null} onSelectSession={() => {}} onNewChat={() => navigate('/chat')} onDeleteSession={() => {}} />
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {!isMobile && sidebarOpen && sidebarContent}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-72 border-sidebar-border">
            <SheetTitle className="sr-only">মেনু</SheetTitle>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            {(!sidebarOpen || isMobile) && (
              <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors">
                <PanelLeftOpen className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-lg font-bold text-foreground">⚙️ সেটিংস</h1>
          </div>
          <UserMenu />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile */}
            <div className="glass-surface rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">প্রোফাইল</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">ডিসপ্লে নাম</label>
                  <div className="flex gap-3">
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      maxLength={32}
                      placeholder="তোমার নাম লেখো..."
                      className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition-shadow"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={saving || !displayName.trim()}
                      className="gradient-gold text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-2"
                    >
                      {saving ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                      সেভ
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">ইমেইল</label>
                  <p className="text-sm text-foreground/70 bg-secondary rounded-xl px-4 py-2.5 border border-border">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Usage Info */}
            <div className="glass-surface rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">ব্যবহারের তথ্য</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold gradient-text-gold">১৫০</p>
                  <p className="text-xs text-muted-foreground">দৈনিক মেসেজ লিমিট</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold gradient-text-gold">৭ দিন</p>
                  <p className="text-xs text-muted-foreground">চ্যাট সংরক্ষণ</p>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="glass-surface rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">গোপনীয়তা ও নিরাপত্তা</h2>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /> তোমার চ্যাট এনক্রিপ্টেড এবং শুধু তুমি দেখতে পারো</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /> ৭ দিন পরে পুরনো চ্যাট অটোমেটিক ডিলিট হয়</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /> Google OAuth দিয়ে নিরাপদ লগইন</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" /> আমরা তোমার ডেটা তৃতীয় পক্ষের সাথে শেয়ার করি না</li>
              </ul>
            </div>

            {/* Danger Zone */}
            <div className="glass-surface rounded-2xl p-6 border border-destructive/20">
              <h2 className="text-base font-bold text-destructive mb-1">⚠️ ডেঞ্জার জোন</h2>
              <p className="text-xs text-muted-foreground mb-4">
                লগ আউট করলে তোমার সেশন শেষ হবে। চ্যাট ইতিহাস সেভ থাকবে।
              </p>
              <button
                onClick={signOut}
                className="bg-destructive/10 border border-destructive/30 text-destructive px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-destructive/20 transition-colors"
              >
                🚪 লগ আউট করো
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
