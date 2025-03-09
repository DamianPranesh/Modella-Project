// import { Plus, Menu } from "lucide-react";

// export function SearchBar({
//   toggleSidebar,
//   isSidebarOpen,
// }: {
//   toggleSidebar: () => void;
//   isSidebarOpen: boolean;
// }) {
//   return (
//     <div className="relative w-full max-w-2xl mx-auto flex items-center">
//       <button className="md:hidden mr-4 cursor-pointer" onClick={toggleSidebar}>
//         <Menu
//           className={`w-6 h-6 ${
//             isSidebarOpen ? "text-white" : "text-[#DD8560]"
//           }`}
//         />
//       </button>
//       <div className="relative flex items-center rounded-full bg-[#DD8560] p-2.5 flex-1">
//         <div className="bg-white rounded-full p-0.5 mr-2 cursor-pointer">
//           <Plus className="w-5 h-5 text-[#DD8560]" />
//         </div>
//         <div className="flex-1 bg-white rounded-full">
//           <input
//             type="search"
//             placeholder="Search..."
//             className="w-full bg-transparent border-none focus:outline-none px-3 py-1 text-[#DD8560] placeholder-gray-400 rounded-full [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:w-4 [&::-webkit-search-cancel-button]:h-4 [&::-webkit-search-cancel-button]:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20fill%3D%22%23DD8560%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M19%206.41L17.59%205%2012%2010.59%206.41%205%205%206.41%2010.59%2012%205%2017.59%206.41%2019%2012%2013.41%2017.59%2019%2019%2017.59%2013.41%2012z%22%2F%3E%3C%2Fsvg%3E')] [&::-webkit-search-cancel-button]:bg-contain [&::-webkit-search-cancel-button]:cursor-pointer"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useModelsAndBusinesses } from "../api/useModelsAndBusinesses";
import {
  type ModelInfo,
  type BusinessInfo,
} from "../api/useModelsAndBusinesses";
import { SearchInput } from "./SearchInput";
import { FilterPanel } from "./FilterPanel";
import { SearchResultsDisplay } from "./SearchResultsDisplay";

