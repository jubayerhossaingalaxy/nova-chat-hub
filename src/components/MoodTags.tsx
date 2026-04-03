interface MoodTag {
  id: string;
  label: string;
  emoji: string;
}

export const MOOD_TAGS: MoodTag[] = [
  { id: 'bhai-radar', label: 'ভাই-রাদার', emoji: '🏠' },
  { id: 'gen-z', label: 'Gen-Z', emoji: '🔥' },
  { id: 'mon-halka', label: 'মন হালকা', emoji: '💦' },
  { id: 'poramorsho', label: 'পরামর্শ', emoji: '📍' },
  { id: 'thatta', label: 'ঠাট্টা', emoji: '😜' },
  { id: 'golpo', label: 'গল্প', emoji: '📚' },
  { id: 'deep-thinking', label: 'ডিপ থিংকিং', emoji: '🧠' },
  { id: 'romantic', label: 'রোমান্টিক', emoji: '💕' },
  { id: 'motivation', label: 'মোটিভেশন', emoji: '💪' },
  { id: 'coding-help', label: 'কোডিং হেল্প', emoji: '💻' },
  { id: 'roast', label: 'রোস্ট', emoji: '🔥' },
  { id: 'shayari', label: 'শায়েরি', emoji: '🌹' },
  { id: 'career', label: 'ক্যারিয়ার', emoji: '🎯' },
  { id: 'health', label: 'স্বাস্থ্য', emoji: '🏥' },
  { id: 'study', label: 'পড়াশোনা', emoji: '📖' },
  { id: 'news', label: 'খবর', emoji: '📰' },
  { id: 'religion', label: 'ধর্মীয়', emoji: '🕌' },
  { id: 'travel', label: 'ভ্রমণ', emoji: '✈️' },
  { id: 'cooking', label: 'রান্না', emoji: '🍳' },
  { id: 'business', label: 'ব্যবসা', emoji: '💰' },
  { id: 'relationship', label: 'সম্পর্ক', emoji: '💑' },
  { id: 'gaming', label: 'গেমিং', emoji: '🎮' },
  { id: 'music', label: 'গান-মিউজিক', emoji: '🎵' },
  { id: 'science', label: 'বিজ্ঞান', emoji: '🔬' },
  { id: 'history', label: 'ইতিহাস', emoji: '🏛️' },
  { id: 'debate', label: 'তর্ক-বিতর্ক', emoji: '⚔️' },
  { id: 'movie', label: 'মুভি-সিরিজ', emoji: '🎬' },
  { id: 'cricket', label: 'ক্রিকেট', emoji: '🏏' },
  { id: 'freelancing', label: 'ফ্রিল্যান্সিং', emoji: '💼' },
  { id: 'memes', label: 'মিমস', emoji: '🤣' },
  { id: 'horror', label: 'ভৌতিক গল্প', emoji: '👻' },
  { id: 'finance', label: 'টাকা-পয়সা', emoji: '🏦' },
];

interface MoodTagsProps {
  activeTag: string;
  onSelect: (id: string) => void;
}

export default function MoodTags({ activeTag, onSelect }: MoodTagsProps) {
  return (
    <div className="w-full overflow-hidden">
      <div className="flex gap-2 overflow-x-auto scrollbar-thin py-2 px-1">
        {MOOD_TAGS.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onSelect(tag.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTag === tag.id
                ? 'gradient-gold text-primary-foreground shadow-lg glow-gold scale-105'
                : 'bg-secondary text-foreground hover:bg-secondary/80 hover:scale-[1.02]'
            }`}
          >
            <span>{tag.emoji}</span>
            <span>{tag.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
