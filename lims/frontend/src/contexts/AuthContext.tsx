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

      // Mock authentication for development
      const mockUsers = {
        "superadmin@lims.com": {
          access: "mock_access_token_superadmin",
          refresh: "mock_refresh_token_superadmin",
          user: {
            id: 1,
            email: "superadmin@lims.com",
            role: "superadmin" as UserRole,
            tenant: null,
            isPaid: true,
            created_by: null,
          },
          tenant: null,
        },
        "tenantadmin@lims.com": {
          access: "mock_access_token_tenantadmin",
          refresh: "mock_refresh_token_tenantadmin",
          user: {
            id: 2,
            email: "tenantadmin@lims.com",
            role: "tenant-admin" as UserRole,
            tenant: "Demo Lab",
            isPaid: true,
            created_by: "superadmin@lims.com",
          },
          tenant: { name: "Demo Lab" },
        },
        "doctor@lims.com": {
          access: "mock_access_token_doctor",
          refresh: "mock_refresh_token_doctor",
          user: {
            id: 3,
            email: "doctor@lims.com",
            role: "doctor" as UserRole,
            tenant: "Demo Lab",
            isPaid: true,
            created_by: "tenantadmin@lims.com",
          },
          tenant: { name: "Demo Lab" },
        },
        "technician@lims.com": {
          access: "mock_access_token_technician",
          refresh: "mock_refresh_token_technician",
          user: {
            id: 4,
            email: "technician@lims.com",
            role: "technician" as UserRole,
            tenant: "Demo Lab",
            isPaid: true,
            created_by: "tenantadmin@lims.com",
          },
          tenant: { name: "Demo Lab" },
        },
        "support@lims.com": {
          access: "mock_access_token_support",
          refresh: "mock_refresh_token_support",
          user: {
            id: 5,
            email: "support@lims.com",
            role: "support" as UserRole,
            tenant: "Demo Lab",
            isPaid: true,
            created_by: "tenantadmin@lims.com",
          },
          tenant: { name: "Demo Lab" },
        },
        "patient@lims.com": {
          access: "mock_access_token_patient",
          refresh: "mock_refresh_token_patient",
          user: {
            id: 6,
            email: "patient@lims.com",
            role: "patient" as UserRole,
            tenant: "Demo Lab",
            isPaid: false,
            created_by: "doctor@lims.com",
          },
          tenant: { name: "Demo Lab" },
        },
      };

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

        // Fallback to mock authentication for development
        const mockPassword = "123"; // Simple password for all test accounts
        if (
          credentials.password === mockPassword &&
          mockUsers[credentials.email as keyof typeof mockUsers]
        ) {
          const data = mockUsers[credentials.email as keyof typeof mockUsers];

          // Store tokens and user data
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
          localStorage.setItem("user_data", JSON.stringify(data.user));
          localStorage.setItem("tenant_data", JSON.stringify(data.tenant));

          // Set user state
          setUser(data.user);
          setTenant(data.tenant);

          console.log("Mock login successful:", data.user);
          return;
        }

        // If neither backend nor mock works, throw error
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

  const value: AuthContextType = {
    user,
    tenant,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
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
