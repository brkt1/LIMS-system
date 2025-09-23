import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showTestCredentials, setShowTestCredentials] = useState(false);

  const testCredentials = [
    {
      role: "Super Admin",
      email: "superadmin@lims.com",
      password: "superadmin123",
    },
    {
      role: "Tenant Admin",
      email: "tenantadmin@lims.com",
      password: "tenantadmin123",
    },
    { role: "Doctor", email: "doctor@lims.com", password: "doctor123" },
    {
      role: "Technician",
      email: "technician@lims.com",
      password: "technician123",
    },
    { role: "Support", email: "support@lims.com", password: "support123" },
    { role: "Patient", email: "patient@lims.com", password: "patient123" },
  ];

  const handleTestLogin = (testEmail: string, testPassword: string) => {
    setFormData({
      email: testEmail,
      password: testPassword,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData);
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">+</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to LIMS
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Laboratory Information Management System
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-400">
                  {error}
                </span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <button
                  type="button"
                  onClick={() => setShowTestCredentials(!showTestCredentials)}
                  className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                >
                  {showTestCredentials ? "Hide" : "Show"} Test Credentials
                </button>
              </div>
            </div>

            {showTestCredentials && (
              <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Test Accounts (Click to auto-fill)
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {testCredentials.map((cred, index) => (
                    <button
                      key={index}
                      onClick={() => handleTestLogin(cred.email, cred.password)}
                      className="text-left p-2 rounded border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {cred.role}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {cred.email}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  💡 Click any account above to auto-fill the login form
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
