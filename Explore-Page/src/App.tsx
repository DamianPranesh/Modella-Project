import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { SearchBar } from "./components/SearchBar";
import { ImageCarousel } from "./components/ImageCarousel";
import { CategoryButtons } from "./components/CategoryButtons";

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
    <div className="flex min-h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`flex-1 p-8 transition-margin ${
          isSidebarOpen ? "md:ml-[250px]" : "ml-0"
        }`}
      >
        <SearchBar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="mt-8">
          <ImageCarousel />
        </div>
        <div className="mt-8">
          <CategoryButtons />
        </div>
      </main>
    </div>
  );
}

export default App;
