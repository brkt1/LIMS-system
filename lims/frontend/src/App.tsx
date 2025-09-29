import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AuthBypass from "./components/AuthBypass";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Header from "./components/Header";
import Login from "./components/Login";
import RoleBasedDashboard from "./components/RoleBasedDashboard";
import RoleBasedSidebar from "./components/RoleBasedSidebar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Component to handle routing logic inside Router context
function RouterContent() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated && user && location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  return <RoleBasedDashboard />;
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile

  // Handle desktop sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // Always open on desktop
      } else {
        setSidebarOpen(false); // Always closed on mobile
      }
    };

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Override toggle behavior for mobile
  const handleToggle = () => {
    if (window.innerWidth < 1024) {
      // On mobile, just toggle the sidebar
      setSidebarOpen(!sidebarOpen);
    } else {
      // On desktop, keep it open
      setSidebarOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading LIMS...</p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Storage & Show Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Role-based Sidebar */}
        <RoleBasedSidebar isOpen={sidebarOpen} onToggle={handleToggle} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col w-full lg:ml-64">
          {/* Header */}
          <Header onMenuToggle={handleToggle} />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="min-h-full">
              <ErrorBoundary>
                <RouterContent />
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <AuthBypass />
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
