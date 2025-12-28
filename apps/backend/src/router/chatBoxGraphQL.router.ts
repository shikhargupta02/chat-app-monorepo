import { Router } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { root } from '../resolvers/root';

const router = Router();

export const schema = buildSchema(`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Chat {
    id: ID!
    chatName: String!
  }
type Message {
    id: ID!
    chatId: ID!
    senderId: ID!
    text: String!
    timestamp: String!
  }
  type AuthPayload {
    token: String!
    user: User!
  }

  type ChatsPayload {
    chats: [Chat!]!
  }

  type Query {
    getChats(email: String!): ChatsPayload
    searchUsers(email:String!):User!
    messages(chatId: Int!): [Message!]!
    
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    signUp(email: String!, password: String!, username: String!): AuthPayload!
    createChat(receiverEmail: String!, senderEmail: String!): Chat!
    sendMessage(chatId: String!, text: String!, email: String!): Message!
  }
`);

router.use(
  '/',
  graphqlHTTP({
    schema: schema as any,
    rootValue: root,
    graphiql: true,
  }),
);

export default router;
