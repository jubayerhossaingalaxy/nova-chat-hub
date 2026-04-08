import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center gap-3 px-6 md:px-12 py-4 border-b border-border/50">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold text-foreground">ব্যবহারের শর্তাবলী</h1>
      </nav>
      <div className="container mx-auto px-6 py-10 max-w-3xl">
        <div className="prose prose-invert max-w-none text-foreground/90">
          <h1 className="text-2xl font-bold text-foreground mb-6">ব্যবহারের শর্তাবলী (Terms of Service)</h1>
          <p className="text-muted-foreground text-sm mb-2">সর্বশেষ আপডেট: এপ্রিল ২০২৬</p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">১. সেবার বিবরণ</h2>
          <p>দেশি ভাই - AI হলো একটি AI-পাওয়ার্ড বাংলা চ্যাটবট যা বিভিন্ন মোডে কথা বলতে পারে।</p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">২. ব্যবহারের নিয়ম</h2>
          <ul className="list-disc ml-6 space-y-1 text-foreground/80">
            <li>অবৈধ, ক্ষতিকর, বা আপত্তিকর কন্টেন্ট তৈরি করতে ব্যবহার করা যাবে না</li>
            <li>অন্য ব্যবহারকারীর ক্ষতি করার উদ্দেশ্যে ব্যবহার নিষিদ্ধ</li>
            <li>স্বয়ংক্রিয় বট বা স্ক্রিপ্ট দিয়ে অতিরিক্ত ব্যবহার করা যাবে না</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">৩. AI সীমাবদ্ধতা</h2>
          <ul className="list-disc ml-6 space-y-1 text-foreground/80">
            <li>AI উত্তর সবসময় সঠিক নাও হতে পারে</li>
            <li>চিকিৎসা, আইনি, বা আর্থিক পরামর্শের বিকল্প হিসেবে ব্যবহার করা উচিত নয়</li>
            <li>গুরুতর সমস্যায় সবসময় বিশেষজ্ঞের পরামর্শ নিন</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">৪. অ্যাকাউন্ট</h2>
          <p>আপনার অ্যাকাউন্টের নিরাপত্তা আপনার দায়িত্ব। Google অ্যাকাউন্টের মাধ্যমে লগইন করা হয়।</p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">৫. পরিবর্তন</h2>
          <p>আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করতে পারি। পরিবর্তন হলে অ্যাপে জানানো হবে।</p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">৬. যোগাযোগ</h2>
          <p>শর্তাবলী সম্পর্কে প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।</p>
        </div>
      </div>
    </div>
  );
}
