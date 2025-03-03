import { Plus, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  modelData,
  businessData,
  type ModelInfo,
  type BusinessInfo,
} from "./CategoryGrid";

export function SearchBar({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
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

  const applyFilters = () => {
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
      <div className="flex items-center">
        <button
          className="md:hidden mr-4 cursor-pointer"
          onClick={toggleSidebar}
        >
          <Menu
            className={`w-6 h-6 ${
              isSidebarOpen ? "text-white" : "text-[#DD8560]"
            }`}
          />
        </button>
        <div className="relative flex items-center rounded-full bg-[#DD8560] p-2.5 flex-1">
          <div
            className="bg-white rounded-full p-0.5 mr-2 cursor-pointer relative z-10"
            onClick={toggleFilters}
          >
            {!showFilters ? (
              <Plus className="w-5 h-5 text-[#DD8560]" />
            ) : (
              <X className="w-5 h-5 text-[#DD8560]" />
            )}
          </div>
          <div className="flex-1 bg-white rounded-full relative">
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full bg-transparent border-none focus:outline-none px-3 py-1 text-[#DD8560] placeholder-gray-400 rounded-full [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:w-4 [&::-webkit-search-cancel-button]:h-4 [&::-webkit-search-cancel-button]:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20fill%3D%22%23DD8560%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M19%206.41L17.59%205%2012%2010.59%206.41%205%205%206.41%2010.59%2012%205%2017.59%206.41%2019%2012%2013.41%2017.59%2019%2019%2017.59%2013.41%2012z%22%2F%3E%3C%2Fsvg%3E')] [&::-webkit-search-cancel-button]:bg-contain [&::-webkit-search-cancel-button]:cursor-pointer"
            />
            {showSearchResults && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
                {getSearchResults().map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-[#DD8560]">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="absolute left-0 top-14 w-full max-h-96 overflow-y-auto bg-white shadow-xl rounded-lg z-50 border border-gray-100">
          <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-[#DD8560] text-lg">
              {filterType === null
                ? "Select Category"
                : filterType === "model"
                ? "Model Filters"
                : "Business Filters"}
            </h3>
            <button
              onClick={resetFilters}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            {filterType === null ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFilterType("model")}
                  className="bg-[#DD8560] text-white py-3 px-4 rounded-md hover:bg-[#C5754A] transition-colors shadow-sm font-medium cursor-pointer"
                >
                  Model
                </button>
                <button
                  onClick={() => setFilterType("business")}
                  className="bg-[#DD8560] text-white py-3 px-4 rounded-md hover:bg-[#C5754A] transition-colors shadow-sm font-medium cursor-pointer"
                >
                  Business
                </button>
              </div>
            ) : filterType === "model" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height
                    </label>
                    <select
                      value={filters.height}
                      onChange={(e) =>
                        handleFilterChange("height", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#DD8560] focus:border-[#DD8560] cursor-pointer"
                    >
                      <option value="">Select Height</option>
                      {heightOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Eye Color
                    </label>
                    <select
                      value={filters.eyeColor}
                      onChange={(e) =>
                        handleFilterChange("eyeColor", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#DD8560] focus:border-[#DD8560] cursor-pointer"
                    >
                      <option value="">Select Eye Color</option>
                      {eyeColorOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Body Type
                    </label>
                    <select
                      value={filters.bodyType}
                      onChange={(e) =>
                        handleFilterChange("bodyType", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#DD8560] focus:border-[#DD8560] cursor-pointer"
                    >
                      <option value="">Select Body Type</option>
                      {bodyTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Work Field
                    </label>
                    <select
                      value={filters.workField}
                      onChange={(e) =>
                        handleFilterChange("workField", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#DD8560] focus:border-[#DD8560] cursor-pointer"
                    >
                      <option value="">Select Work Field</option>
                      {workFieldOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={filters.gender}
                      onChange={(e) =>
                        handleFilterChange("gender", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#DD8560] focus:border-[#DD8560] cursor-pointer"
                    >
                      <option value="">Select Gender</option>
                      {genderOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skin Tone
                    </label>
                    <select
                      value={filters.skinTone}
                      onChange={(e) =>
                        handleFilterChange("skinTone", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#DD8560] focus:border-[#DD8560] cursor-pointer"
                    >
                      <option value="">Select Skin Tone</option>
                      {skinToneOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <select
                      value={filters.experience}
                      onChange={(e) =>
                        handleFilterChange("experience", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#DD8560] focus:border-[#DD8560] cursor-pointer"
                    >
                      <option value="">Select Experience</option>
                      {experienceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-[#DD8560] text-white rounded-md hover:bg-[#C5754A] transition-colors font-medium shadow-sm cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      value={filters.location}
                      onChange={(e) =>
                        handleFilterChange("location", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#DD8560] focus:border-[#DD8560] cursor-pointer"
                    >
                      <option value="">Select Location</option>
                      {locationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Work Field
                    </label>
                    <select
                      value={filters.workField}
                      onChange={(e) =>
                        handleFilterChange("workField", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#DD8560] focus:border-[#DD8560] cursor-pointer"
                    >
                      <option value="">Select Work Field</option>
                      {workFieldOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-[#DD8560] text-white rounded-md hover:bg-[#C5754A] transition-colors font-medium shadow-sm cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {showResults && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-semibold text-2xl text-[#DD8560]">
                {filterType === "model" ? "Model Results" : "Business Results"}
              </h3>
              <button
                onClick={() => setShowResults(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {filterType === "model" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getFilteredResults().length > 0 ? (
                  getFilteredResults().map((item) => (
                    <div key={item.id} className="relative group">
                      <div className="overflow-hidden rounded-2xl">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-4 space-y-1">
                        <p className="font-medium">NAME: {item.name}</p>
                        <p className="text-sm text-gray-600">
                          TYPE: {item.type}
                        </p>
                        {"location" in item && (
                          <p className="text-sm text-gray-600">
                            LOCATION: {item.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <p className="text-lg">
                      No models found matching your criteria
                    </p>
                    <p className="mt-2">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getFilteredResults().length > 0 ? (
                  getFilteredResults().map((item) => (
                    <div
                      key={item.id}
                      className="relative group cursor-pointer"
                    >
                      <div className="overflow-hidden rounded-2xl">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-4 space-y-1">
                        <p className="font-medium">NAME: {item.name}</p>
                        <p className="text-sm text-gray-600">
                          TYPE: {item.type}
                        </p>
                        {"location" in item && (
                          <p className="text-sm text-gray-600">
                            LOCATION: {item.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <p className="text-lg">
                      No businesses found matching your criteria
                    </p>
                    <p className="mt-2">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
