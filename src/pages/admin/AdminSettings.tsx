import { useState } from 'react';
import { Settings, Shield, Database, Zap, Bell, Globe } from 'lucide-react';
import AdminLayout from './AdminLayout';

export default function AdminSettings() {
  const [dailyLimit, setDailyLimit] = useState(150);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-3xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" /> অ্যাডমিন সেটিংস
          </h1>
          <p className="text-sm text-muted-foreground">সিস্টেম কনফিগারেশন</p>
        </div>

        {/* Rate Limit */}
        <div className="glass-surface rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">রেট লিমিট</h3>
              <p className="text-xs text-muted-foreground">প্রতিদিন প্রতি ইউজারের মেসেজ সীমা</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              className="w-32 bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50"
            />
            <span className="text-sm text-muted-foreground">মেসেজ/দিন</span>
          </div>
        </div>

        {/* Security */}
        <div className="glass-surface rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">সিকিউরিটি</h3>
              <p className="text-xs text-muted-foreground">নিরাপত্তা কনফিগারেশন</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">JWT ভেরিফিকেশন</span>
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">সক্রিয়</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">ইনপুট স্যানিটাইজেশন</span>
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">সক্রিয়</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">RLS পলিসি</span>
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">সক্রিয়</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">অটো সেশন ডিলিট (৭ দিন)</span>
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">সক্রিয়</span>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="glass-surface rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">সিস্টেম তথ্য</h3>
              <p className="text-xs text-muted-foreground">প্রযুক্তি স্ট্যাক</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">AI মডেল</span>
              <span className="text-sm text-foreground font-mono">gemini-2.5-flash</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">ফ্রন্টেন্ড</span>
              <span className="text-sm text-foreground font-mono">React + Vite</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">ডেটাবেস</span>
              <span className="text-sm text-foreground font-mono">PostgreSQL</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">মোট মোড</span>
              <span className="text-sm text-foreground font-mono">161+</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">ভার্সন</span>
              <span className="text-sm text-foreground font-mono">2.0.0</span>
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="glass-surface rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">ফিচার ফ্ল্যাগ</h3>
              <p className="text-xs text-muted-foreground">ফিচার চালু/বন্ধ করো</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { name: 'ভয়েস ইনপুট', enabled: true },
              { name: 'চ্যাট এক্সপোর্ট', enabled: true },
              { name: 'মেসেজ ফিডব্যাক', enabled: true },
              { name: 'মোড সুইচিং', enabled: true },
              { name: 'কীবোর্ড শর্টকাট', enabled: true },
            ].map((feat) => (
              <div key={feat.name} className="flex items-center justify-between py-2">
                <span className="text-sm text-foreground">{feat.name}</span>
                <span className={`text-xs px-3 py-1 rounded-full ${feat.enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {feat.enabled ? 'চালু' : 'বন্ধ'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
