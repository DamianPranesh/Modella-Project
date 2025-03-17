import { useState, useEffect } from "react";
import {
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { UserTypeSelection } from "./components-models/UserTypeSelection";
import { ExplorePage } from "./components/ExplorePage";

// Business components
import { AccountPage } from "./components/AccountPage";
import SwipeCards from "./components/SwipeCards";
import { SavedList } from "./components/SavedList";
import { LoginPage } from "./components/LoginPage";

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
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      try {
        /*
        const response = await fetch('http://localhost:8000/api/user-role-cookie', {
          method: 'GET',
          credentials: 'include'  // Sends cookies automatically
        });*/

        const storedRole = sessionStorage.getItem('userRole');
        console.log('Stored role:', storedRole);
        if (storedRole) {
          console.log('Using stored role:', storedRole);
          setUserType(storedRole as "model" | "business");
          setLoading(false);
          return;
        }

        const accessToken = getCookie('access_token'); // Replace with your method to get the token

        if (!accessToken) {
          console.error('Access token not found');
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

        // const data = await response.json();
        // console.log('Data:', data);
        // console.log('User Role:', data.role);
        
        if (!response.ok) {
          console.error('Failed to fetch user role. Status:', response.status);
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
      }
    }

    fetchUserRole();
  }, []);

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log('Parts:', parts);
    console.log('Value:', value);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }


// Check if user has selected a type
  // if (userType === null) {
  //   return <UserTypeSelection setUserType={setUserType} />;
  // }

  return (
    
      <div className="flex min-h-screen bg-white">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          userType={"model"}
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
            <Route 
              path="/auth/callback" 
              element={
                <TokenExchange 
                />
              } 
            />
            
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
                  element={
                    <SettingsPage
                      toggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    />
                  }
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
                <Route
                  path="/login"
                  element={
                    <LoginPage
                      
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
                  element={
                    <ModelSettingsPage
                      toggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    />
                  }
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
    
  );
}

export default App;