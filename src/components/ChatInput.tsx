import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isListeningRef = useRef(false);

  const supportsVoice = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!supportsVoice) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'bn-BD';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      setInput(finalTranscript || interimTranscript);
    };

    recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch {
          isListeningRef.current = false;
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast.error('মাইক্রোফোন অ্যাক্সেস দাও! ব্রাউজারে মাইক পারমিশন চেক করো। 🎤');
        isListeningRef.current = false;
        setIsListening(false);
      } else if (event.error === 'no-speech') {
        // Silent - will auto-restart via onend
      } else if (event.error === 'aborted') {
        isListeningRef.current = false;
        setIsListening(false);
      } else {
        toast.error('ভয়েস রিকগনিশনে সমস্যা হয়েছে। আবার চেষ্টা করো।');
        isListeningRef.current = false;
        setIsListening(false);
      }
    };

    recognition.onaudiostart = () => {
      console.log('Audio capture started');
    };

    recognitionRef.current = recognition;

    return () => {
      isListeningRef.current = false;
      try { recognition.abort(); } catch {}
    };
  }, [supportsVoice]);

  const toggleVoice = async () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      isListeningRef.current = false;
      try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
    } else {
      // Request microphone permission first
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        toast.error('মাইক্রোফোন অ্যাক্সেস দাও! ব্রাউজার সেটিংস থেকে মাইক পারমিশন দাও। 🎤');
        return;
      }

      try {
        isListeningRef.current = true;
        recognitionRef.current.start();
        setIsListening(true);
        toast.success('ভয়েস ইনপুট চালু হয়েছে! এখন বাংলায় বলো... 🎤');
      } catch (err) {
        console.error('Failed to start recognition:', err);
        isListeningRef.current = false;
        setIsListening(false);
        toast.error('ভয়েস শুরু করতে সমস্যা হয়েছে। পেজ রিফ্রেশ করে আবার চেষ্টা করো।');
      }
    }
  };

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    // Stop voice if active
    if (isListening) {
      isListeningRef.current = false;
      try { recognitionRef.current?.stop(); } catch {}
      setIsListening(false);
    }
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
        placeholder={isListening ? '🎤 শুনছি... বাংলায় বলো...' : 'দেশি ভাই সব জানে, জিজ্ঞাসা করেই দেখনা...'}
        className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm py-1 resize-none max-h-32"
        disabled={disabled}
        aria-label="মেসেজ লেখো"
      />
      {supportsVoice && (
        <button
          onClick={toggleVoice}
          disabled={disabled}
          className={`p-2 rounded-xl transition-all duration-200 flex-shrink-0 relative ${
            isListening
              ? 'gradient-gold text-primary-foreground glow-gold'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
          aria-label={isListening ? 'ভয়েস বন্ধ করো' : 'ভয়েসে বলো'}
          title={isListening ? 'ভয়েস বন্ধ করো' : 'ভয়েসে বলো (বাংলা)'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {isListening && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive animate-pulse" />
          )}
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
