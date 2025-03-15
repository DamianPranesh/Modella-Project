import { Tags, ChevronRight, X, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchData } from "../api/api";

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
  resetTagsData,
}: {
  tagsData: { work_Field: string[]; location: string };
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
  resetTagsData: () => void;
}) => {
  // Local state for managing tag selections
  const [formData, setFormData] = useState({ ...tagsData });
  const user_Id = "brand_67c5b2c43ae5b4ccb85b9a11";

  // Save Changes: Updates tagsData (can be sent to backend)
  const handleSaveChanges = async () => {
    console.log("Saved Data:", formData);
    console.log("Current work_Field:", formData.work_Field);
    console.log("Current location:", formData.location);
    try {
      const tagData = {
        user_Id: user_Id, // Get user ID dynamically
        work_Field: formData.work_Field, // Extracted Work Fields
        location: formData.location, // Extracted Location
      };

      // Remove fields that are empty arrays or empty strings
      const filteredData = Object.fromEntries(
        Object.entries(tagData).filter(
          ([_, value]) =>
            !((Array.isArray(value) && value.length === 0) || value === "")
        )
      );

      const response = await fetchData("ModellaTag/tags/upsert/brands/", {
        method: "PUT",
        body: JSON.stringify(filteredData),
      });

      console.log("Successfully updated brand tags:", response);
    } catch (error) {
      console.error("Failed to update brand tags:", error);
    }
  };

  useEffect(() => {
    setFormData(tagsData); // Ensure formData is always updated when tagsData changes
  }, [tagsData]);

  return (
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

      {/* Save and Reset Buttons */}
      <div className="flex justify-end mt-6">
        <button
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg mr-3 font-medium hover:bg-gray-300 transition-colors flex items-center"
          onClick={resetTagsData}
        >
          Reset
        </button>
        <button
          className="text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, ${primaryDark})`,
          }}
          onClick={handleSaveChanges}
        >
          Save Changes
          <ChevronRight size={18} className="ml-1" />
        </button>
      </div>
    </div>
  );
};
