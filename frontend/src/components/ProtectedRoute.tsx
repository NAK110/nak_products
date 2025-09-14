// components/ProtectedRoute.tsx
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import usersService, { type User } from "@/services/usersService"; // Import User type

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = ["admin", "user"],
}) => {
  // Fix: Properly type the user state as User | null
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if user info is in localStorage for quick UI update
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser) as User;
            setUser(parsedUser);
          } catch (parseError) {
            console.error("Error parsing stored user:", parseError);
            localStorage.removeItem("user");
          }
        }

        // Then verify with server (this uses your Laravel session)
        const currentUser = await usersService.getCurrentUser();
        setUser(currentUser);

        // Update localStorage with fresh data
        if (currentUser) {
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        setUser(null);
        localStorage.removeItem("user"); // Clear invalid user data
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/products" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
