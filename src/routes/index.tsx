import { Navigate, Route, Routes } from "react-router-dom";

import { Auth } from "../pages/Auth/Auth";
import { Home } from "../pages/Home/Home";
import { Redirect } from "../pages/Redirect/Redirect";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route path="/:id" element={<Redirect />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
