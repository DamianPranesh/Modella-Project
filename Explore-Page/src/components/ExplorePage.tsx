import React from "react";
import { SearchBar } from "./SearchBar";
import { ImageCarousel } from "./ImageCarousel";
import { CategoryGrid } from "./CategoryGrid";

export function ExplorePage({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  return (
    <div>
      <SearchBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="mt-8">
        <ImageCarousel />
      </div>
      <div className="mt-8">
        <CategoryGrid />
      </div>
    </div>
  );
}
