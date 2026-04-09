import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-destructive/10 border-b border-destructive/30 px-4 py-2 flex items-center justify-center gap-2 text-sm text-destructive animate-fade-in">
      <WifiOff className="w-4 h-4" />
      <span>ইন্টারনেট কানেকশন নেই। কানেক্ট হলে আবার চেষ্টা করো।</span>
    </div>
  );
}
