import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center gap-3 px-6 md:px-12 py-4 border-b border-border/50">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold text-foreground">গোপনীয়তা নীতি</h1>
      </nav>
      <div className="container mx-auto px-6 py-10 max-w-3xl">
        <div className="prose prose-invert max-w-none text-foreground/90">
          <h1 className="text-2xl font-bold text-foreground mb-6">গোপনীয়তা নীতি (Privacy Policy)</h1>
          <p className="text-muted-foreground text-sm mb-2">সর্বশেষ আপডেট: এপ্রিল ২০২৬</p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">১. তথ্য সংগ্রহ</h2>
          <p>দেশি ভাই - AI ব্যবহারের সময় আমরা নিম্নলিখিত তথ্য সংগ্রহ করি:</p>
          <ul className="list-disc ml-6 space-y-1 text-foreground/80">
            <li>Google অ্যাকাউন্টের মাধ্যমে নাম ও ইমেইল</li>
            <li>চ্যাট মেসেজ (সাময়িকভাবে সংরক্ষিত)</li>
            <li>ব্যবহারের পরিসংখ্যান (mood selection, session duration)</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">২. তথ্যের ব্যবহার</h2>
          <ul className="list-disc ml-6 space-y-1 text-foreground/80">
            <li>AI চ্যাট সেবা প্রদান করতে</li>
            <li>ব্যবহারকারীর অভিজ্ঞতা উন্নত করতে</li>
            <li>সেবার মান পরিমাপ করতে</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">৩. তথ্য সংরক্ষণ</h2>
          <p>চ্যাট ডেটা <strong>সর্বোচ্চ ৭ দিন</strong> সংরক্ষিত থাকে, এরপর স্বয়ংক্রিয়ভাবে মুছে ফেলা হয়। আপনি যেকোনো সময় নিজের চ্যাট ইতিহাস মুছে ফেলতে পারেন।</p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">৪. তথ্য নিরাপত্তা</h2>
          <ul className="list-disc ml-6 space-y-1 text-foreground/80">
            <li>সকল ডেটা এনক্রিপ্টেড চ্যানেলে (HTTPS) আদান-প্রদান হয়</li>
            <li>Row Level Security (RLS) দ্বারা প্রতিটি ব্যবহারকারীর ডেটা আলাদা রাখা হয়</li>
            <li>তৃতীয় পক্ষের সাথে ব্যক্তিগত তথ্য শেয়ার করা হয় না</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">৫. AI ব্যবহার</h2>
          <p>আমরা AI মডেল ব্যবহার করি উত্তর তৈরি করতে। আপনার মেসেজ AI মডেলে পাঠানো হয়, কিন্তু AI provider আপনার ডেটা সংরক্ষণ করে না।</p>

          <h2 className="text-lg font-semibold text-foreground mt-8 mb-3">৬. যোগাযোগ</h2>
          <p>গোপনীয়তা সম্পর্কিত প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।</p>
        </div>
      </div>
    </div>
  );
}
