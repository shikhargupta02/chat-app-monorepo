import { prisma, wss } from '../main';
import { GraphQLResolveInfo } from 'graphql';
import jwt from 'jsonwebtoken';

export const root = {
  login: async (
    _parent: any,
    args: { email: string; password: string },
    _context: any,
    info: GraphQLResolveInfo,
  ) => {
    const user = await prisma.user.findFirst({
      where: { email: args.email, password: args.password },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    const token = jwt.sign(
      { email: user?.email, password: args.password },
      process.env.JWT_SECRET as string,
      { expiresIn: '10h' },
    );

    return { token, user };
  },
  signUp: async (args: {
    email: string;
    password: string;
    username: string;
  }) => {
    const existingUser = await prisma.user.findFirst({
      where: { email: args.email },
    });
    console.log(existingUser, args.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = await prisma.user.create({
      data: {
        email: args.email,
        password: args.password,
        username: args.username,
      },
    });
    const token = jwt.sign(
      { email: user?.email, password: args.password },
      process.env.JWT_SECRET as string,
      { expiresIn: '10h' },
    );
    return {
      token,
      user: { email: user.email, username: user.username, id: user.id },
    };
  },
  getChats: async (args: { email: string }) => {
    const userChats = await prisma.user.findUnique({
      where: { email: args.email },
      select: {
        chats: {
          select: {
            chat: {
              select: {
                id: true,
                chatName: true,
                isGroup: true,
              },
            },
          },
        },
      },
    });
    return {
      chats:
        userChats?.chats.map((c) => ({
          id: String(c.chat.id),
          chatName: c.chat.chatName,
        })) ?? [],
    };
  },
  searchUsers: async (args: { email: string }) => {
    const user = await prisma.user.findFirst({
      where: { email: args.email },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    return user;
  },
  createChat: async (args: { receiverEmail: string; senderEmail: string }) => {
    const sendingUser = await prisma.user.findUnique({
      where: { email: args.senderEmail },
      select: { id: true, username: true },
    });
    const recievingUser = await prisma.user.findUnique({
      where: { email: args.receiverEmail },
      select: { id: true, username: true },
    });
    if (!recievingUser || !sendingUser) {
      throw new Error('User with this email does not exist');
    }
    const newChat = await prisma.chat.create({
      data: {
        chatName: 'Direct Message',
        isGroup: false,
      },
      select: {
        id: true,
        chatName: true,
        isGroup: true,
      },
    });
    await prisma.chatMember.createMany({
      data: [
        {
          chatId: newChat.id,
          userId: sendingUser?.id,
        },
        {
          chatId: newChat.id,
          userId: recievingUser?.id,
        },
      ],
    });
    return newChat;
  },
  messages: async (args: { chatId: number }) => {
    const messages = await prisma.message.findMany({
      where: { chatId: args.chatId },
      orderBy: { createdAt: 'asc' },
    });
    return messages.map((msg) => ({
      id: msg.id,
      chatId: msg.chatId,
      senderId: msg.senderId,
      text: msg.text,
      timestamp: msg.createdAt,
    }));
  },
  sendMessage: async (args: {
    chatId: string;
    text: string;
    email: string;
  }) => {
    const sendingUser = await prisma.user.findUnique({
      where: { email: args.email },
      select: { id: true },
    });
    const recievingUser = await prisma.chatMember.findMany({
      where: { chatId: Number(args.chatId) },
      select: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    if (!sendingUser) {
      throw new Error('User with this email does not exist');
    }
    const newMessage = await prisma.message.create({
      data: {
        chatId: Number(args.chatId),
        senderId: sendingUser.id,
        text: args.text,
        createdAt: new Date().toISOString(),
      },
    });
    const userEmails = recievingUser.map((user) => user.user.email);
    console.log(wss.clients);
    wss.clients.forEach((client) => {
      if (
        client.readyState === 1 &&
        userEmails.includes((client as any).email)
      ) {
        console.log('Sending message to', (client as any).email);
        client.send(
          JSON.stringify({
            type: 'NEW_MESSAGE',
            payload: newMessage,
          }),
        );
      }
    });
    return {
      id: newMessage.id,
      chatId: newMessage.chatId,
      senderId: newMessage.senderId,
      text: newMessage.text,
      timestamp: newMessage.createdAt,
    };
  },
};
