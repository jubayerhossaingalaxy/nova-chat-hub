import { 
  Users, MessageSquare, BarChart3, TrendingUp, Activity, 
  ThumbsUp, ThumbsDown, ArrowUpRight, ArrowDownRight, Zap 
} from 'lucide-react';
import { useAdminData } from '@/hooks/useAdmin';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { MOOD_TAGS } from '@/components/MoodTags';
import AdminLayout from './AdminLayout';

const COLORS = ['hsl(42,100%,58%)', 'hsl(160,60%,45%)', 'hsl(220,70%,55%)', 'hsl(340,65%,50%)', 'hsl(270,60%,55%)', 'hsl(30,80%,55%)', 'hsl(180,50%,45%)', 'hsl(0,65%,50%)'];

function StatCard({ icon: Icon, label, value, subValue, trend, color }: {
  icon: any; label: string; value: string | number; subValue?: string; trend?: 'up' | 'down'; color: string;
}) {
  return (
    <div className="glass-surface rounded-2xl p-5 hover:border-primary/20 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {subValue}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const { stats, moodStats, dailyMessages, dailyUsers, loading, refresh } = useAdminData();

  const chartMessages = dailyMessages.map(d => ({
    date: new Date(d.day).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' }),
    messages: d.msg_count || 0,
  }));

  const chartUsers = dailyUsers.map(d => ({
    date: new Date(d.day).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' }),
    users: d.user_count || 0,
  }));

  const moodPieData = moodStats.slice(0, 8).map(m => {
    const tag = MOOD_TAGS.find(t => t.id === m.mood);
    return { name: tag?.label || m.mood, value: Number(m.count) };
  });

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">ড্যাশবোর্ড</h1>
            <p className="text-sm text-muted-foreground">সার্বিক পরিস্থিতি এক নজরে</p>
          </div>
          <button onClick={refresh} disabled={loading} className="text-sm text-muted-foreground hover:text-foreground border border-border rounded-xl px-4 py-2 hover:bg-secondary transition-colors disabled:opacity-50">
            {loading ? 'লোড হচ্ছে...' : '🔄 রিফ্রেশ'}
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="মোট ইউজার" value={stats.total_users} subValue="24h" trend="up" color="bg-blue-500/20 text-blue-400" />
            <StatCard icon={MessageSquare} label="মোট মেসেজ" value={stats.total_messages.toLocaleString()} subValue={`${stats.messages_24h} আজ`} trend="up" color="bg-green-500/20 text-green-400" />
            <StatCard icon={Activity} label="অ্যাক্টিভ ইউজার (24h)" value={stats.active_users_24h} color="bg-purple-500/20 text-purple-400" />
            <StatCard icon={Zap} label="সেশন (24h)" value={stats.sessions_24h} subValue={`মোট ${stats.total_sessions}`} color="bg-amber-500/20 text-amber-400" />
          </div>
        )}

        {/* Feedback Summary */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={ThumbsUp} label="পজিটিভ ফিডব্যাক" value={stats.positive_feedback} color="bg-green-500/20 text-green-400" />
            <StatCard icon={ThumbsDown} label="নেগেটিভ ফিডব্যাক" value={stats.negative_feedback} color="bg-red-500/20 text-red-400" />
            <StatCard icon={BarChart3} label="মোট ফিডব্যাক" value={stats.total_feedback} color="bg-blue-500/20 text-blue-400" />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Messages Chart */}
          <div className="glass-surface rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> দৈনিক মেসেজ (৩০ দিন)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartMessages}>
                  <defs>
                    <linearGradient id="msgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(42,100%,58%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(42,100%,58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215,12%,50%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(215,12%,50%)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,14%,18%)', borderRadius: '12px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="messages" stroke="hsl(42,100%,58%)" fill="url(#msgGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Active Users Chart */}
          <div className="glass-surface rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> দৈনিক অ্যাক্টিভ ইউজার
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartUsers}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215,12%,50%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(215,12%,50%)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,14%,18%)', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="users" fill="hsl(160,60%,45%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="glass-surface rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> জনপ্রিয় মোড
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={moodPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                    {moodPieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,14%,18%)', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {moodPieData.map((m, i) => (
                <span key={i} className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {m.name}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-surface rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">📊 দ্রুত পরিসংখ্যান</h3>
            <div className="space-y-4">
              {stats && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">গড় মেসেজ/সেশন</span>
                    <span className="text-sm font-semibold text-foreground">
                      {stats.total_sessions > 0 ? (stats.total_messages / stats.total_sessions).toFixed(1) : '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ফিডব্যাক রেট</span>
                    <span className="text-sm font-semibold text-foreground">
                      {stats.total_feedback > 0 ? ((stats.positive_feedback / stats.total_feedback) * 100).toFixed(0) : '0'}% পজিটিভ
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">মোট সেশন</span>
                    <span className="text-sm font-semibold text-foreground">{stats.total_sessions.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">জনপ্রিয় মোড</span>
                    <span className="text-sm font-semibold text-primary">{moodPieData[0]?.name || 'N/A'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
