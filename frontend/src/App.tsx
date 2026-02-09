import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../src/store/useAuthStore";

import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Recommendations from "./pages/Recommendations";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={user?.isOnboarded ? "/recommendations" : "/onboarding"}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
