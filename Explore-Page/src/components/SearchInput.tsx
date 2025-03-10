import { Plus, Menu, X } from "lucide-react";
import { type ModelInfo, type BusinessInfo } from "./CategoryGrid";

// SearchInput (handles the top search bar with suggestions and sidebar toggle)
export function SearchInput({
  isSidebarOpen,
  toggleSidebar,
  showFilters,
  toggleFilters,
  searchQuery,
  setSearchQuery,
  showSearchResults,
  setShowSearchResults,
  getSearchResults,
  handleItemSelect,
}: {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  showFilters: boolean;
  toggleFilters: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
  getSearchResults: () => (ModelInfo | BusinessInfo)[];
  handleItemSelect: (item: ModelInfo | BusinessInfo) => void;
}) {
  return (
    <div className="flex items-center">
      <button className="md:hidden mr-4 cursor-pointer" onClick={toggleSidebar}>
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
  );
}
