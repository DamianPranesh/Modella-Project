import { Tags, ChevronRight, X, Plus } from "lucide-react";

// Business Tags Section Component
export const BusinessTagsSection = ({
  tagsData,
  primaryLight,
  primaryDark,
  primaryColor,
  getIconForField,
  hasDropdownOptions,
  isDropdownOpen,
  dropdownField,
  toggleDropdown,
  renderDropdown,
  handleInputChange,
  removeTag,
}: {
  tagsData: { [key: string]: string | string[] };
  primaryLight: string;
  primaryDark: string;
  primaryColor: string;
  getIconForField: (field: string) => string;
  hasDropdownOptions: (field: string) => boolean;
  isDropdownOpen: boolean;
  dropdownField: string;
  toggleDropdown: (field: string) => void;
  renderDropdown: (field: string, isPreference?: boolean) => JSX.Element;
  handleInputChange: (
    field: string,
    value: string,
    isPreference?: boolean
  ) => void;
  removeTag: (index: number) => void;
}) => (
  <div className="p-6 bg-gradient-to-br from-white to-orange-50">
    <h2
      className="text-2xl font-bold mb-6 flex items-center"
      style={{ color: primaryDark }}
    >
      <Tags className="mr-2" size={24} /> Business Categories
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(tagsData).map(([key, value]) => (
        <div
          key={key}
          className="mb-4 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative"
          style={{
            zIndex: isDropdownOpen && dropdownField === key ? 1000 : 1,
          }}
        >
          <label
            className="block text-sm font-semibold mb-2 capitalize flex items-center"
            style={{ color: primaryColor }}
          >
            <span className="mr-2 text-xl">{getIconForField(key)}</span>
            {key.replace(/_/g, " ")}
          </label>

          {hasDropdownOptions(key) ? (
            <div className="relative">
              {key === "work_field" ? (
                <>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Array.isArray(value) &&
                      value.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center bg-orange-50 px-3 py-1 rounded-full"
                          style={{ borderColor: primaryLight }}
                        >
                          <span>{item}</span>
                          <button
                            className="ml-2 text-red-500 hover:text-red-700"
                            onClick={() => removeTag(i)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                  </div>
                  <button
                    className="flex items-center text-sm px-3 py-2 rounded-full hover:opacity-80 transition-colors self-start"
                    style={{
                      backgroundColor: primaryLight,
                      color: primaryDark,
                    }}
                    onClick={() => toggleDropdown(key)}
                  >
                    <Plus size={16} className="mr-1" /> Add industry
                  </button>
                  {isDropdownOpen &&
                    dropdownField === key &&
                    renderDropdown(key)}
                </>
              ) : (
                <>
                  <div
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer"
                    style={{
                      borderColor: primaryLight,
                      backgroundColor: "#FFF9F5",
                    }}
                    onClick={() => toggleDropdown(key)}
                  >
                    <span>{String(value) || "Select location"}</span>
                    <ChevronRight size={16} className="transform rotate-90" />
                  </div>
                  {isDropdownOpen &&
                    dropdownField === key &&
                    renderDropdown(key)}
                </>
              )}
            </div>
          ) : (
            <input
              type="text"
              className="border rounded-lg p-3 w-full focus:ring-2 focus:outline-none transition-all"
              style={{
                borderColor: primaryLight,
                backgroundColor: "#FFF9F5",
                outlineColor: primaryColor,
              }}
              value={value as string}
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);
