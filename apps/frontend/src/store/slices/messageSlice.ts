import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  createdAt?: string;
}

interface MessageState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  cursor: string | null;
}

const initialState: MessageState = {
  messages: [],
  loading: false,
  error: null,
  hasMore: true,
  cursor: null,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setMessages: (state, action: PayloadAction<{ messages: Message[]; cursor: string | null; hasMore: boolean }>) => {
      state.messages = action.payload.messages;
      state.cursor = action.payload.cursor;
      state.hasMore = action.payload.hasMore;
    },
    prependMessages: (state, action: PayloadAction<{ messages: Message[]; cursor: string | null; hasMore: boolean }>) => {
      // Prepend old messages for pagination
      state.messages = [...action.payload.messages, ...state.messages];
      state.cursor = action.payload.cursor;
      state.hasMore = action.payload.hasMore;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
      state.cursor = null;
      state.hasMore = true;
    },
  },
});

export const { setLoading, setError, setMessages, prependMessages, addMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;

