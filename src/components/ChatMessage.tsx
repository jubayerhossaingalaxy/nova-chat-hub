import { useState, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, Bookmark, BookmarkCheck, Pencil } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  onRetry?: () => void;
  onFeedback?: (type: 'up' | 'down') => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  onEdit?: (newContent: string) => void;
}

function ChatMessageInner({ role, content, onRetry, onFeedback, onBookmark, isBookmarked, onEdit }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(content);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    onFeedback?.(type);
  };

  const handleEditSubmit = () => {
    if (editText.trim() && editText !== content) {
      onEdit?.(editText.trim());
    }
    setEditing(false);
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
            {editing ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="bg-secondary rounded-lg px-3 py-2 text-sm text-foreground outline-none resize-none min-h-[60px]"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditing(false)} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1">বাতিল</button>
                  <button onClick={handleEditSubmit} className="text-xs gradient-gold text-primary-foreground px-3 py-1 rounded-lg">পাঠাও</button>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
            )}
            <div className="absolute -left-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground p-1" aria-label="কপি করো">
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {onEdit && !editing && (
                <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground p-1" aria-label="এডিট করো">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
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
          <div className="prose prose-sm prose-invert max-w-none text-foreground/90 leading-relaxed [&_p]:mb-2 [&_ul]:ml-4 [&_ol]:ml-4">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  if (match) {
                    return (
                      <div className="relative group/code my-2">
                        <div className="flex items-center justify-between bg-secondary/80 rounded-t-lg px-3 py-1.5 border-b border-border/30">
                          <span className="text-[10px] text-muted-foreground uppercase font-mono">{match[1]}</span>
                          <button
                            onClick={() => { navigator.clipboard.writeText(codeString); }}
                            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" /> কপি
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, fontSize: '12px' }}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }
                  return (
                    <code className="bg-secondary px-1.5 py-0.5 rounded text-primary text-xs" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
        <div className="flex items-center gap-0.5 mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors" aria-label="কপি করো">
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {onRetry && (
            <button onClick={onRetry} className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors" aria-label="আবার চেষ্টা করো">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          {onFeedback && (
            <>
              <button
                onClick={() => handleFeedback('up')}
                className={`p-1 rounded transition-colors ${feedback === 'up' ? 'text-green-400' : 'text-muted-foreground hover:text-foreground'}`}
                aria-label="ভালো লেগেছে"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleFeedback('down')}
                className={`p-1 rounded transition-colors ${feedback === 'down' ? 'text-destructive' : 'text-muted-foreground hover:text-foreground'}`}
                aria-label="ভালো লাগেনি"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {onBookmark && (
            <button
              onClick={onBookmark}
              className={`p-1 rounded transition-colors ${isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="বুকমার্ক করো"
            >
              {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const ChatMessage = memo(ChatMessageInner);
export default ChatMessage;
