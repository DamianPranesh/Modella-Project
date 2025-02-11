import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { ExplorePage } from "./components/ExplorePage";
import { AccountPage } from "./components/AccountPage";
import SwipeCards from "./components/SwipeCards";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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

  return (
    <Router>
      <div className="flex min-h-screen bg-white">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main
          className={`flex-1 p-8 transition-margin ${
            isSidebarOpen ? "md:ml-[250px]" : "ml-0"
          }`}
        >
          <Routes>
            <Route
              path="/"
              element={
                <ExplorePage
                  toggleSidebar={toggleSidebar}
                  isSidebarOpen={isSidebarOpen}
                />
              }
            />
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
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
