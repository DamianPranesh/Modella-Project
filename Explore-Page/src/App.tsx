import { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { UserTypeSelection } from "./components-models/UserTypeSelection";
import { ExplorePage } from "./components/ExplorePage";

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
import TokenExchange from "./components-login/TokenExchange";
//import { UserProvider } from "./components-login/UserContext";

import { useUser } from "./components-login/UserContext";
import { fetchData } from "./api/api";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [userType, setUserType] = useState<"model" | "business" | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { userId, setUserId } = useUser();

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
        const storedRole = sessionStorage.getItem("userRole");
        console.log("Stored role:", storedRole);
        if (storedRole) {
          console.log("Using stored role:", storedRole);
          setUserType(storedRole as "model" | "business");
          setLoading(false);
          return;
        }

        const accessToken = getCookie("access_token"); // Get the access token from the cookie

        if (!accessToken) {
          console.error("Access token not found");
          return;
        }

        // Make the request to the /user-role endpoint
        const response = await fetch("http://localhost:8000/api/user-details", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch user role. Status:", response.status);
          setLoading(false);
          return;
        }

        const data = await response.json();
        sessionStorage.setItem("userRole", data.role);
        console.log("Data:", data);
        console.log("User Role:", data.role);
        setUserType(data.role);

        // Send user data to the backend
        try {
          const response = await fetchData(`users`, {
            method: "POST",
            body: JSON.stringify({
              google_Id: data.user_id,
              role: data.role === "business" ? "brand" : data.role,
              email: data.email,
            }),
          });

          console.log("User details successfully sent to backend:", response);
          if (response && response.user_Id) {
            setUserId(response.user_Id); // Update the context with new userId
          }
        } catch (err) {
          console.error("Error sending user details:", err);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error occurred while fetching user role:", error);
        setLoading(false);
      }
    }

    fetchUserRole();

    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout reached, redirecting to login");
        setLoading(false);
        window.location.href = "http://localhost:8000/login";
      }
    }, 5000);

    return () => clearTimeout(loadingTimeout);
  }, [loading]);

  // Log the userId after it has been updated
  useEffect(() => {
    console.log("User ID in context (after state update):", userId);
  }, [userId]);

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log("Parts:", parts);
    console.log("Value:", value);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  }

  // Special case - on auth callback route, always show TokenExchange
  const isAuthCallbackRoute = location.pathname === "/auth/callback";

  // Show loading indicator while determining user state, except on auth callback
  if (loading && !isAuthCallbackRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthCallbackRoute) {
    return <TokenExchange />;
  }

  // Check if user has selected a type
  const type = sessionStorage.getItem("userRole");

  if (type === "null") {
    return <UserTypeSelection setUserType={setUserType} />;
  }

  return (
    // <UserProvider>
    <div className="flex min-h-screen bg-white">
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
              <ExplorePage
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
              />
            }
          />
          {/* Add the TokenExchange route for callback after login */}
          <Route path="/auth/callback" element={<TokenExchange />} />

          {/* Conditional routes based on user type */}
          {userType === "business" ? (
            <>
              <Route
                path="/account"
                element={
                  <AccountPage
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                  />
                }
              />
              <Route
                path="/swipe"
                element={
                  <SwipeCards
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                  />
                }
              />
              <Route
                path="/settings"
                element={<SettingsPage toggleSidebar={toggleSidebar} />}
              />
              <Route
                path="/saved"
                element={
                  <SavedList
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                  />
                }
              />

              {/* Add more routes as needed */}
            </>
          ) : (
            <>
              <Route
                path="/account"
                element={
                  <ModelAccountPage
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                  />
                }
              />
              <Route
                path="/swipe"
                element={
                  <ModelSwipeCards
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                  />
                }
              />
              <Route
                path="/settings"
                element={<ModelSettingsPage toggleSidebar={toggleSidebar} />}
              />
              <Route
                path="/saved"
                element={
                  <ModelSavedList
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                  />
                }
              />
            </>
          )}
        </Routes>
      </main>
    </div>
    // </UserProvider>
  );
}

export default App;
