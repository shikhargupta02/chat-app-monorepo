import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getChatsRequest,
  getMessagesRequest,
  setSelectedChat,
} from '../../store/slices/messageSlice';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import './ChatLayout.css';

export function ChatLayout() {
  const dispatch = useAppDispatch();
  const { chats, selectedChatId } = useAppSelector((state) => state.messages);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getChatsRequest(user?.email ?? ''));
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (chats?.length && !selectedChatId) {
      dispatch(setSelectedChat(chats[0].id));
      dispatch(getMessagesRequest({ chatId: chats[0].id }));
    }
  }, [chats, selectedChatId, dispatch]);

  return (
    <div className="chat-layout">
      <ChatList />
      <div className="chat-content">
        {selectedChatId ? (
          <ChatWindow chatId={selectedChatId} />
        ) : (
          <div className="no-chat-selected">
            <div className="welcome-message">
              <h2>Welcome to Chat</h2>
              <p>Select a chat from the left panel or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
