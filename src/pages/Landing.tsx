import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Sparkles, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import mascot from '@/assets/vaijan-mascot.png';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/hooks/useAuth';

const features = [
  {
    icon: MessageSquare,
    title: 'তোমার ভাষায় কথা',
    desc: 'বাংলায় আড্ডা মারো, ইংরেজি মেশাও—যেমন খুশি!'
  },
  {
    icon: Sparkles,
    title: '৩০+ মুড মোড',
    desc: 'রোমান্টিক, রোস্ট, কোডিং—যেকোনো মুডে ভাই রেডি!'
  },
  {
    icon: Zap,
    title: 'লাইটনিং ফাস্ট',
    desc: 'রিয়েল-টাইম স্ট্রিমিং রেসপন্স, কোনো লোডিং নেই।'
  },
  {
    icon: Shield,
    title: 'সেফ ও প্রাইভেট',
    desc: 'তোমার চ্যাট শুধু তোমার—৭ দিন পরে অটো ডিলিট।'
  },
];

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
            <Link
              to="/login"
              className="gradient-gold text-primary-foreground px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity glow-gold"
            >
              লগইন
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-secondary/80 border border-border/50 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              AI-পাওয়ার্ড বাংলা চ্যাটবট
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-foreground">দেশি ভাই</span>
              <span className="gradient-text-gold"> - AI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              এইটা AI না ভাই, এইটা আসলেই <span className="text-primary font-semibold">ভাই!</span> তোমার মুডে, তোমার স্টাইলে—একদম নিজের মানুষের মতো আড্ডা।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to={user ? '/chat' : '/login'}
                className="gradient-gold text-primary-foreground px-8 py-3.5 rounded-2xl text-base font-bold inline-flex items-center justify-center gap-2 hover:opacity-90 transition-all glow-gold group"
              >
                আলাপ শুরু করুন
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/team"
                className="border border-border text-foreground px-8 py-3.5 rounded-2xl text-base font-medium inline-flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
              >
                টিম দেখুন
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 gradient-gold rounded-full blur-3xl opacity-20 scale-75" />
              <img
                src={mascot}
                alt="দেশি ভাই"
                width={380}
                height={380}
                className="relative z-10 animate-float drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 container mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">কেন দেশি ভাই - AI?</h2>
          <p className="text-muted-foreground">ফিচারগুলো দেখো, বুঝে যাবে!</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-surface rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 দেশি ভাই - AI — তোমার বাংলা AI ভাই 💛
        </p>
      </footer>
    </div>
  );
}
