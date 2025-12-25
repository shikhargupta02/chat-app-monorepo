import { useState } from 'react';
import { ChatWindow } from './ChatWindow';
import './ChatSelector.css';

export function ChatSelector() {
  const [receiverId, setReceiverId] = useState('');
  const [selectedReceiver, setSelectedReceiver] = useState<string | null>(null);

  const handleStartChat = () => {
    if (receiverId.trim()) {
      setSelectedReceiver(receiverId.trim());
    }
  };

  const handleBack = () => {
    setSelectedReceiver(null);
    setReceiverId('');
  };

  if (selectedReceiver) {
    return (
      <div>
        <div className="back-button-container">
          <button onClick={handleBack} className="back-button">
            ← Back to Chat Selection
          </button>
        </div>
        <ChatWindow receiverId={selectedReceiver} />
      </div>
    );
  }

  return (
    <div className="chat-selector">
      <div className="chat-selector-card">
        <h2>Start a Chat</h2>
        <p>Enter the user ID of the person you want to chat with</p>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter receiver ID"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStartChat()}
          />
          <button onClick={handleStartChat} disabled={!receiverId.trim()}>
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
}
