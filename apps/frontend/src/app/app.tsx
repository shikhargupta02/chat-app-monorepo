import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { AuthPage } from '../components/auth/AuthPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ChatSelector } from '../components/chat/ChatSelector';
import { useAppSelector } from '../store/hooks';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getMessagesRequest } from '../store/slices/messageSlice';

export function App() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const wsRef = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const ws = new WebSocket(`ws://localhost:3000?email=${user.email}`);
      wsRef.current = ws;

      ws.onopen = () => console.log('CLIENT: Connected to server');
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.payload.chatId)
          dispatch(getMessagesRequest({ chatId: data.payload.chatId }));
      };
      ws.onerror = (error) => console.error('WebSocket error:', error);
      ws.onclose = () => console.log('CLIENT: Disconnected');

      return () => {
        ws.close();
      };
    }
    return undefined;
  }, [isAuthenticated, user?.email]);

  return (
    <Layout>
      <Routes>
        <Route
          path="/auth"
          element={
            isAuthenticated ? <Navigate to="/chat" replace /> : <AuthPage />
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatSelector />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? '/chat' : '/auth'} replace />
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
