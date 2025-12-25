import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { AuthPage } from '../components/auth/AuthPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ChatSelector } from '../components/chat/ChatSelector';
import { useAppSelector } from '../store/hooks';

export function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

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
