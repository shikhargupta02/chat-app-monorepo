import { call, put, takeEvery } from 'redux-saga/effects';
import { messageApi } from '../../api/messageApi';
import {
  getMessagesRequest,
  sendMessageRequest,
  getChatsRequest,
  searchUsersRequest,
  createChatRequest,
  SendMessageRequest,
  CreateChatRequest,
  setLoading,
  setError,
  setMessages,
  addMessage,
  setChats,
  addChat,
  setSearchResults,
  setSelectedChat,
  setShowNewChatModal,
} from '../slices/messageSlice';

function* getMessagesSaga(action: ReturnType<typeof getMessagesRequest>) {
  try {
    yield put(setLoading(true));
    yield put(setError(null));

    const messages = yield call(
      messageApi.getMessages,
      Number(action.payload.chatId),
    );

    yield put(setMessages({ messages }));
  } catch (error: any) {
    yield put(setError(error.message || 'Failed to load messages'));
  } finally {
    yield put(setLoading(false));
  }
}

function* sendMessageSaga(action: ReturnType<typeof sendMessageRequest>) {
  try {
    yield put(setLoading(true));
    yield put(setError(null));

    const newMessage = yield call(
      messageApi.sendMessage,
      action.payload as SendMessageRequest,
    );

    yield put(addMessage(newMessage));
  } catch (error: any) {
    yield put(setError(error.message || 'Failed to send message'));
  } finally {
    yield put(setLoading(false));
  }
}

function* getChatsSaga(action: ReturnType<typeof getChatsRequest>) {
  try {
    yield put(setLoading(true));
    yield put(setError(null));
    const chats = yield call(messageApi.getChats, action.payload);

    yield put(setChats(chats));
  } catch (error: any) {
    yield put(setError(error.message || 'Failed to load chats'));
    yield put(setChats([]));
  } finally {
    yield put(setLoading(false));
  }
}

function* searchUsersSaga(action: ReturnType<typeof searchUsersRequest>) {
  try {
    yield put(setError(null));

    const results = yield call(messageApi.searchUsers, action.payload.email);

    yield put(setSearchResults(results));
  } catch (error: any) {
    yield put(setError(error.message || 'Failed to search users'));
    yield put(setSearchResults([]));
  }
}

function* createChatSaga(action: ReturnType<typeof createChatRequest>) {
  try {
    yield put(setLoading(true));
    yield put(setError(null));

    const newChat = yield call(
      messageApi.createChat,
      action.payload as CreateChatRequest,
    );

    yield put(addChat(newChat));
    yield put(setSelectedChat(newChat.id));
    yield put(setShowNewChatModal(false));
    yield put(setSearchResults([]));

    // Load messages for the new chat
    yield put(getMessagesRequest({ chatId: newChat.id }));
  } catch (error: any) {
    yield put(setError(error.message || 'Failed to create chat'));
  } finally {
    yield put(setLoading(false));
  }
}

export function* watchMessageSaga() {
  yield takeEvery(getMessagesRequest.type, getMessagesSaga);
  yield takeEvery(sendMessageRequest.type, sendMessageSaga);
  yield takeEvery(getChatsRequest.type, getChatsSaga);
  yield takeEvery(searchUsersRequest.type, searchUsersSaga);
  yield takeEvery(createChatRequest.type, createChatSaga);
}
