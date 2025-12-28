import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  searchUsersRequest,
  createChatRequest,
  setShowNewChatModal,
  setSearchResults,
} from '../../store/slices/messageSlice';
import './NewChatModal.css';

export function NewChatModal() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { searchResults, loading, error } = useAppSelector(
    (state) => state.messages,
  );
  const [searchEmail, setSearchEmail] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleSearch = (email: string) => {
    setSearchEmail(email);

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Debounce search - wait 500ms after user stops typing
    if (email.trim().length >= 3) {
      const timeout = setTimeout(() => {
        dispatch(searchUsersRequest({ email: email.trim() }));
      }, 500);
      setSearchTimeout(timeout);
    } else {
      dispatch(setSearchResults(null));
    }
  };

  const handleSelectUser = (email: string) => {
    dispatch(
      createChatRequest({
        receiverEmail: email,
        senderEmail: user?.email ?? '',
      }),
    );
  };

  const handleClose = () => {
    dispatch(setShowNewChatModal(false));
    dispatch(setSearchResults(null));
    setSearchEmail('');
  };
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Start New Chat</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="search-input-group">
            <input
              type="email"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading-indicator">Searching...</div>}
          {searchResults && (
            <div className="search-results">
              <div
                key={searchResults.id}
                className="user-result-item"
                onClick={() => handleSelectUser(searchResults.email)}
              >
                <div className="user-info">
                  <div className="user-email">{searchResults.email}</div>
                  {searchResults.username && (
                    <div className="user-username">
                      {searchResults.username}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {searchEmail.length >= 3 && searchResults && !loading && (
            <div className="no-results">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
}
