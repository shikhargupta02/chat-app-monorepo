import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatBoxGraphQLRouter from './router/chatBoxGraphQL.router';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.send('Backend running');
});

app.use('/graphql', chatBoxGraphQLRouter);

const server = createServer(app);

export const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '', `ws://${req.headers.host}`);
  const email = url.searchParams.get('email');

  if (!email) {
    ws.close(1008, 'Email required'); // optional: close if missing
    return;
  }

  (ws as any).email = email;

  console.log('SERVER: Client connected with email', email);

  ws.on('message', (message) => {
    console.log('SERVER: Received:', message.toString());

    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        console.log('Client email:', (client as any).email);
        client.send(`Server received: ${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('SERVER: Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`SERVER: Server running on port ${PORT}`);
});
