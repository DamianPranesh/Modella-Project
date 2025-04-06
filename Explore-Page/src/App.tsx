import { useState, useEffect } from "react";
import {
  Route,
  Routes,
  Navigate,
  useLocation
} from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { UserTypeSelection } from "./components-models/UserTypeSelection";
import { ExplorePage } from "./components/ExplorePage";
import ChatsPage from "./components-chats/HomePage";
import { ProtectedRoute } from "./components/ProtectedRoute"; // Import the ProtectedRoute

// Business components
import { AccountPage } from "./components/AccountPage";
import SwipeCards from "./components/SwipeCards";
import { SavedList } from "./components/SavedList";
import SettingsPage from "./components/BusinessSettingsPage";

// Model components
import { AccountPage as ModelAccountPage } from "./components-models/AccountPage";
import ModelSwipeCards from "./components-models/SwipeCards";
import { SavedList as ModelSavedList } from "./components-models/SavedList";
import ModelSettingsPage from "./components-models/SettingsPage";
import TokenExchange from './components-login/TokenExchange';


function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [userType, setUserType] = useState<"model" | "business" | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        // Skip auth check for the callback route
        if (location.pathname === "/auth/callback") {
          setLoading(false);
          return;
        }
        
        const storedRole = sessionStorage.getItem('userRole');
        console.log('Stored role:', storedRole);
        if (storedRole) {
          console.log('Using stored role:', storedRole);
          setUserType(storedRole as "model" | "business");
          setLoading(false);
          return;
        }

        const accessToken = getCookie('access_token'); // Get the access token from the cookie

        if (!accessToken) {
          console.error('Access token not found');
          // Only redirect to login if we're not already in an auth-related route
          if (location.pathname !== "/" && !location.pathname.includes("/auth")) {
            window.location.href = 'http://localhost:8000/login';
          }
          setLoading(false);
          return;
        }
    
        // Make the request to the /user-role endpoint
        const response = await fetch('http://localhost:8000/api/user-role', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.error('Failed to fetch user role. Status:', response.status);
          // Only redirect on authentication errors (401, 403)
          if (response.status === 401 || response.status === 403) {
            window.location.href = 'http://localhost:8000/login';
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        sessionStorage.setItem('userRole', data.role);
        console.log('Data:', data);
        console.log('User Role:', data.role);
        setUserType(data.role);
        setLoading(false);

      } catch (error) {
        console.error('Error occurred while fetching user role:', error);
        setLoading(false);
        // Don't automatically redirect on all errors, let the protected routes handle auth
      }
    }

    fetchUserRole();
    // No timeout needed - we're handling errors properly
  }, [location.pathname]); // Depend on location to recheck when routes change

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  // Special case - on auth callback route, always show TokenExchange
  const isAuthCallbackRoute = location.pathname === "/auth/callback";
  
  // Show loading indicator while determining user state, except on auth callback
  if (loading && !isAuthCallbackRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DD8560] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthCallbackRoute) {
    return <TokenExchange />;
  }

  // Check if user has selected a type
  const type = sessionStorage.getItem('userRole');

  if (type === "null") {
    return (
      <ProtectedRoute>
        <UserTypeSelection setUserType={setUserType} />
      </ProtectedRoute>
    );
  }

  return (
    <div className="flex min-h-screen bg-white" data-theme="modella">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        userType={type as "model" | "business"}
      />
      <main
        className={`flex-1 p-8 transition-margin ${
          isSidebarOpen ? "md:ml-[250px]" : "ml-0"
        }`}
      >
        <Routes>
          {/* Redirect root path to /explore */}
          <Route path="/" element={<Navigate to="/explore" />} />

          {/* Common route */}
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <ExplorePage
                  toggleSidebar={toggleSidebar}
                  isSidebarOpen={isSidebarOpen}
                />
              </ProtectedRoute>
            }
          />
          {/* Add the TokenExchange route for callback after login */}
          <Route 
            path="/auth/callback" 
            element={
              <TokenExchange />
            } 
          />

          {/* Add the Chat Page route */}
          <Route 
            path="/chats" 
            element={
              <ProtectedRoute>
                <ChatsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Conditional routes based on user type */}
          {userType === "business" ? (
            <>
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage
                      toggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/swipe"
                element={
                  <ProtectedRoute>
                    <SwipeCards
                      toggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage
                      toggleSidebar={toggleSidebar}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved"
                element={
                  <ProtectedRoute>
                    <SavedList
                      toggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
            </>
          ) : (
            <>
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <ModelAccountPage
                      toggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/swipe"
                element={
                  <ProtectedRoute>
                    <ModelSwipeCards
                      toggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <ModelSettingsPage
                      toggleSidebar={toggleSidebar}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved"
                element={
                  <ProtectedRoute>
                    <ModelSavedList
                      toggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    />
                  </ProtectedRoute>
                }
              />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;