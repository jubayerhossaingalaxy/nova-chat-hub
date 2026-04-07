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
  'golpo': ['একটা ভৌতিক গল্প বলো', 'রোমান্টিক গল্প শোনাও', 'সায়েন্স ফিকশন বলো'],
  'coding-help': ['React শেখাও', 'Python দিয়ে কী করা যায়?', 'Bug fix করতে হেল্প করো'],
  'roast': ['আমাকে রোস্ট করো!', 'সবচেয়ে মারাত্মক রোস্ট দাও', 'ফ্রেন্ডলি রোস্ট দাও'],
  'romantic': ['একটা প্রেমের কবিতা লেখো', 'রোমান্টিক মেসেজ লেখো', 'Love advice দাও'],
  'motivation': ['মোটিভেট করো ভাই', 'Life tough লাগছে', 'Success tips দাও'],
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