import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface TokenVerificationResponse {
  is_valid: boolean;
  user_id?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    isChecking: boolean;
    isAuthenticated: boolean;
  }>({
    isChecking: true,
    isAuthenticated: false,
  });
  
  const location = useLocation();

  // Function to get cookie
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  useEffect(() => {
    // Skip auth check on callback route
    if (location.pathname === "/auth/callback") {
        console.log("Skipping auth check on callback route");
      setAuthState({
        isChecking: false,
        isAuthenticated: true, // Let the callback handle auth
      });
      return;
    }

    // Check if user is authenticated
    const checkAuth = async () => {
      const accessToken = getCookie('access_token');
      
      if (!accessToken) {
        console.error('protected Access token not found');
        setAuthState({
          isChecking: false,
          isAuthenticated: false,
        });
        return;
      }

      // Verify token with the backend
      try {
        const response = await fetch('http://modella-project.up.railway.app/api/verify-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data: TokenVerificationResponse = await response.json();
          setAuthState({
            isChecking: false,
            isAuthenticated: data.is_valid,
          });
        } else {
          // Handle HTTP errors
          setAuthState({
            isChecking: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setAuthState({
          isChecking: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, [location.pathname]);

  // While checking auth status, show loading
  if (authState.isChecking) {
    return (
        <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DD8560] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
        </div>
    );
  }

  // If not authenticated, redirect to login
  if (!authState.isAuthenticated) {
    window.location.href = 'http://modella-project.up.railway.app/login';
    
    // Show a brief message while redirecting
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#DD8560]/20 via-[#DD8560]/5 to-white">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
};