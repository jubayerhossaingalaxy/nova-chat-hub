import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onNewChat: () => void;
  onToggleSidebar: () => void;
  onToggleSearch: () => void;
}

export function useKeyboardShortcuts({ onNewChat, onToggleSidebar, onToggleSearch }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      
      // Ctrl/Cmd + K = Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onToggleSearch();
      }
      // Ctrl/Cmd + Shift + N = New chat
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        onNewChat();
      }
      // Ctrl/Cmd + B = Toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        onToggleSidebar();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNewChat, onToggleSidebar, onToggleSearch]);
}
