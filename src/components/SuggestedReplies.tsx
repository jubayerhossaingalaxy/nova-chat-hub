import { memo } from 'react';

interface SuggestedRepliesProps {
  mood: string;
  onSelect: (text: string) => void;
}

const MOOD_SUGGESTIONS: Record<string, string[]> = {
  'bhai-radar': ['কেমন আছিস ভাই?', 'আজকে কী করলি?', 'একটা মজার কিছু বল'],
  'gen-z': ['Bro what\'s the tea? ☕', 'Vibe check দে তো', 'Lowkey bored, কিছু বল'],
  'mon-halka': ['মন খারাপ ভাই 😢', 'একটু হাসাও না', 'Life niye confused'],
  'poramorsho': ['ক্যারিয়ার নিয়ে confused', 'কী করা উচিত?', 'একটু গাইড করো'],
  'thatta': ['আমাকে রোস্ট করো 😂', 'একটা জোক শোনাও', 'মজা করো কিছু নিয়ে'],
  'roast': ['আমাকে রোস্ট করো!', 'সবচেয়ে মারাত্মক রোস্ট দাও', 'ফ্রেন্ডলি রোস্ট দাও'],
  'motivation': ['মোটিভেট করো ভাই 💪', 'Life tough লাগছে', 'Success tips দাও'],
  'romantic': ['একটা প্রেমের কবিতা লেখো', 'রোমান্টিক মেসেজ লেখো', 'Love advice দাও'],
  'sad-mode': ['কষ্ট পাচ্ছি ভাই 😢', 'একটু কথা বলবে?', 'মন ভালো করতে হেল্প করো'],
  'angry-mode': ['অনেক রাগ হচ্ছে! 😤', 'কীভাবে calm down করবো?', 'রাগ কমানোর tips দাও'],
  'happy-mode': ['আজকে অনেক খুশি! 🎉', 'খুশির খবর শেয়ার করি!', 'Fun কিছু করি আয়!'],
  'lonely': ['একা লাগছে ভাই 🌙', 'কথা বলো আমার সাথে', 'কিছু মজার করো'],
  'confused': ['Confused আছি ভাই 🤔', 'Decision নিতে হেল্প করো', 'Options analyze করো'],
  'anxiety': ['উদ্বিগ্ন লাগছে 😰', 'Calm down করতে সাহায্য করো', 'Breathing exercise করাও'],
  'nostalgia': ['ছোটবেলার কথা মনে পড়ে 🕰️', '90s এর কথা বলো', 'পুরনো দিনের গল্প করো'],
  'gratitude': ['কৃতজ্ঞ আছি জীবনের জন্য 🙏', 'Gratitude practice শেখাও', 'আজকের ৩টা ভালো জিনিস বলি'],
  'study': ['পড়াশোনার tips দাও', 'Exam preparation হেল্প করো', 'Study plan বানাও'],
  'science': ['মজার science fact বলো 🔬', 'Space নিয়ে কিছু বলো', 'Physics explain করো'],
  'history': ['মুক্তিযুদ্ধের গল্প বলো', 'ইতিহাসের মজার fact দাও', 'বাংলার ইতিহাস শেখাও'],
  'math': ['Math problem solve করো 🔢', 'Algebra শেখাও', 'Math কে easy করো'],
  'english': ['English grammar শেখাও', 'Vocabulary বাড়াতে হেল্প করো', 'Conversation practice করি'],
  'geography': ['বাংলাদেশের নদী বলো 🌍', 'দেশ সম্পর্কে fun facts দাও', 'Climate change বোঝাও'],
  'philosophy': ['জীবনের মানে কী? 🤯', 'Existence নিয়ে ভাবো', 'Famous philosophers বলো'],
  'quiz': ['একটা quiz দাও! ❓', 'GK test নাও', 'Brain teaser দাও'],
  'golpo': ['একটা ভৌতিক গল্প বলো', 'রোমান্টিক গল্প শোনাও', 'সায়েন্স ফিকশন বলো'],
  'horror': ['ভয়ের গল্প শোনাও 👻', 'পেত্নীর গল্প বলো', 'রাত ৩টার গল্প দাও'],
  'movie': ['আজকে কোন মুভি দেখবো? 🎬', 'Best Bangla movie বলো', 'Series recommend করো'],
  'music': ['মন খারাপের গান বলো 🎵', 'Party playlist দাও', 'বাংলা band নিয়ে কথা বলো'],
  'gaming': ['PUBG tips দাও 🎮', 'Best mobile game বলো', 'Gaming setup recommend করো'],
  'cricket': ['বাংলাদেশ ক্রিকেট নিয়ে বলো 🏏', 'Best XI বানাও', 'Match prediction দাও'],
  'memes': ['Meme বানাও 🤣', 'Trending meme বলো', 'Dank meme দাও'],
  'anime': ['Best anime recommend করো 🎌', 'Naruto vs Goku debate!', 'নতুন anime কী দেখবো?'],
  'sports': ['Football নিয়ে কথা বলো ⚽', 'Workout routine দাও', 'Sports news দাও'],
  'drama': ['Best নাটক recommend করো 🎭', 'Mosharraf Karim-এর নাটক বলো', 'K-drama suggest করো'],
  'health': ['Health tips দাও 🏥', 'কী খাবো কী খাবো না?', 'ঘরোয়া চিকিৎসা বলো'],
  'cooking': ['Easy recipe দাও 🍳', 'বিরিয়ানি বানাতে শেখাও', 'Bachelor cooking tips'],
  'travel': ['বাংলাদেশে কোথায় ঘুরতে যাবো? ✈️', 'Budget travel tips দাও', 'Hidden gems বলো'],
  'fitness': ['Home workout দাও 🏋️', 'Diet plan বানাও', 'Weight loss tips দাও'],
  'fashion': ['Styling tips দাও 👗', 'Budget shopping কোথায়?', 'Grooming tips দাও'],
  'gardening': ['ব্যালকনিতে কী লাগাবো? 🌱', 'Indoor plants recommend করো', 'Gardening basics শেখাও'],
  'parenting': ['বাচ্চাকে কী শেখাবো? 👶', 'Positive parenting tips দাও', 'Screen time manage করো'],
  'relationship': ['সম্পর্কে সমস্যা 💑', 'Communication improve করি', 'Trust issues solve করো'],
  'self-care': ['Self care routine দাও 🧘', 'Burnout হচ্ছে, কী করবো?', 'Mental health tips দাও'],
  'career': ['কোন career ভালো? 🎯', 'Job interview tips দাও', 'Skill development করি'],
  'business': ['Business idea দাও 💰', 'Marketing strategy বানাও', 'E-commerce শুরু করবো'],
  'freelancing': ['Freelancing শুরু করবো 💼', 'Upwork profile optimize করো', 'Client পাওয়ার tips দাও'],
  'finance': ['Budget plan বানাও 🏦', 'Investment কোথায় করবো?', 'Savings tips দাও'],
  'interview': ['Common questions বলো 🤝', 'STAR method শেখাও', 'Mock interview করো'],
  'resume': ['CV review করো 📄', 'Cover letter লিখতে হেল্প', 'LinkedIn optimize করো'],
  'startup': ['Startup idea validate করো 🚀', 'Business plan বানাও', 'Funding কীভাবে পাবো?'],
  'marketing': ['Social media strategy দাও 📢', 'Content ideas দাও', 'SEO basics শেখাও'],
  'shayari': ['একটা শায়েরি বলো 🌹', 'প্রেমের শায়েরি লেখো', 'বিরহের শায়েরি শোনাও'],
  'deep-thinking': ['জীবন কী? 🧠', 'Consciousness নিয়ে ভাবো', 'Universe কত বড়?'],
  'poetry': ['একটা কবিতা লেখো ✒️', 'রবীন্দ্রনাথের মতো লেখো', 'Free verse কবিতা দাও'],
  'writing': ['Blog post লিখতে হেল্প 📝', 'Writing tips দাও', 'Writer\'s block ভাঙাও'],
  'art': ['Drawing tips দাও 🎨', 'Color theory শেখাও', 'Digital art শুরু করবো'],
  'photography': ['Mobile photography tips 📸', 'Composition rules শেখাও', 'Photo editing শেখাও'],
  'storytelling': ['গল্প লিখতে হেল্প 📖', 'Plot idea দাও', 'Character create করি'],
  'coding-help': ['React শেখাও', 'Python দিয়ে কী করা যায়?', 'Bug fix করতে হেল্প করো'],
  'web-dev': ['HTML/CSS শেখাও 🌐', 'React project idea দাও', 'Full-stack হতে চাই'],
  'mobile-dev': ['Flutter শেখাও 📱', 'App idea validate করো', 'React Native vs Flutter?'],
  'ai-ml': ['ML কী? বোঝাও 🤖', 'Python দিয়ে AI শুরু করি', 'ChatGPT কীভাবে কাজ করে?'],
  'cybersecurity': ['Online safe থাকার tips 🔒', 'Password security শেখাও', 'Phishing চিনবো কীভাবে?'],
  'gadgets': ['কোন ফোন কিনবো? 📟', 'Best laptop suggest করো', 'Budget earbuds বলো'],
  'linux': ['Linux শুরু করবো 🐧', 'Ubuntu vs Fedora?', 'Terminal commands শেখাও'],
  'news': ['আজকের খবর কী? 📰', 'Tech news দাও', 'বাংলাদেশের update দাও'],
  'religion': ['আজকের দোয়া বলো 🕌', 'ইসলামের ইতিহাস শেখাও', 'ধর্মীয় জ্ঞান দাও'],
  'debate': ['একটা topic দাও debate করি ⚔️', 'আমার argument-এ weakness বলো', 'Logical fallacy শেখাও'],
  'politics': ['বাংলাদেশের রাজনীতি 🏛️', 'বিশ্ব রাজনীতি নিয়ে বলো', 'Policy analysis করো'],
  'social-media': ['Follower বাড়ানোর tips 📲', 'Content calendar বানাও', 'Viral হতে কী করবো?'],
  'environment': ['পরিবেশ রক্ষার tips 🌿', 'Climate change বোঝাও', 'Eco-friendly জীবন যাপন'],
  'deshi-adda': ['চা খেতে খেতে আড্ডা দিই ☕', 'রাজনীতি-ক্রিকেট আড্ডা করি', 'দেশি গসিপ দাও'],
  'time-travel': ['১৯৭১ এ নিয়ে যাও ⏳', 'ভবিষ্যতের পৃথিবী দেখাও', 'মুঘল আমলে যেতে চাই'],
  'detective': ['Mystery solve করতে চাই 🔍', 'একটা case দাও', 'Sherlock-এর মত deduce করো'],
  'astrology': ['আমার রাশিফল বলো ⭐', 'Zodiac compatibility চেক করো', 'আজকের ভাগ্য কেমন?'],
  'dream': ['গতরাতের স্বপ্নের মানে বলো 💭', 'Lucid dreaming কীভাবে করবো?', 'স্বপ্নে সাপ দেখলে কী হয়?'],
  'survival': ['বন্যায় কী করবো? 🏕️', 'First aid শেখাও', 'Emergency kit কী কী রাখবো?'],
  'dua-prayer': ['ঘুমানোর আগের দোয়া বলো 🤲', 'পরীক্ষার আগে কোন দোয়া পড়বো?', 'সুরা ইয়াসিন-এর ফজিলত'],
  'riddle': ['একটা ধাঁধা দাও! 🧩', 'Brain teaser চাই', 'Logic puzzle দাও'],
  'bangla-culture': ['পহেলা বৈশাখ নিয়ে বলো 🇧🇩', 'বাউল সংগীত কী?', 'মসলিন কাপড়ের ইতিহাস বলো'],
};

const DEFAULT_SUGGESTIONS = ['কিছু মজার বলো!', 'আজকের টিপস দাও', 'হেল্প দরকার'];

function SuggestedRepliesInner({ mood, onSelect }: SuggestedRepliesProps) {
  const suggestions = MOOD_SUGGESTIONS[mood] || DEFAULT_SUGGESTIONS;

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {suggestions.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="px-3 py-1.5 rounded-full text-xs bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-200 hover:scale-105 border border-border/30"
        >
          {text}
        </button>
      ))}
    </div>
  );
}

const SuggestedReplies = memo(SuggestedRepliesInner);
export default SuggestedReplies;
