import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  chatId: string;
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  createdAt?: string;
}
export interface chatType {
  id: string;
  chatName: string;
  isGroup?: boolean;
}

export interface UserSearchResult {
  id: string;
  email: string;
  username?: string;
}

export interface GetMessagesRequest {
  chatId: string;
}
export interface GetChatRequest {
  email: string;
}

export interface SendMessageRequest {
  chatId: string;
  text: string;
  email: string;
}

export interface SearchUsersRequest {
  email: string;
}

export interface CreateChatRequest {
  receiverEmail: string;
  senderEmail: string;
}

interface MessageState {
  chats: chatType[] | null;
  messages: Message[];
  selectedChatId: string | null;
  searchResults: UserSearchResult | null;
  showNewChatModal: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: MessageState = {
  chats: null,
  messages: [],
  selectedChatId: null,
  searchResults: null,
  showNewChatModal: false,
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // Saga trigger actions
    getMessagesRequest: (state, action: PayloadAction<GetMessagesRequest>) => {
      // Saga will handle this
    },
    sendMessageRequest: (state, action: PayloadAction<SendMessageRequest>) => {
      // Saga will handle this
    },
    getChatsRequest: (state, action: PayloadAction<GetChatRequest>) => {
      // Saga will handle this
    },
    searchUsersRequest: (state, action: PayloadAction<SearchUsersRequest>) => {
      // Saga will handle this
    },
    createChatRequest: (state, action: PayloadAction<CreateChatRequest>) => {
      // Saga will handle this
    },
    // State update actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setMessages: (
      state,
      action: PayloadAction<{
        messages: Message[];
      }>,
    ) => {
      state.messages = action.payload.messages;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setChats: (state, action: PayloadAction<chatType[]>) => {
      state.chats = action.payload;
    },
    addChat: (state, action: PayloadAction<chatType>) => {
      if (state.chats === null) state.chats = [];
      state.chats?.push(action.payload);
    },
    setSelectedChat: (state, action: PayloadAction<string | null>) => {
      state.selectedChatId = action.payload;
    },
    setSearchResults: (
      state,
      action: PayloadAction<UserSearchResult | null>,
    ) => {
      state.searchResults = action.payload;
    },
    setShowNewChatModal: (state, action: PayloadAction<boolean>) => {
      state.showNewChatModal = action.payload;
    },
  },
});

export const {
  getMessagesRequest,
  sendMessageRequest,
  getChatsRequest,
  searchUsersRequest,
  createChatRequest,
  setLoading,
  setError,
  setMessages,
  addMessage,
  clearMessages,
  setChats,
  addChat,
  setSelectedChat,
  setSearchResults,
  setShowNewChatModal,
} = messageSlice.actions;
export default messageSlice.reducer;
