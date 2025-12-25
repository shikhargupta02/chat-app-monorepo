import { useEffect, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLoading, setError, setMessages, prependMessages, addMessage, clearMessages } from '../../store/slices/messageSlice';
import { messageApi } from '../../api/messageApi';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import './ChatWindow.css';

interface ChatWindowProps {
  receiverId: string;
}

export function ChatWindow({ receiverId }: ChatWindowProps) {
  const dispatch = useAppDispatch();
  const { loading, hasMore, cursor, error } = useAppSelector((state) => state.messages);
  const { user } = useAppSelector((state) => state.auth);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load messages on mount and when receiverId changes
  useEffect(() => {
    if (!user) return;

    // Clear previous messages when switching receivers
    dispatch(clearMessages());
    
    // Load initial messages
    const loadInitialMessages = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const response = await messageApi.getMessages(receiverId, undefined, 50);
        dispatch(setMessages({
          messages: response.messages,
          cursor: response.cursor,
          hasMore: response.hasMore,
        }));
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to load messages'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadInitialMessages();

    // Set up polling for new messages (every 3 seconds)
    pollingIntervalRef.current = setInterval(async () => {
      if (!user) return;
      try {
        const response = await messageApi.getMessages(receiverId, undefined, 50);
        dispatch(setMessages({
          messages: response.messages,
          cursor: response.cursor,
          hasMore: response.hasMore,
        }));
      } catch (err: any) {
        // Silently fail on polling errors
        console.error('Polling error:', err);
      }
    }, 3000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [receiverId, user, dispatch]);

  // Load more messages function
  const loadMessages = useCallback(async (isLoadMore: boolean = false) => {
    if (!user) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const currentCursor = isLoadMore ? cursor : undefined;
      const response = await messageApi.getMessages(
        receiverId,
        currentCursor,
        50
      );

      if (isLoadMore) {
        dispatch(prependMessages({
          messages: response.messages,
          cursor: response.cursor,
          hasMore: response.hasMore,
        }));
      } else {
        dispatch(setMessages({
          messages: response.messages,
          cursor: response.cursor,
          hasMore: response.hasMore,
        }));
      }
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to load messages'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [user, receiverId, cursor, dispatch]);

  const handleSendMessage = async (text: string) => {
    if (!user) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const newMessage = await messageApi.sendMessage({
        receiverId,
        text,
      });
      dispatch(addMessage(newMessage));
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to send message'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadMessages(true);
    }
  };

  if (!user) {
    return <div>Please log in to use the chat</div>;
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>Chat with User {receiverId}</h3>
        <div className="user-info">Logged in as: {user.email}</div>
      </div>
      {error && (
        <div className="chat-error">
          {error}
        </div>
      )}
      <MessageList
        currentUserId={user.id}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loading={loading}
      />
      <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
}

