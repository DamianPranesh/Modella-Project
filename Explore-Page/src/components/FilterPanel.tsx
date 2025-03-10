import { X } from "lucide-react";

export function FilterPanel({
  showFilters,
  filterType,
  resetFilters,
  setFilterType,
  filters,
  handleFilterChange,
  applyFilters,
  heightOptions,
  eyeColorOptions,
  bodyTypeOptions,
  workFieldOptions,
  genderOptions,
  skinToneOptions,
  experienceOptions,
  locationOptions,
}: {
  showFilters: boolean;
  filterType: "model" | "business" | null;
  resetFilters: () => void;
  setFilterType: (type: "model" | "business" | null) => void;
  filters: {
    height: string;
    eyeColor: string;
    bodyType: string;
    workField: string;
    gender: string;
    skinTone: string;
    experience: string;
    location: string;
  };
  handleFilterChange: (filter: string, value: string) => void;
  applyFilters: () => void;
  heightOptions: string[];
  eyeColorOptions: string[];
  bodyTypeOptions: string[];
  workFieldOptions: string[];
  genderOptions: string[];
  skinToneOptions: string[];
  experienceOptions: string[];
  locationOptions: string[];
}) {
  if (!showFilters) return null;
  return (
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
              {/* Render Model Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <select
                  value={filters.height}
                  onChange={(e) => handleFilterChange("height", e.target.value)}
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
                  onChange={(e) => handleFilterChange("gender", e.target.value)}
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
  );
}
