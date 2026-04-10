import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from './AdminLayout';

interface FeedbackItem {
  id: string;
  user_id: string;
  message_content: string | null;
  feedback_type: string;
  created_at: string;
  session_id: string | null;
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'up' | 'down'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      const query = supabase
        .from('message_feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      const { data } = await query;
      setFeedback((data as unknown as FeedbackItem[]) || []);
      setLoading(false);
    };
    fetchFeedback();
  }, []);

  const filtered = feedback.filter(f => {
    if (filter !== 'all' && f.feedback_type !== filter) return false;
    if (search && !f.message_content?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const upCount = feedback.filter(f => f.feedback_type === 'up').length;
  const downCount = feedback.filter(f => f.feedback_type === 'down').length;
  const ratio = feedback.length > 0 ? ((upCount / feedback.length) * 100).toFixed(0) : '0';

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" /> ফিডব্যাক
          </h1>
          <p className="text-sm text-muted-foreground">ইউজারদের মেসেজ রেটিং</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-surface rounded-xl p-4 text-center">
            <ThumbsUp className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-green-400">{upCount}</p>
            <p className="text-xs text-muted-foreground">পজিটিভ</p>
          </div>
          <div className="glass-surface rounded-xl p-4 text-center">
            <ThumbsDown className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-red-400">{downCount}</p>
            <p className="text-xs text-muted-foreground">নেগেটিভ</p>
          </div>
          <div className="glass-surface rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-primary">{ratio}%</p>
            <p className="text-xs text-muted-foreground">সন্তুষ্টি হার</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="মেসেজে খোঁজো..."
              className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'up', 'down'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f ? 'gradient-gold text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {f === 'all' ? 'সব' : f === 'up' ? '👍' : '👎'}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">লোড হচ্ছে...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">কোনো ফিডব্যাক নেই</div>
          ) : (
            filtered.map(f => (
              <div key={f.id} className="glass-surface rounded-xl p-4 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  f.feedback_type === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {f.feedback_type === 'up' ? <ThumbsUp className="w-4 h-4 text-green-400" /> : <ThumbsDown className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/80 line-clamp-3">{f.message_content || 'কোনো কন্টেন্ট নেই'}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(f.created_at).toLocaleString('bn-BD')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
