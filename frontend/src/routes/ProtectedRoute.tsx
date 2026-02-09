import { Navigate } from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore'

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuthStore();

  if (loading) return <p className="p-4">Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  return children;
};
