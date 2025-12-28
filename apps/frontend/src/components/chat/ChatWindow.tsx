import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearMessages } from '../../store/slices/messageSlice';
import {
  getMessagesRequest,
  sendMessageRequest,
} from '../../store/slices/messageSlice';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import './ChatWindow.css';

interface ChatWindowProps {
  chatId: string;
}

export function ChatWindow({ chatId }: ChatWindowProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.messages);
  const { user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (!user) return;
    dispatch(clearMessages());
    // dispatch(getMessagesRequest({ chatId }));
  }, [chatId, user, dispatch]);

  const handleSendMessage = (text: string) => {
    if (!user) return;
    dispatch(sendMessageRequest({ chatId, text, email: user.email }));
  };

  if (!user) {
    return <div>Please log in to use the chat</div>;
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Chat</h3>
        <div className="user-info">Logged in as: {user.email}</div>
      </div>
      {error && <div className="chat-error">{error}</div>}
      <MessageList
        currentUserId={user.id}
        onLoadMore={() => {}}
        hasMore={false}
        loading={loading}
      />
      <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
}
