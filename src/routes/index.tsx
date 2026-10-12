import { Navigate, Route, Routes } from "react-router-dom";

import { Auth } from "../pages/Auth/Auth";
import { Home } from "../pages/Home/Home";
import { Redirect } from "../pages/Redirect/Redirect";
import { ProtectedRoute } from "./ProtectedRoute";
import { IsLoggedProtection } from "./IsLoggedProtection";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <IsLoggedProtection>
            <Auth />
          </IsLoggedProtection>
        }
      />

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