// Main Component: SearchBar (manages state and composes the above components)
export function SearchBar({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  const { models, businesses, loading } = useModelsAndBusinesses();
  // States
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<"model" | "business" | null>(
    null
  );
  const [showResults, setShowResults] = useState(false);
  const [filters, setFilters] = useState({
    // Model filters
    height: "",
    eyeColor: "",
    bodyType: "",
    workField: "",
    gender: "",
    skinTone: "",
    experience: "",
    // Business filters
    location: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Options arrays
  const heightOptions = [
    "140-150 cm",
    "151-160 cm",
    "161-170 cm",
    "171-180 cm",
    "181-190 cm",
    "191+ cm",
  ];
  const eyeColorOptions = [
    "Brown",
    "Blue",
    "Hazel",
    "Green",
    "Gray",
    "Amber",
    "Red",
    "Violet",
    "Heterochromia",
  ];
  const bodyTypeOptions = [
    "Straight Size Models",
    "Plus-Size Models",
    "Petite Models",
    "Fitness Models",
    "Glamour Models",
    "Mature Models",
    "Alternative Models",
    "Parts Models",
    "Child Models",
    "Body-Positive Models",
    "Androgynous Models",
    "Fit Models",
  ];
  const workFieldOptions = [
    "Fashion/Runway Modeling",
    "Commercial Modeling",
    "Beauty Modeling",
    "Lingerie/Swimsuit Modeling",
    "Fitness Modeling",
    "Plus-Size Modeling",
    "Editorial Modeling",
    "Child Modeling",
    "Parts Modeling",
    "Catalog Modeling",
    "Runway Modeling",
    "Commercial Print Modeling",
    "Virtual Modeling",
    "Lifestyle Modeling",
  ];
  const genderOptions = ["Male", "Female"];
  const skinToneOptions = [
    "Fair",
    "Light",
    "Medium",
    "Olive",
    "Tan",
    "Deep Tan",
    "Brown",
    "Dark Brown",
    "Ebony",
  ];
  const experienceOptions = [
    "Beginner (0-1 years)",
    "Intermediate (1-3 years)",
    "Experienced (3-5 years)",
    "Advanced (5-7 years)",
    "Expert (7+ years)",
  ];
  const locationOptions = [
    "Colombo, Sri Lanka",
    "Mumbai, India",
    "New York City, USA",
    "Shanghai, China",
    "Dubai, UAE",
    "Rome, Italy",
    "Seoul, South Korea",
    "Paris, France",
    "Mexico City, Mexico",
    "London, United Kingdom",
    "Cape Town, South Africa",
  ];

  // Functions to handle filters and search
  const handleFilterChange = (filter: string, value: string) => {
    setFilters({
      ...filters,
      [filter]: value,
    });
  };

  const resetFilters = () => {
    setShowFilters(false);
    setFilterType(null);
    setShowResults(false);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    if (showFilters) {
      setFilterType(null);
      setShowResults(false);
    }
  };

  // Fix: Reset selectedItemId when applying filters so that filtering uses current criteria.
  const applyFilters = () => {
    setSelectedItemId(null);
    setShowFilters(false);
    setShowResults(true);
  };

  const isHeightInRange = (height: number, range: string | null) => {
    if (!range) return true;
    const [min, max] = range.split("-").map((val) => parseInt(val.trim()));
    return height >= min && height <= max;
  };

  const getFilteredResults = () => {
    if (selectedItemId) {
      return (filterType === "model" ? models : businesses).filter(
        (item) => item.id === selectedItemId
      );
    }
    if (filterType === "model") {
      return models.filter((model) => {
        return (
          (!filters.height || isHeightInRange(model.height, filters.height)) &&
          (!filters.eyeColor || model.eyeColor === filters.eyeColor) &&
          (!filters.bodyType || model.bodyType === filters.bodyType) &&
          (!filters.workField || model.workField.includes(filters.workField)) &&
          (!filters.gender || model.gender === filters.gender) &&
          (!filters.skinTone || model.skinTone === filters.skinTone) &&
          (!filters.experience || model.experience === filters.experience) &&
          (!filters.location || model.location === filters.location)
        );
      });
    } else {
      return businesses.filter((business) => {
        return (
          (!filters.location || business.location === filters.location) &&
          (!filters.workField || business.workField.includes(filters.workField))
        );
      });
    }
  };

  const getSearchResults = () => {
    const query = searchQuery.toLowerCase();
    const allItems = [...models, ...businesses];
    return allItems.filter((item) => item.name.toLowerCase().startsWith(query));
  };

  const handleItemSelect = (item: ModelInfo | BusinessInfo) => {
    setSearchQuery(item.name);
    setShowSearchResults(false);
    setShowResults(true);
    setFilterType("location" in item ? "business" : "model");
    setSelectedItemId(item.id);
  };

  useEffect(() => {
    if (showResults) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showResults]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <SearchInput
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        showFilters={showFilters}
        toggleFilters={toggleFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSearchResults={showSearchResults}
        setShowSearchResults={setShowSearchResults}
        getSearchResults={getSearchResults}
        handleItemSelect={handleItemSelect}
      />

      <FilterPanel
        showFilters={showFilters}
        filterType={filterType}
        resetFilters={resetFilters}
        setFilterType={setFilterType}
        filters={filters}
        handleFilterChange={handleFilterChange}
        applyFilters={applyFilters}
        heightOptions={heightOptions}
        eyeColorOptions={eyeColorOptions}
        bodyTypeOptions={bodyTypeOptions}
        workFieldOptions={workFieldOptions}
        genderOptions={genderOptions}
        skinToneOptions={skinToneOptions}
        experienceOptions={experienceOptions}
        locationOptions={locationOptions}
      />

      <SearchResultsDisplay
        showResults={showResults}
        setShowResults={setShowResults}
        filterType={filterType}
        getFilteredResults={getFilteredResults}
      />
    </div>
  );
}
