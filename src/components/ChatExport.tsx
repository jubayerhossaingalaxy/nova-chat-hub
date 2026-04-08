import { useState } from 'react';
import { Download, FileText, File } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatExportProps {
  messages: Message[];
  mood: string;
}

export default function ChatExport({ messages, mood }: ChatExportProps) {
  const [open, setOpen] = useState(false);

  const exportAsText = () => {
    const header = `দেশি ভাই - AI চ্যাট\nমোড: ${mood}\nতারিখ: ${new Date().toLocaleDateString('bn-BD')}\n${'='.repeat(50)}\n\n`;
    const body = messages.map(m => {
      const sender = m.role === 'user' ? '👤 আপনি' : '🤖 দেশি ভাই';
      return `${sender}:\n${m.content}\n`;
    }).join('\n---\n\n');

    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deshi-bhai-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const exportAsJSON = () => {
    const data = {
      app: 'দেশি ভাই - AI',
      mood,
      exportedAt: new Date().toISOString(),
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deshi-bhai-chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  if (messages.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-muted-foreground hover:text-foreground transition-colors p-1"
        aria-label="চ্যাট এক্সপোর্ট করো"
      >
        <Download className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 glass-surface rounded-xl shadow-2xl py-2 z-50 w-48 animate-fade-in">
          <button
            onClick={exportAsText}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/60 transition-colors"
          >
            <FileText className="w-4 h-4 text-muted-foreground" />
            Text (.txt)
          </button>
          <button
            onClick={exportAsJSON}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/60 transition-colors"
          >
            <File className="w-4 h-4 text-muted-foreground" />
            JSON (.json)
          </button>
        </div>
      )}
    </div>
  );
}
