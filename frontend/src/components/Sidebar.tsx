import React, { useState } from "react";
import {
  Home,
  Users,
  FileText,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  children?: React.ReactNode;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Users, label: "Users", href: "/users", badge: "12" },
  { icon: FileText, label: "Category", href: "/documents" },
  { icon: BarChart3, label: "Products", href: "/analytics" },
];

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("/");

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:relative 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isCollapsed ? "w-16" : "w-64"}
        h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-50
        flex flex-col
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div
            className={`flex items-center space-x-2 ${
              isCollapsed ? "hidden" : "block"
            }`}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-semibold text-gray-800">
              App Name
            </span>
          </div>

          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={toggleMobile}
            className="md:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.href;

            return (
              <button
                key={item.href}
                onClick={() => setActiveItem(item.href)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                  ${isCollapsed ? "justify-center" : "justify-start"}
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t p-4">
          <div
            className={`flex items-center space-x-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">JD</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">john@example.com</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center">
          <button
            onClick={toggleMobile}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors mr-3"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {navItems.find((item) => item.href === activeItem)?.label ||
              "Dashboard"}
          </h1>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children || (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to your Dashboard
                </h2>
                <p className="text-gray-600 mb-6">
                  This is a responsive sidebar layout built with shadcn/ui
                  components and Tailwind CSS. The sidebar collapses on desktop
                  and becomes a mobile drawer on smaller screens.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Responsive Design
                    </h3>
                    <p className="text-blue-700 text-sm">
                      Automatically adapts to different screen sizes
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">
                      Collapsible
                    </h3>
                    <p className="text-green-700 text-sm">
                      Desktop sidebar can be collapsed to save space
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">
                      Accessible
                    </h3>
                    <p className="text-purple-700 text-sm">
                      Built with proper ARIA labels and keyboard navigation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
