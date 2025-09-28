import React, { useEffect } from 'react';

/**
 * Simple component to bypass authentication for development
 * This sets a dummy token to prevent 401 errors
 */
const AuthBypass: React.FC = () => {
  useEffect(() => {
    // Set a dummy token to prevent 401 errors in development
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
      if (!localStorage.getItem('access_token')) {
        localStorage.setItem('access_token', 'dev-token-123');
        console.log('🔧 Development mode: Set dummy auth token to prevent 401 errors');
      }
    }
  }, []);

  return null; // This component doesn't render anything
};

export default AuthBypass;
