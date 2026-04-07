import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const supportsVoice = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!supportsVoice) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'bn-BD';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => { recognition.abort(); };
  }, [supportsVoice]);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 128) + 'px';
  };

  return (
    <div className="glass-surface rounded-2xl flex items-end gap-2 px-3 md:px-4 py-3 shadow-lg">
      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="দেশি ভাই সব জানে, জিজ্ঞাসা করেই দেখনা..."
        className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm py-1 resize-none max-h-32"
        disabled={disabled}
        aria-label="মেসেজ লেখো"
      />
      {supportsVoice && (
        <button
          onClick={toggleVoice}
          disabled={disabled}
          className={`p-2 rounded-xl transition-all duration-200 flex-shrink-0 ${
            isListening
              ? 'gradient-gold text-primary-foreground animate-pulse glow-gold'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
          aria-label={isListening ? 'ভয়েস বন্ধ করো' : 'ভয়েসে বলো'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      )}
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="gradient-gold text-primary-foreground px-4 md:px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed glow-gold flex-shrink-0"
        aria-label="মেসেজ পাঠাও"
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline">সেন্ড</span>
      </button>
    </div>
  );
}