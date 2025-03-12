import { Settings, X, Plus } from "lucide-react";

export const BusinessPreferencesSection = ({
  preferencesData,
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
  removePreferenceOption,
}: {
  preferencesData: any;
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
  removePreferenceOption: (field: string, index: number) => void;
}) => (
  <div className="p-6 bg-gradient-to-br from-white to-orange-50">
    <h2
      className="text-2xl font-bold mb-6 flex items-center"
      style={{ color: primaryDark }}
    >
      <Settings className="mr-2" size={24} /> Business Preferences
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(preferencesData).map(([key, value]) => (
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

          {Array.isArray(value) &&
          value.length === 2 &&
          typeof value[0] === "number" ? (
            <div
              className="flex items-center gap-2 p-2 rounded-lg"
              style={{ backgroundColor: "#FFF9F5" }}
            >
              <input
                type="number"
                className="border rounded-lg p-3 w-full focus:ring-2 focus:outline-none transition-all"
                style={{ borderColor: primaryLight }}
                placeholder="Min"
                value={value[0]}
                min="0"
                onChange={(e) =>
                  handleNumberChange(key, e.target.value, true, 0)
                }
              />
              <span style={{ color: primaryColor }} className="font-bold">
                to
              </span>
              <input
                type="number"
                className="border rounded-lg p-3 w-full focus:ring-2 focus:outline-none transition-all"
                style={{ borderColor: primaryLight }}
                placeholder="Max"
                value={value[1]}
                min="0"
                onChange={(e) =>
                  handleNumberChange(key, e.target.value, true, 1)
                }
              />
            </div>
          ) : hasDropdownOptions(key) ? (
            <div className="relative">
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
                        onClick={() => removePreferenceOption(key, i)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
              </div>
              <button
                className="flex items-center text-sm px-3 py-2 rounded-full hover:opacity-80 transition-colors self-start"
                style={{ backgroundColor: primaryLight, color: primaryDark }}
                onClick={() => toggleDropdown(key)}
              >
                <Plus size={16} className="mr-1" /> Add option
              </button>
              {isDropdownOpen &&
                dropdownField === key &&
                renderDropdown(key, true)}
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
              value={value as string | number | readonly string[] | undefined}
              onChange={(e) => handleInputChange(key, e.target.value, true)}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);
