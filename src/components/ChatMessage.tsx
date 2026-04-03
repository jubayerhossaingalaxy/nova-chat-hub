import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end mb-4"
      >
        <div className="max-w-[75%] flex items-end gap-2">
          <div className="bg-chat-user rounded-2xl rounded-br-md px-4 py-3 text-foreground shadow-md">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
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
      className="flex justify-start mb-4"
    >
      <div className="max-w-[80%] bg-chat-ai rounded-2xl rounded-bl-md px-5 py-4 text-foreground shadow-md border border-border/30">
        <div className="prose prose-sm prose-invert max-w-none text-foreground/90 leading-relaxed [&_p]:mb-2 [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-primary [&_pre]:bg-secondary [&_pre]:rounded-lg [&_pre]:p-3 [&_ul]:ml-4 [&_ol]:ml-4">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
