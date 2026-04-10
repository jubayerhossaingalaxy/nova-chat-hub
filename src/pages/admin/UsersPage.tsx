import { useState, useMemo } from 'react';
import { Users, Search, Mail, Calendar, MessageSquare, Shield, ShieldCheck } from 'lucide-react';
import { useAdminData, AdminUser } from '@/hooks/useAdmin';
import AdminLayout from './AdminLayout';

export default function UsersPage() {
  const { users, loading } = useAdminData();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    let list = users;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.email?.toLowerCase().includes(q) ||
        u.full_name?.toLowerCase().includes(q)
      );
    }
    if (roleFilter !== 'all') {
      list = list.filter(u => (u.role || 'user') === roleFilter);
    }
    return list;
  }, [users, search, roleFilter]);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> ইউজার ম্যানেজমেন্ট
          </h1>
          <p className="text-sm text-muted-foreground">সকল রেজিস্টার্ড ইউজারের তালিকা</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নাম বা ইমেইল দিয়ে খোঁজো..."
              className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50"
          >
            <option value="all">সব রোল</option>
            <option value="admin">অ্যাডমিন</option>
            <option value="moderator">মডারেটর</option>
            <option value="user">ইউজার</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="glass-surface rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-foreground">{users.length}</p>
            <p className="text-xs text-muted-foreground">মোট ইউজার</p>
          </div>
          <div className="glass-surface rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-green-400">{users.filter(u => u.role === 'admin').length}</p>
            <p className="text-xs text-muted-foreground">অ্যাডমিন</p>
          </div>
          <div className="glass-surface rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-blue-400">{users.reduce((a, u) => a + u.session_count, 0)}</p>
            <p className="text-xs text-muted-foreground">মোট সেশন</p>
          </div>
          <div className="glass-surface rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-primary">{users.reduce((a, u) => a + u.message_count, 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">মোট মেসেজ</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-surface rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">ইউজার</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">যোগদান</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">সেশন</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">মেসেজ</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">রোল</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground text-sm">লোড হচ্ছে...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground text-sm">কোনো ইউজার পাওয়া যায়নি</td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <UserRow key={user.id} user={user} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  const roleColors: Record<string, string> = {
    admin: 'bg-primary/20 text-primary',
    moderator: 'bg-blue-500/20 text-blue-400',
    user: 'bg-secondary text-muted-foreground',
  };
  const role = user.role || 'user';

  return (
    <tr className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              (user.full_name || user.email || 'U')[0].toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user.full_name || 'নাম নেই'}</p>
            <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
              <Mail className="w-3 h-3" /> {user.email}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(user.created_at).toLocaleDateString('bn-BD')}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-sm text-foreground">{user.session_count}</span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-sm text-foreground">{user.message_count}</span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full ${roleColors[role]}`}>
          {role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
          {role}
        </span>
      </td>
    </tr>
  );
}
