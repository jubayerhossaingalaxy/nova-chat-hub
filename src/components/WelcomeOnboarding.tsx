import { useState } from 'react';
import { X, Sparkles, MessageSquare, Mic, Download } from 'lucide-react';

interface WelcomeOnboardingProps {
  userName?: string;
  onDismiss: () => void;
}

const tips = [
  { icon: Sparkles, title: '৭০+ মুড মোড', desc: 'উপরের মোড ট্যাব থেকে তোমার মেজাজ সিলেক্ট করো।' },
  { icon: MessageSquare, title: 'স্মার্ট সাজেশন', desc: 'প্রতিটি মোডে রেডিমেড প্রম্পট পাবে, ক্লিক করলেই শুরু!' },
  { icon: Mic, title: 'ভয়েস ইনপুট', desc: 'মাইক বাটনে ক্লিক করে বাংলায় কথা বলো।' },
  { icon: Download, title: 'চ্যাট সেভ করো', desc: 'গুরুত্বপূর্ণ কথোপকথন TXT বা JSON-এ ডাউনলোড করো।' },
];

export default function WelcomeOnboarding({ userName, onDismiss }: WelcomeOnboardingProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss();
  };

  return (
    <div className="glass-surface rounded-2xl p-5 mb-4 animate-fade-in relative border border-primary/20">
      <button onClick={handleDismiss} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
        <X className="w-4 h-4" />
      </button>
      <h3 className="text-base font-bold text-foreground mb-1">
        👋 স্বাগতম{userName ? `, ${userName}` : ''}!
      </h3>
      <p className="text-xs text-muted-foreground mb-4">দেশি ভাই - AI এ তোমাকে পেয়ে আমরা খুশি। কিছু টিপস দেখো:</p>
      <div className="grid grid-cols-2 gap-3">
        {tips.map((tip, i) => (
          <div key={i} className="bg-secondary/50 rounded-xl p-3">
            <tip.icon className="w-4 h-4 text-primary mb-1.5" />
            <p className="text-xs font-semibold text-foreground mb-0.5">{tip.title}</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
