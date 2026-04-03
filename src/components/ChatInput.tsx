import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-surface rounded-2xl flex items-center gap-3 px-4 py-3 shadow-lg">
      <textarea
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="দেশি ভাই সব জানে, জিজ্ঞাসা করেই দেখনা..."
        className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm py-1 resize-none max-h-32"
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="gradient-gold text-primary-foreground px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed glow-gold"
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline">সেন্ড</span>
      </button>
    </div>
  );
}
