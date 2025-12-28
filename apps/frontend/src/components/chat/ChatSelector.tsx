import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setShowNewChatModal } from '../../store/slices/messageSlice';
import { ChatLayout } from './ChatLayout';
import { NewChatModal } from './NewChatModal';

export function ChatSelector() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { chats, showNewChatModal } = useAppSelector((state) => state.messages);

  useEffect(() => {
    if (isAuthenticated && chats?.length === 0 && !showNewChatModal) {
      dispatch(setShowNewChatModal(true));
    }
    return undefined;
  }, [isAuthenticated, chats, dispatch]);

  return (
    <>
      <ChatLayout />
      {showNewChatModal && <NewChatModal />}
    </>
  );
}
