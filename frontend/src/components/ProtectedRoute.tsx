import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// A component that protects routes that require authentication
// tokens stored in AuthContext
// here isAuthenticated is checked from AuthContext

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/api/v1/accounts/token" replace />;
  }

  return children;
};

export default ProtectedRoute;
