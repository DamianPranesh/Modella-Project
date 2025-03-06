import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { ExplorePage } from "./components/ExplorePage";
import { AccountPage } from "./components/AccountPage";
import SwipeModels from "./components/SwipeCards";
import { SavedList } from "./components/SavedList";
import { UserTypeSelection } from "./components-models/UserTypeSelection";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [userType, setUserType] = useState<'model' | 'business' | null>(null);

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
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Make UserTypeSelection the default landing page */}
        <Route path="/" element={<UserTypeSelection setUserType={setUserType} />} />
        
        {/* Wrap all other routes in a layout with sidebar */}
        <Route
          path="/*"
          element={
            <div className="flex min-h-screen bg-white">
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <main
                className={`flex-1 p-8 transition-margin ${
                  isSidebarOpen ? "md:ml-[250px]" : "ml-0"
                }`}
              >
                <Routes>
                  <Route
                    path="explore"
                    element={
                      <ExplorePage
                        toggleSidebar={toggleSidebar}
                        isSidebarOpen={isSidebarOpen}
                      />
                    }
                  />
                  <Route
                    path="account"
                    element={
                      <AccountPage
                        toggleSidebar={toggleSidebar}
                        isSidebarOpen={isSidebarOpen}
                      />
                    }
                  />
                  <Route
                    path="swipe"
                    element={
                      <SwipeModels
                        toggleSidebar={toggleSidebar}
                        isSidebarOpen={isSidebarOpen}
                      />
                    }
                  />
                  <Route
                    path="saved"
                    element={
                      <SavedList
                        toggleSidebar={toggleSidebar}
                        isSidebarOpen={isSidebarOpen}
                      />
                    }
                  />
                  {/* Add registration routes */}
                  <Route path="register/model" element={<div>Model Registration</div>} />
                  <Route path="register/business" element={<div>Business Registration</div>} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
