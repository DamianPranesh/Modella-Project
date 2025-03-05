import { useState, useEffect } from "react";
import {
  modelData,
  businessData,
  type ModelInfo,
  type BusinessInfo,
} from "./CategoryGrid";
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

  const getFilteredResults = () => {
    if (selectedItemId) {
      return (filterType === "model" ? modelData : businessData).filter(
        (item) => item.id === selectedItemId
      );
    }
    if (filterType === "model") {
      return modelData.filter((model) => {
        return (
          (!filters.height || model.height === filters.height) &&
          (!filters.eyeColor || model.eyeColor === filters.eyeColor) &&
          (!filters.bodyType || model.bodyType === filters.bodyType) &&
          (!filters.workField || model.workField === filters.workField) &&
          (!filters.gender || model.gender === filters.gender) &&
          (!filters.skinTone || model.skinTone === filters.skinTone) &&
          (!filters.experience || model.experience === filters.experience)
        );
      });
    } else {
      return businessData.filter((business) => {
        return (
          (!filters.location || business.location === filters.location) &&
          (!filters.workField || business.workField === filters.workField)
        );
      });
    }
  };

  const getSearchResults = () => {
    const query = searchQuery.toLowerCase();
    const allItems = [...modelData, ...businessData];
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
