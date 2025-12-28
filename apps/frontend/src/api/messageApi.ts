import { graphqlClient } from './graphqlClient';
import { Message } from '../store/slices/messageSlice';

const GET_MESSAGES_QUERY = `
  query GetMessages($chatId: Int!) {
    messages(chatId: $chatId) {
      id
      chatId
      senderId
      text
      timestamp
    }
  }
`;

const SEND_MESSAGE_MUTATION = `
  mutation SendMessage($chatId: String!, $text: String!, $email: String!) {
    sendMessage(chatId: $chatId, text: $text, email: $email) {
      id
      chatId
      senderId
      text
      timestamp
    }
  }
`;

const GET_CHATS_QUERY = `
  query GetChats($email: String!) {
    getChats(email: $email) {
      chats {
        id
        chatName
      }
    }
  }
`;

const SEARCH_USERS_QUERY = `
  query SearchUsers($email: String!) {
    searchUsers(email: $email) {
      id
      email
      username
    }
  }
`;

const CREATE_CHAT_MUTATION = `
  mutation CreateChat($receiverEmail: String!, $senderEmail: String!) {
    createChat(receiverEmail: $receiverEmail, senderEmail: $senderEmail) {
      id
      chatName
    }
  }
`;

import { chatType, UserSearchResult } from '../store/slices/messageSlice';

export interface GetMessagesResponse {
  messages: Message[];
}

export interface SendMessageInput {
  chatId: string;
  text: string;
}

export interface SendMessageResponse {
  sendMessage: Message;
}

export interface GetChatsResponse {
  getChats: {
    chats: chatType[];
  };
}

export interface SearchUsersResponse {
  searchUsers: UserSearchResult[];
}

export interface CreateChatInput {
  receiverEmail: string;
}

export interface CreateChatResponse {
  createChat: chatType;
}

export const messageApi = {
  getMessages: async (chatId: number) => {
    const data = await graphqlClient.query<GetMessagesResponse>(
      GET_MESSAGES_QUERY,
      {
        chatId,
      },
    );
    return data.messages;
  },

  sendMessage: async (input: SendMessageInput) => {
    const data = await graphqlClient.mutation<SendMessageResponse>(
      SEND_MESSAGE_MUTATION,
      input,
    );
    return data.sendMessage;
  },

  getChats: async (email: string) => {
    const data = await graphqlClient.query<GetChatsResponse>(GET_CHATS_QUERY, {
      email,
    });
    return data.getChats.chats;
  },

  searchUsers: async (email: string) => {
    const data = await graphqlClient.query<SearchUsersResponse>(
      SEARCH_USERS_QUERY,
      {
        email,
      },
    );
    return data.searchUsers;
  },

  createChat: async (input: CreateChatInput) => {
    const data = await graphqlClient.mutation<CreateChatResponse>(
      CREATE_CHAT_MUTATION,
      input,
    );
    return data.createChat;
  },
};
