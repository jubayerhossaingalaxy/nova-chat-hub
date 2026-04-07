import { useState, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  onRetry?: () => void;
}

function ChatMessageInner({ role, content, onRetry }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end mb-4 group"
      >
        <div className="max-w-[75%] flex items-end gap-2">
          <div className="bg-chat-user rounded-2xl rounded-br-md px-4 py-3 text-foreground shadow-md relative">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            <button
              onClick={handleCopy}
              className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
              aria-label="কপি করো"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="w-7 h-7 rounded-full gradient-gold flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
            😊
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start mb-4 group"
    >
      <div className="max-w-[80%]">
        <div className="bg-chat-ai rounded-2xl rounded-bl-md px-5 py-4 text-foreground shadow-md border border-border/30">
          <div className="prose prose-sm prose-invert max-w-none text-foreground/90 leading-relaxed [&_p]:mb-2 [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-primary [&_code]:text-xs [&_pre]:bg-secondary [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto [&_ul]:ml-4 [&_ol]:ml-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
            aria-label="কপি করো"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
              aria-label="আবার চেষ্টা করো"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const ChatMessage = memo(ChatMessageInner);
export default ChatMessage;