import { Tags, ChevronRight, X, Plus } from "lucide-react";

/**
 * TagsSection component renders a section for displaying and managing personal tags.
 *
 * @param {Object} props - The properties object.
 * @param {Object.<string, string | number | readonly string[]>} props.tagsData - The data for the tags.
 * @param {string} props.primaryLight - The primary light color for styling.
 * @param {string} props.primaryDark - The primary dark color for styling.
 * @param {string} props.primaryColor - The primary color for styling.
 * @param {Function} props.getIconForField - Function to get the icon for a specific field.
 * @param {Function} props.hasDropdownOptions - Function to check if a field has dropdown options.
 * @param {boolean} props.isDropdownOpen - Boolean indicating if the dropdown is open.
 * @param {string} props.dropdownField - The field currently associated with the open dropdown.
 * @param {Function} props.toggleDropdown - Function to toggle the dropdown for a specific field.
 * @param {Function} props.renderDropdown - Function to render the dropdown for a specific field.
 * @param {Function} props.handleNumberChange - Function to handle changes in number input fields.
 * @param {Function} props.handleInputChange - Function to handle changes in text input fields.
 * @param {Function} props.removeTag - Function to remove a tag by its index.
 *
 * @returns {JSX.Element} The rendered TagsSection component.
 */
export const TagsSection = ({
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
  handleNumberChange,
  handleInputChange,
  removeTag,
}: {
  tagsData: { [key: string]: string | number | readonly string[] };
  primaryLight: string;
  primaryDark: string;
  primaryColor: string;
  getIconForField: (field: string) => string;
  hasDropdownOptions: (field: string) => boolean;
  isDropdownOpen: boolean;
  dropdownField: string;
  toggleDropdown: (field: string) => void;
  renderDropdown: (field: string, isPreference?: boolean) => JSX.Element;
  handleNumberChange: (
    field: string,
    value: string,
    isPreference?: boolean,
    index?: number | null
  ) => void;
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
      <Tags className="mr-2" size={24} /> Personal Tags
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
              {key === "work_Field" ? (
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
                    <Plus size={16} className="mr-1" /> Add option
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
                    <span>{String(value) || "Select an option"}</span>
                    <ChevronRight size={16} className="transform rotate-90" />
                  </div>
                  {isDropdownOpen &&
                    dropdownField === key &&
                    renderDropdown(key)}
                </>
              )}
            </div>
          ) : typeof value === "number" ? (
            <input
              type="number"
              className="border rounded-lg p-3 w-full focus:ring-2 focus:outline-none transition-all"
              style={{
                borderColor: primaryLight,
                backgroundColor: "#FFF9F5",
                outlineColor: primaryColor,
              }}
              value={value}
              min="0"
              onChange={(e) => handleNumberChange(key, e.target.value)}
            />
          ) : (
            <input
              type="text"
              className="border rounded-lg p-3 w-full focus:ring-2 focus:outline-none transition-all"
              style={{
                borderColor: primaryLight,
                backgroundColor: "#FFF9F5",
                outlineColor: primaryColor,
              }}
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);
