import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Gate for authenticated routes.
 *  - While the initial session is hydrating, show nothing (prevents a flicker
 *    where we'd bounce the user to /auth and back).
 *  - If there's no session once loaded, redirect to /auth and remember where
 *    they were trying to go via location state.
 */
export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-sm">
        Loading…
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}
