// App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/layouts/Layout";
import ProductsPage from "@/pages/Products";
import Categories from "@/pages/Category";
import UsersPage from "@/pages/User";
import LoginPage from "./pages/auth/NewLogin";
import RegisterPage from "./pages/auth/NewRegisterPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      {/* Wrap everything with AuthProvider */}
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/products" replace />} />
            <Route path="products" element={<ProductsPage />} />

            {/* Categories - admin only */}
            <Route
              path="categories"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Categories />
                </ProtectedRoute>
              }
            />

            {/* Users - admin only */}
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
