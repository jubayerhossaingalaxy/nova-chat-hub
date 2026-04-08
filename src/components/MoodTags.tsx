import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface MoodTag {
  id: string;
  label: string;
  emoji: string;
  category: string;
}

export const MOOD_CATEGORIES = [
  'প্রধান', 'আবেগ', 'শিক্ষা', 'বিনোদন', 'লাইফস্টাইল',
  'পেশা', 'সৃজনশীল', 'টেক', 'সামাজিক', 'বিশেষ'
];

export const MOOD_TAGS: MoodTag[] = [
  // প্রধান (Main)
  { id: 'bhai-radar', label: 'ভাই-রাদার', emoji: '🏠', category: 'প্রধান' },
  { id: 'gen-z', label: 'Gen-Z', emoji: '🔥', category: 'প্রধান' },
  { id: 'mon-halka', label: 'মন হালকা', emoji: '💦', category: 'প্রধান' },
  { id: 'poramorsho', label: 'পরামর্শ', emoji: '📍', category: 'প্রধান' },
  { id: 'thatta', label: 'ঠাট্টা', emoji: '😜', category: 'প্রধান' },
  { id: 'roast', label: 'রোস্ট', emoji: '🔥', category: 'প্রধান' },
  { id: 'motivation', label: 'মোটিভেশন', emoji: '💪', category: 'প্রধান' },

  // আবেগ (Emotion)
  { id: 'romantic', label: 'রোমান্টিক', emoji: '💕', category: 'আবেগ' },
  { id: 'sad-mode', label: 'কষ্ট পাইছি', emoji: '😢', category: 'আবেগ' },
  { id: 'angry-mode', label: 'রাগে আছি', emoji: '😤', category: 'আবেগ' },
  { id: 'happy-mode', label: 'খুশি আছি', emoji: '😄', category: 'আবেগ' },
  { id: 'lonely', label: 'একা লাগছে', emoji: '🌙', category: 'আবেগ' },
  { id: 'confused', label: 'কনফিউজড', emoji: '🤔', category: 'আবেগ' },
  { id: 'anxiety', label: 'উদ্বেগ', emoji: '😰', category: 'আবেগ' },
  { id: 'nostalgia', label: 'নস্টালজিয়া', emoji: '🕰️', category: 'আবেগ' },
  { id: 'gratitude', label: 'কৃতজ্ঞতা', emoji: '🙏', category: 'আবেগ' },

  // শিক্ষা (Education)
  { id: 'study', label: 'পড়াশোনা', emoji: '📖', category: 'শিক্ষা' },
  { id: 'science', label: 'বিজ্ঞান', emoji: '🔬', category: 'শিক্ষা' },
  { id: 'history', label: 'ইতিহাস', emoji: '🏛️', category: 'শিক্ষা' },
  { id: 'math', label: 'গণিত', emoji: '🔢', category: 'শিক্ষা' },
  { id: 'english', label: 'ইংরেজি শিখি', emoji: '🇬🇧', category: 'শিক্ষা' },
  { id: 'geography', label: 'ভূগোল', emoji: '🌍', category: 'শিক্ষা' },
  { id: 'philosophy', label: 'দর্শন', emoji: '🤯', category: 'শিক্ষা' },
  { id: 'quiz', label: 'কুইজ', emoji: '❓', category: 'শিক্ষা' },

  // বিনোদন (Entertainment)
  { id: 'golpo', label: 'গল্প', emoji: '📚', category: 'বিনোদন' },
  { id: 'horror', label: 'ভৌতিক গল্প', emoji: '👻', category: 'বিনোদন' },
  { id: 'movie', label: 'মুভি-সিরিজ', emoji: '🎬', category: 'বিনোদন' },
  { id: 'music', label: 'গান-মিউজিক', emoji: '🎵', category: 'বিনোদন' },
  { id: 'gaming', label: 'গেমিং', emoji: '🎮', category: 'বিনোদন' },
  { id: 'cricket', label: 'ক্রিকেট', emoji: '🏏', category: 'বিনোদন' },
  { id: 'memes', label: 'মিমস', emoji: '🤣', category: 'বিনোদন' },
  { id: 'anime', label: 'এনিমে-মাঙ্গা', emoji: '🎌', category: 'বিনোদন' },
  { id: 'sports', label: 'খেলাধুলা', emoji: '⚽', category: 'বিনোদন' },
  { id: 'drama', label: 'নাটক', emoji: '🎭', category: 'বিনোদন' },

  // লাইফস্টাইল (Lifestyle)
  { id: 'health', label: 'স্বাস্থ্য', emoji: '🏥', category: 'লাইফস্টাইল' },
  { id: 'cooking', label: 'রান্না', emoji: '🍳', category: 'লাইফস্টাইল' },
  { id: 'travel', label: 'ভ্রমণ', emoji: '✈️', category: 'লাইফস্টাইল' },
  { id: 'fitness', label: 'ফিটনেস', emoji: '🏋️', category: 'লাইফস্টাইল' },
  { id: 'fashion', label: 'ফ্যাশন', emoji: '👗', category: 'লাইফস্টাইল' },
  { id: 'gardening', label: 'বাগান', emoji: '🌱', category: 'লাইফস্টাইল' },
  { id: 'parenting', label: 'প্যারেন্টিং', emoji: '👶', category: 'লাইফস্টাইল' },
  { id: 'relationship', label: 'সম্পর্ক', emoji: '💑', category: 'লাইফস্টাইল' },
  { id: 'self-care', label: 'সেলফ কেয়ার', emoji: '🧘', category: 'লাইফস্টাইল' },

  // পেশা (Professional)
  { id: 'career', label: 'ক্যারিয়ার', emoji: '🎯', category: 'পেশা' },
  { id: 'business', label: 'ব্যবসা', emoji: '💰', category: 'পেশা' },
  { id: 'freelancing', label: 'ফ্রিল্যান্সিং', emoji: '💼', category: 'পেশা' },
  { id: 'finance', label: 'টাকা-পয়সা', emoji: '🏦', category: 'পেশা' },
  { id: 'interview', label: 'ইন্টারভিউ প্রেপ', emoji: '🤝', category: 'পেশা' },
  { id: 'resume', label: 'CV/Resume', emoji: '📄', category: 'পেশা' },
  { id: 'startup', label: 'স্টার্টআপ', emoji: '🚀', category: 'পেশা' },
  { id: 'marketing', label: 'মার্কেটিং', emoji: '📢', category: 'পেশা' },

  // সৃজনশীল (Creative)
  { id: 'shayari', label: 'শায়েরি', emoji: '🌹', category: 'সৃজনশীল' },
  { id: 'deep-thinking', label: 'ডিপ থিংকিং', emoji: '🧠', category: 'সৃজনশীল' },
  { id: 'poetry', label: 'কবিতা', emoji: '✒️', category: 'সৃজনশীল' },
  { id: 'writing', label: 'লেখালেখি', emoji: '📝', category: 'সৃজনশীল' },
  { id: 'art', label: 'আর্ট-ডিজাইন', emoji: '🎨', category: 'সৃজনশীল' },
  { id: 'photography', label: 'ফটোগ্রাফি', emoji: '📸', category: 'সৃজনশীল' },
  { id: 'storytelling', label: 'গল্প লেখা', emoji: '📖', category: 'সৃজনশীল' },

  // টেক (Tech)
  { id: 'coding-help', label: 'কোডিং হেল্প', emoji: '💻', category: 'টেক' },
  { id: 'web-dev', label: 'ওয়েব ডেভ', emoji: '🌐', category: 'টেক' },
  { id: 'mobile-dev', label: 'মোবাইল ডেভ', emoji: '📱', category: 'টেক' },
  { id: 'ai-ml', label: 'AI/ML', emoji: '🤖', category: 'টেক' },
  { id: 'cybersecurity', label: 'সাইবার সিকিউরিটি', emoji: '🔒', category: 'টেক' },
  { id: 'gadgets', label: 'গ্যাজেটস', emoji: '📟', category: 'টেক' },
  { id: 'linux', label: 'Linux', emoji: '🐧', category: 'টেক' },

  // সামাজিক (Social)
  { id: 'news', label: 'খবর', emoji: '📰', category: 'সামাজিক' },
  { id: 'religion', label: 'ধর্মীয়', emoji: '🕌', category: 'সামাজিক' },
  { id: 'debate', label: 'তর্ক-বিতর্ক', emoji: '⚔️', category: 'সামাজিক' },
  { id: 'politics', label: 'রাজনীতি', emoji: '🏛️', category: 'সামাজিক' },
  { id: 'social-media', label: 'সোশ্যাল মিডিয়া', emoji: '📲', category: 'সামাজিক' },
  { id: 'environment', label: 'পরিবেশ', emoji: '🌿', category: 'সামাজিক' },

  // বিশেষ (Special)
  { id: 'deshi-adda', label: 'দেশি আড্ডা', emoji: '☕', category: 'বিশেষ' },
  { id: 'time-travel', label: 'টাইম ট্রাভেল', emoji: '⏳', category: 'বিশেষ' },
  { id: 'detective', label: 'ডিটেক্টিভ', emoji: '🔍', category: 'বিশেষ' },
  { id: 'astrology', label: 'জ্যোতিষ', emoji: '⭐', category: 'বিশেষ' },
  { id: 'dream', label: 'স্বপ্নের মানে', emoji: '💭', category: 'বিশেষ' },
  { id: 'survival', label: 'সারভাইভাল', emoji: '🏕️', category: 'বিশেষ' },
  { id: 'dua-prayer', label: 'দোয়া-প্রার্থনা', emoji: '🤲', category: 'বিশেষ' },
  { id: 'riddle', label: 'ধাঁধা', emoji: '🧩', category: 'বিশেষ' },
  { id: 'bangla-culture', label: 'বাংলা সংস্কৃতি', emoji: '🇧🇩', category: 'বিশেষ' },
];

