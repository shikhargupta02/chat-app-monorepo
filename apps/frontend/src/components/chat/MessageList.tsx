import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Message } from '../../store/slices/messageSlice';
import './MessageList.css';

interface MessageListProps {
  currentUserId: string;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export function MessageList({ currentUserId, onLoadMore, hasMore, loading }: MessageListProps) {
  const messages = useAppSelector((state) => state.messages.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef<number>(0);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // Handle scroll for pagination
  const handleScroll = () => {
    if (!listRef.current) return;

    const { scrollTop } = listRef.current;
    
    // Load more when scrolled to top
    if (scrollTop === 0 && hasMore && !loading) {
      prevScrollHeight.current = listRef.current.scrollHeight;
      onLoadMore();
    }
  };

  // Maintain scroll position after loading old messages
  useEffect(() => {
    if (listRef.current && prevScrollHeight.current > 0) {
      const newScrollHeight = listRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeight.current;
      listRef.current.scrollTop = scrollDiff;
      prevScrollHeight.current = 0;
    }
  }, [messages.length]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="message-list" ref={listRef} onScroll={handleScroll}>
      {loading && hasMore && (
        <div className="loading-indicator">Loading older messages...</div>
      )}
      {messages.map((message: Message) => {
        const isOwn = message.senderId === currentUserId;
        return (
          <div key={message.id} className={`message ${isOwn ? 'own' : 'other'}`}>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-timestamp">{formatTimestamp(message.timestamp || message.createdAt || '')}</div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

