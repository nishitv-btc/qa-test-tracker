import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg font-semibold">Redirecting to login...</div>
      </div>
    );
  }

  return children;
}
