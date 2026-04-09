import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Sparkles, Zap, Shield, Brain, Globe, Mic, Download, Users, Star, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import mascot from '@/assets/vaijan-mascot.png';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

const features = [
  { icon: MessageSquare, title: 'তোমার ভাষায় কথা', desc: 'বাংলায় আড্ডা মারো, ইংরেজি মেশাও—যেমন খুশি!' },
  { icon: Sparkles, title: '৭০+ মুড মোড', desc: 'রোমান্টিক, রোস্ট, কোডিং—যেকোনো মুডে ভাই রেডি!' },
  { icon: Zap, title: 'লাইটনিং ফাস্ট', desc: 'রিয়েল-টাইম স্ট্রিমিং রেসপন্স, কোনো লোডিং নেই।' },
  { icon: Shield, title: 'সেফ ও প্রাইভেট', desc: 'তোমার চ্যাট শুধু তোমার—৭ দিন পরে অটো ডিলিট।' },
  { icon: Brain, title: 'স্মার্ট AI', desc: 'কোড লিখো, কবিতা বলো, পরামর্শ নাও—সব পারে!' },
  { icon: Mic, title: 'ভয়েস ইনপুট', desc: 'বাংলায় কথা বলো, AI লিখে ফেলবে—হাতে টাইপ লাগবে না!' },
  { icon: Globe, title: 'সব ডিভাইসে', desc: 'মোবাইল, ট্যাবলেট, ডেস্কটপ—সব জায়গায় কাজ করে।' },
  { icon: Download, title: 'চ্যাট এক্সপোর্ট', desc: 'গুরুত্বপূর্ণ কথোপকথন সেভ করো TXT বা JSON-এ।' },
];

const stats = [
  { value: 70, suffix: '+', label: 'মুড মোড' },
  { value: 10, suffix: '+', label: 'ক্যাটেগরি' },
  { value: 24, suffix: '/৭', label: 'সার্ভিস' },
  { value: 100, suffix: '%', label: 'ফ্রি' },
];

const howItWorks = [
  { step: '১', title: 'গুগল দিয়ে লগইন', desc: 'শুধু এক ক্লিকে গুগল একাউন্ট দিয়ে সাইন ইন করো।' },
  { step: '২', title: 'মুড সিলেক্ট করো', desc: '৭০+ মোড থেকে তোমার মেজাজ অনুযায়ী একটা বেছে নাও।' },
  { step: '৩', title: 'আড্ডা শুরু!', desc: 'বাংলায় কথা বলো, কোড লেখো, গল্প শোনো—যা খুশি!' },
];

const testimonials = [
  { name: 'রাফি আহমেদ', role: 'ছাত্র, BUET', text: 'দেশি ভাই দিয়ে পড়াশোনার নোট বানাই। একদম নিজের ভাষায় বোঝায়, মজাও লাগে!', avatar: '🎓' },
  { name: 'নুসরাত জাহান', role: 'ফ্রিল্যান্সার', text: 'ক্লায়েন্টের প্রপোজাল থেকে সোশ্যাল মিডিয়া কন্টেন্ট—সব লেখাতে হেল্প করে। সেভ করা যায়!', avatar: '💼' },
  { name: 'তানভীর হাসান', role: 'ডেভেলপার', text: 'কোডিং মোডে বাংলায় explain করে! Debug করতে অনেক হেল্প করে। Voice input-ও কাজ করে।', avatar: '💻' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(value / (duration / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}{suffix}</span>;
}

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center text-sm font-bold">ভ</div>
          <span className="font-bold text-foreground text-lg">দেশি ভাই</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu />
          ) : (
            <Link to="/login" className="gradient-gold text-primary-foreground px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity glow-gold">
              লগইন
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-6 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-secondary/80 border border-border/50 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              AI-পাওয়ার্ড বাংলা চ্যাটবট • ৭০+ মোড
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-foreground">দেশি ভাই</span>
              <span className="gradient-text-gold"> - AI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              এইটা AI না ভাই, এইটা আসলেই <span className="text-primary font-semibold">ভাই!</span> তোমার মুডে, তোমার স্টাইলে—একদম নিজের মানুষের মতো আড্ডা।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={user ? '/chat' : '/login'} className="gradient-gold text-primary-foreground px-8 py-3.5 rounded-2xl text-base font-bold inline-flex items-center justify-center gap-2 hover:opacity-90 transition-all glow-gold group">
                আলাপ শুরু করুন
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/team" className="border border-border text-foreground px-8 py-3.5 rounded-2xl text-base font-medium inline-flex items-center justify-center gap-2 hover:bg-secondary transition-colors">
                টিম দেখুন
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 gradient-gold rounded-full blur-3xl opacity-20 scale-75" />
              <img src={mascot} alt="দেশি ভাই" width={380} height={380} className="relative z-10 animate-float drop-shadow-2xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Animated Stats */}
      <section className="relative z-10 container mx-auto px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <div key={i} className="glass-surface rounded-2xl p-6 text-center group hover:border-primary/30 transition-all">
              <p className="text-3xl md:text-4xl font-bold gradient-text-gold mb-1">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">কীভাবে কাজ করে?</h2>
          <p className="text-muted-foreground">মাত্র ৩ স্টেপে শুরু করো!</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {howItWorks.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative">
              <div className="glass-surface rounded-2xl p-6 text-center h-full hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center text-xl font-bold text-primary-foreground mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
              {i < 2 && <ChevronRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/40" />}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 container mx-auto px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">কেন দেশি ভাই - AI?</h2>
          <p className="text-muted-foreground">ফিচারগুলো দেখো, বুঝে যাবে!</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="glass-surface rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 container mx-auto px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">ব্যবহারকারীরা কী বলছে?</h2>
          <p className="text-muted-foreground">দেশি ভাই ফ্যামিলির মতামত</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="glass-surface rounded-2xl p-6 hover:border-primary/30 transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-primary fill-primary" />)}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-border/30">
                <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-lg">{t.avatar}</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-surface rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-gold opacity-5" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              তোমার নিজের <span className="gradient-text-gold">AI ভাই</span> অপেক্ষায় আছে!
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              ১০০% ফ্রি, কোনো ক্রেডিট কার্ড লাগবে না। এখনই শুরু করো!
            </p>
            <Link to={user ? '/chat' : '/login'} className="gradient-gold text-primary-foreground px-10 py-4 rounded-2xl text-lg font-bold inline-flex items-center gap-3 hover:opacity-90 transition-all glow-gold group">
              এখনই শুরু করো
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded gradient-gold flex items-center justify-center text-xs font-bold">ভ</div>
              <span className="text-sm text-muted-foreground">© 2026 দেশি ভাই - AI — তোমার বাংলা AI ভাই 💛</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">গোপনীয়তা নীতি</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">শর্তাবলী</Link>
              <Link to="/team" className="hover:text-foreground transition-colors">টিম</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
