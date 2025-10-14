// layouts/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

const Layout: React.FC = () => {
  const { user: currentUser } = useAuth();

  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header - Different content for admin vs user */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Different title and description based on role */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {isAdmin ? "Admin Dashboard" : "Product Store"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {isAdmin
                  ? "Manage your store, products, and users"
                  : "Browse and discover amazing products"}
              </p>
            </div>
            {/* User info and actions */}
            <div className="flex items-center space-x-4">
              {/* Welcome message */}
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  Welcome back, {currentUser?.name}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {isAdmin ? "Administrator" : "Customer"}
                </div>
              </div>
              {/* Profile button */}
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors group">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {currentUser?.name.charAt(0).toUpperCase()}
                </div>
              </button>
            </div>
          </div>
        </header>
        {/* Main Content - Different styling for admin vs user */}
        <main className={`flex-1 overflow-auto ${isAdmin ? "p-6" : "p-4"}`}>
          {/* Different container styling */}
          <div className={isAdmin ? "" : "max-w-6xl mx-auto"}>
            {/* Optional: Different background for users */}
            <div
              className={
                isAdmin ? "" : "bg-white rounded-lg shadow-sm min-h-full p-6"
              }
            >
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
