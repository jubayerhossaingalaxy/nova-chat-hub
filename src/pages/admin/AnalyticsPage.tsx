import { BarChart3, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdmin';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { MOOD_TAGS } from '@/components/MoodTags';
import AdminLayout from './AdminLayout';

export default function AnalyticsPage() {
  const { moodStats, dailyMessages, dailyUsers, stats, loading } = useAdminData();

  const chartMessages = dailyMessages.map(d => ({
    date: new Date(d.day).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' }),
    messages: d.msg_count || 0,
  }));

  const chartUsers = dailyUsers.map(d => ({
    date: new Date(d.day).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' }),
    users: d.user_count || 0,
  }));

  const moodBarData = moodStats.slice(0, 15).map(m => {
    const tag = MOOD_TAGS.find(t => t.id === m.mood);
    return { name: tag?.label || m.mood, count: Number(m.count), emoji: tag?.emoji || '📌' };
  });

  const tooltipStyle = { background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,14%,18%)', borderRadius: '12px', fontSize: '12px' };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> অ্যানালিটিক্স
          </h1>
          <p className="text-sm text-muted-foreground">বিস্তারিত ব্যবহার পরিসংখ্যান</p>
        </div>

        {/* Summary cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-surface rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">গড় মেসেজ/দিন</span>
              </div>
              <p className="text-xl font-bold text-foreground">
                {dailyMessages.length > 0 
                  ? Math.round(dailyMessages.reduce((a, d) => a + (d.msg_count || 0), 0) / dailyMessages.length)
                  : 0}
              </p>
            </div>
            <div className="glass-surface rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-xs text-muted-foreground">গড় DAU</span>
              </div>
              <p className="text-xl font-bold text-foreground">
                {dailyUsers.length > 0
                  ? Math.round(dailyUsers.reduce((a, d) => a + (d.user_count || 0), 0) / dailyUsers.length)
                  : 0}
              </p>
            </div>
            <div className="glass-surface rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-muted-foreground">গড় সেশন/ইউজার</span>
              </div>
              <p className="text-xl font-bold text-foreground">
                {stats.total_users > 0 ? (stats.total_sessions / stats.total_users).toFixed(1) : '0'}
              </p>
            </div>
            <div className="glass-surface rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-muted-foreground">ব্যবহৃত মোড</span>
              </div>
              <p className="text-xl font-bold text-foreground">{moodStats.length}</p>
            </div>
          </div>
        )}

        {/* Message Trend */}
        <div className="glass-surface rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> মেসেজ ট্রেন্ড (৩০ দিন)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartMessages}>
                <defs>
                  <linearGradient id="anMsgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(42,100%,58%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(42,100%,58%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215,12%,50%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(215,12%,50%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="messages" stroke="hsl(42,100%,58%)" fill="url(#anMsgGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DAU Chart */}
        <div className="glass-surface rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-green-400" /> দৈনিক অ্যাক্টিভ ইউজার
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartUsers}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215,12%,50%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(215,12%,50%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="users" stroke="hsl(160,60%,45%)" strokeWidth={2} dot={{ r: 3, fill: 'hsl(160,60%,45%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood Distribution Bar */}
        <div className="glass-surface rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> মোড বিতরণ (শীর্ষ ১৫)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodBarData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(215,12%,50%)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215,12%,50%)' }} width={120} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="hsl(42,100%,58%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
