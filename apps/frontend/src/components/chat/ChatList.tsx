import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setSelectedChat,
  setShowNewChatModal,
  getMessagesRequest,
} from '../../store/slices/messageSlice';
import './ChatList.css';

export function ChatList() {
  const dispatch = useAppDispatch();
  const { chats, selectedChatId } = useAppSelector((state) => state.messages);

  const handleSelectChat = (chatId: string) => {
    dispatch(setSelectedChat(chatId));
    dispatch(getMessagesRequest({ chatId }));
  };

  const handleNewChat = () => {
    dispatch(setShowNewChatModal(true));
  };

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2>Chats</h2>
        <button
          className="new-chat-button"
          onClick={handleNewChat}
          title="New Chat"
        >
          +
        </button>
      </div>
      <div className="chat-list-items">
        {chats?.length === 0 ? (
          <div className="no-chats">
            <p>No chats yet</p>
            <button className="start-chat-button" onClick={handleNewChat}>
              Start a Chat
            </button>
          </div>
        ) : (
          chats?.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${selectedChatId === chat.id ? 'active' : ''}`}
              onClick={() => handleSelectChat(chat.id)}
            >
              <div className="chat-item-content">
                <div className="chat-name">{chat.chatName}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
