// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { Sidebar } from "./components/Sidebar";
// import { ExplorePage } from "./components/ExplorePage";
// import { AccountPage } from "./components/AccountPage";
// import SwipeCards from "./components/SwipeCards";
// import { SavedList } from "./components/SavedList";

// function App() {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setSidebarOpen(true);
//       } else {
//         setSidebarOpen(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);

//     // Initial check
//     handleResize();

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return (
//     <Router>
//       <div className="flex min-h-screen bg-white">
//         <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//         <main
//           className={`flex-1 p-8 transition-margin ${
//             isSidebarOpen ? "md:ml-[250px]" : "ml-0"
//           }`}
//         >
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 <ExplorePage
//                   toggleSidebar={toggleSidebar}
//                   isSidebarOpen={isSidebarOpen}
//                 />
//               }
//             />
//             <Route
//               path="/account"
//               element={
//                 <AccountPage
//                   toggleSidebar={toggleSidebar}
//                   isSidebarOpen={isSidebarOpen}
//                 />
//               }
//             />
//             <Route
//               path="/swipe"
//               element={
//                 <SwipeCards
//                   toggleSidebar={toggleSidebar}
//                   isSidebarOpen={isSidebarOpen}
//                 />
//               }
//             />
//             <Route
//               path="/saved"
//               element={
//                 <SavedList
//                   toggleSidebar={toggleSidebar}
//                   isSidebarOpen={isSidebarOpen}
//                 />
//               }
//             />
//             {/* Add more routes as needed */}
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
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

// Model components
import { AccountPage as ModelAccountPage } from "./components-models/AccountPage";
import ModelSwipeCards from "./components-models/SwipeCards";
import { SavedList as ModelSavedList } from "./components-models/SavedList";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [userType, setUserType] = useState<"model" | "business" | null>(null);

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

  // Check if user has selected a type
  if (userType === null) {
    return <UserTypeSelection setUserType={setUserType} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-white">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          userType={userType}
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
                  path="/saved"
                  element={
                    <SavedList
                      toggleSidebar={toggleSidebar}
                      isSidebarOpen={isSidebarOpen}
                    />
                  }
                />
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
    </Router>
  );
}

export default App;
