import { graphqlClient } from './graphqlClient';
import { Message } from '../store/slices/messageSlice';

const GET_MESSAGES_QUERY = `
  query GetMessages($receiverId: String!, $cursor: String, $limit: Int) {
    messages(receiverId: $receiverId, cursor: $cursor, limit: $limit) {
      messages {
        id
        senderId
        receiverId
        text
        timestamp
        createdAt
      }
      cursor
      hasMore
    }
  }
`;

const SEND_MESSAGE_MUTATION = `
  mutation SendMessage($receiverId: String!, $text: String!) {
    sendMessage(receiverId: $receiverId, text: $text) {
      id
      senderId
      receiverId
      text
      timestamp
      createdAt
    }
  }
`;

export interface GetMessagesResponse {
  messages: {
    messages: Message[];
    cursor: string | null;
    hasMore: boolean;
  };
}

export interface SendMessageInput {
  receiverId: string;
  text: string;
}

export interface SendMessageResponse {
  sendMessage: Message;
}

export const messageApi = {
  getMessages: async (receiverId: string, cursor?: string | null, limit: number = 50) => {
    const data = await graphqlClient.query<GetMessagesResponse>(GET_MESSAGES_QUERY, {
      receiverId,
      cursor,
      limit,
    });
    return data.messages;
  },
  
  sendMessage: async (input: SendMessageInput) => {
    const data = await graphqlClient.mutation<SendMessageResponse>(SEND_MESSAGE_MUTATION, input);
    return data.sendMessage;
  },
};