interface MoodTagsProps {
  activeTag: string;
  onSelect: (id: string) => void;
}

export default function MoodTags({ activeTag, onSelect }: MoodTagsProps) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let tags = MOOD_TAGS;
    if (search) {
      const q = search.toLowerCase();
      tags = tags.filter(t => t.label.toLowerCase().includes(q) || t.id.includes(q));
    }
    if (activeCategory) {
      tags = tags.filter(t => t.category === activeCategory);
    }
    return tags;
  }, [search, activeCategory]);

  const displayTags = expanded ? filtered : filtered.slice(0, 12);

  return (
    <div className="w-full">
      {/* Compact row */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-thin py-1 flex-1 min-w-0">
          {MOOD_TAGS.slice(0, 8).map((tag) => (
            <button
              key={tag.id}
              onClick={() => onSelect(tag.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                activeTag === tag.id
                  ? 'gradient-gold text-primary-foreground shadow-md glow-gold scale-105'
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              <span>{tag.emoji}</span>
              <span className="hidden sm:inline">{tag.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-full text-xs bg-secondary text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{expanded ? 'কম' : `+${MOOD_TAGS.length - 8}`}</span>
        </button>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="mt-2 glass-surface rounded-xl p-3 animate-fade-in max-h-[50vh] overflow-y-auto scrollbar-thin">
          {/* Search */}
          <div className="flex items-center gap-2 mb-3 bg-secondary rounded-lg px-3 py-2">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="মোড খোঁজো..."
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none flex-1"
              autoFocus
            />
          </div>

          {/* Categories */}
          <div className="flex gap-1.5 flex-wrap mb-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                !activeCategory ? 'gradient-gold text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              সব
            </button>
            {MOOD_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                  activeCategory === cat ? 'gradient-gold text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tags grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
            {displayTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => { onSelect(tag.id); setExpanded(false); }}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTag === tag.id
                    ? 'gradient-gold text-primary-foreground shadow-md'
                    : 'bg-secondary/60 text-foreground hover:bg-secondary'
                }`}
              >
                <span>{tag.emoji}</span>
                <span className="truncate">{tag.label}</span>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground text-xs py-4">কোনো মোড পাওয়া যায়নি 😅</p>
          )}
        </div>
      )}
    </div>
  );
}
