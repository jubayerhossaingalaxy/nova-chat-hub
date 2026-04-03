import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: 'মোঃ রাইসুল আলম রাতুল',
    role: 'Lead Graphic Designer',
    company: 'Ritto360',
  },
  {
    name: 'ফুয়াদ হাসান দ্বীপ্র',
    role: 'Lead Web Developer',
    company: 'Ritto360',
  },
];

export default function Team() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> ফিরে যান
        </Link>
        {user && <UserMenu />}
      </nav>

      <section className="relative z-10 container mx-auto px-6 py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-3"
        >
          কোর <span className="gradient-text-gold">টিম</span>
        </motion.h1>
        <p className="text-muted-foreground text-sm mb-12">দেশি ভাই - AI এর পেছনের মানুষগুলো</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {teamMembers.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="glass-surface rounded-2xl p-8 text-center hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">
                👤
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">{member.name}</h3>
              <p className="text-sm text-primary font-medium mb-1">{member.role}</p>
              <p className="text-xs text-muted-foreground">{member.company}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
