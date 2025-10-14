import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Grid3X3,
  Users,
  User2,
  LogOut,
  Sparkle,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import productsService from "@/services/productsService";
import categoriesService from "@/services/categoriesService";
import usersService from "@/services/usersService";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [productsCount, setProductsCount] = useState<number>(0);
  const [categoriesCount, setCategoriesCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const isLoadingRef = useRef(false);

  // Use the auth context instead of fetching again
  const { user: currentUser, loading: userLoading } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCounts = async () => {
      if (!currentUser) return;

      isLoadingRef.current = true;
      setLoading(true);

      try {
        const requests = [
          productsService.getAll(),
          categoriesService.getAll(),
        ] as const;

        const adminRequests =
          currentUser.role === "admin"
            ? [...requests, usersService.getAll() as Promise<any>]
            : requests;

        const results = await Promise.allSettled(adminRequests);

        const [products, categories, users] = results;

        if (products.status === "fulfilled") {
          setProductsCount(products.value.length);
        }
        if (categories.status === "fulfilled") {
          setCategoriesCount(categories.value.length);
        }
        if (currentUser.role === "admin" && users?.status === "fulfilled") {
          setUsersCount(users.value.length);
        }
      } catch (error) {
        console.error("Error loading sidebar counts:", error);
        setProductsCount(0);
        setCategoriesCount(0);
        setUsersCount(0);
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    };

    if (!userLoading && currentUser) {
      loadCounts();
    }
  }, [currentUser?.role, userLoading]); 

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const navigationItems = React.useMemo(() => {
    const baseItems = [
      {
        title: "Products",
        icon: Package,
        href: "/products",
        badge: loading
          ? "..."
          : productsCount > 0
          ? productsCount.toString()
          : null,
        color: "blue",
        // Different descriptions for different roles
        description:
          currentUser?.role === "admin" ? "Manage inventory" : "Browse catalog",
      },
    ];

    // Add admin-only items
    if (currentUser?.role === "admin") {
      baseItems.push(
        {
          title: "Categories",
          icon: Grid3X3,
          href: "/categories",
          badge: loading
            ? "..."
            : categoriesCount > 0
            ? categoriesCount.toString()
            : null,
          color: "green",
          description: "Organize products",
        },
        {
          title: "Users",
          icon: Users,
          href: "/users",
          badge: loading
            ? "..."
            : usersCount > 0
            ? usersCount.toString()
            : null,
          color: "purple",
          description: "Manage accounts",
        }
      );
    }

    return baseItems;
  }, [currentUser?.role, loading, productsCount, categoriesCount, usersCount]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (href: string) => location.pathname === href;

  const getBadgeColor = (color: string, isActiveItem: boolean) => {
    const colors = {
      blue: isActiveItem
        ? "bg-blue-200 text-blue-800"
        : "bg-blue-100 text-blue-600",
      green: isActiveItem
        ? "bg-green-200 text-green-800"
        : "bg-green-100 text-green-600",
      purple: isActiveItem
        ? "bg-purple-200 text-purple-800"
        : "bg-purple-100 text-purple-600",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col h-screen`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkle className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-gray-900">
                {currentUser?.role === "admin" ? "Admin Panel" : "Luxora"}
              </span>
              <div className="text-xs text-gray-500">
                {currentUser?.role === "admin" ? "Management" : "Shopping"}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item, index) => {
          const itemIsActive = isActive(item.href);
          return (
            <Link
              key={index}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors group ${
                isCollapsed ? "justify-center" : ""
              } ${
                itemIsActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
              title={isCollapsed ? item.title : ""}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-sm font-medium">
                    {item.title}
                  </span>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${getBadgeColor(
                        item.color,
                        itemIsActive
                      )}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="border-t border-gray-200">
        {/* User Profile */}
        <div className="p-4">
          {isCollapsed ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User2 className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User2 className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                {userLoading ? (
                  <>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </>
                ) : currentUser ? (
                  <>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser.email}
                    </p>
                    {currentUser.role && (
                      <p className="text-xs text-blue-600 capitalize truncate">
                        {currentUser.role}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Guest User
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Not authenticated
                    </p>
                  </>
                )}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                    <LogOut className="w-4 h-4 text-red-500" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to logout?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be redirected to the login page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      className="bg-red-500"
                    >
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
