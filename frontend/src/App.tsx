// App.tsx - Keep the same structure you showed earlier
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "@/layouts/Layout";
import ProductsPage from "@/pages/Products";
import Categories from "@/pages/Category";
import UsersPage from "@/pages/User";
// import LoginPage from "./pages/auth/LoginPage";
import LoginPage from "./pages/auth/NewLogin";
// import RegisterPage from "./pages/auth/RegisterPage";
import RegisterPage from "./pages/auth/NewRegisterPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
    </Router>
  );
};

export default App;
