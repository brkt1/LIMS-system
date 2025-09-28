import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../services/api";
import type {
  AuthContextType,
  AuthResponse,
  LoginCredentials,
  User,
  UserRole,
} from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          // Verify token and get user data
          // You might want to add a verify endpoint to your backend
          const userData = localStorage.getItem("user_data");
          const tenantData = localStorage.getItem("tenant_data");

          if (userData && tenantData) {
            const parsedUser = JSON.parse(userData);
            const parsedTenant = JSON.parse(tenantData);
            setUser(parsedUser);
            setTenant(parsedTenant);
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_data");
          localStorage.removeItem("tenant_data");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);


      // Try real API call first
      try {
        const response = await authAPI.login({
          email: credentials.email,
          password: credentials.password,
        });
        const data: AuthResponse = response.data;

        // Store tokens and user data
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user_data", JSON.stringify(data.user));
        localStorage.setItem("tenant_data", JSON.stringify(data.tenant));

        // Set user state
        setUser(data.user);
        setTenant(data.tenant);

        console.log("Backend login successful:", data.user);
        return;
      } catch (apiError: any) {
        console.error(
          "Backend API failed, trying mock authentication:",
          apiError
        );

        // If it's a 401 error, don't fall back to mock - show the real error
        if (apiError.response?.status === 401) {
          throw new Error(
            "Invalid credentials. Please check your email and password."
          );
        }

        // If API call fails, throw error
        throw new Error(
          apiError.response?.data?.detail ||
            "Invalid credentials. Please check your email and password."
        );
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("tenant_data");
    setUser(null);
    setTenant(null);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const hasPermission = (_permission: string): boolean => {
    if (!user) return false;
    // This would need to be implemented based on your permission system
    // For now, we'll use role-based permissions
    return hasRole(user.role);
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      // Get fresh user data from the backend
      const response = await authAPI.login({
        email: user?.email || "",
        password: "", // We'll use the token for authentication
      });
      
      const data: AuthResponse = response.data;
      
      // Update stored user data
      localStorage.setItem("user_data", JSON.stringify(data.user));
      setUser(data.user);
      
      console.log("User data refreshed:", data.user);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  const value: AuthContextType = {
    user,
    tenant,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
