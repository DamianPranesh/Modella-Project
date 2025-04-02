import { useState, useEffect } from "react";
import { useModelsAndBusinesses } from "../api/useModelsAndBusinesses";
import {
  type ModelInfo,
  type BusinessInfo,
} from "../api/useModelsAndBusinesses";
import { SearchInput } from "./SearchInput";
import { FilterPanel } from "./FilterPanel";
import { SearchResultsDisplay } from "./SearchResultsDisplay";
import { useFilterOptions } from "../api/useFilterOptions";

// Main Component: SearchBar (manages state and composes the above components)
export function SearchBar({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  const { models, businesses } = useModelsAndBusinesses();
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

  const filterOptions = useFilterOptions();

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
        heightOptions={[
          "140-150 cm",
          "151-160 cm",
          "161-170 cm",
          "171-180 cm",
          "181-191 cm",
        ]}
        eyeColorOptions={filterOptions.eyeColorOptions}
        bodyTypeOptions={filterOptions.bodyTypeOptions}
        workFieldOptions={filterOptions.workFieldOptions}
        genderOptions={filterOptions.genderOptions}
        skinToneOptions={filterOptions.skinToneOptions}
        experienceOptions={filterOptions.experienceOptions}
        locationOptions={filterOptions.locationOptions}
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
