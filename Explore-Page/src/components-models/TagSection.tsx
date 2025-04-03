import { Tags, ChevronRight, X, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchData } from "../api/api";
import { useUser } from "../components-login/UserContext";
import { TagsDataType } from "./SettingsPage";

interface TagsSectionProps {
  tagsData: TagsDataType;
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
  resetTagsData: () => void;
}

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
  resetTagsData,
}: TagsSectionProps) => {
  const [formData, setFormData] = useState({ ...tagsData });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // const user_Id = "model_67c5af423ae5b4ccb85b9a02";
  const { userId } = useUser();
  const user_Id = userId || "";

  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    console.log("Saved Data:", formData);
    try {
      const tagData = {
        user_Id: user_Id,
        work_Field: formData.work_Field,
        location: formData.location,
        age: formData.age,
        height: formData.height,
        natural_eye_color: formData.natural_eye_color,
        body_Type: formData.body_Type,
        skin_Tone: formData.skin_Tone,
        ethnicity: formData.ethnicity,
        natural_hair_type: formData.natural_hair_type,
        experience_Level: formData.experience_Level,
        gender: formData.gender,
        shoe_Size: formData.shoe_Size,
        bust_chest: formData.bust_chest,
        waist: formData.waist,
        hips: formData.hips,
      };

      const filteredData = Object.fromEntries(
        Object.entries(tagData).filter(
          ([, value]) =>
            !((Array.isArray(value) && value.length === 0) || value === "")
        )
      );

      const response = await fetchData("ModellaTag/tags/upsert/models/", {
        method: "PUT",
        body: JSON.stringify(filteredData),
      });
      setSuccess(true);
      console.log("Successfully updated brand tags:", response);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update settings.";
      console.error("Failed to update brand tags:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData(tagsData);
  }, [tagsData]);

  const resetStatus = () => {
    setSuccess(false);
    setError(null);
  };

  const handleReset = () => {
    resetStatus();
    resetTagsData();
  };

  return (
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
              className="text-sm font-semibold mb-2 capitalize flex items-center"
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
                value={value as unknown as string}
                onChange={(e) => handleInputChange(key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg mr-3 font-medium hover:bg-gray-300 transition-colors flex items-center"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          onClick={handleSaveChanges}
          disabled={loading}
          className="text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, ${primaryDark})`,
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
          <ChevronRight size={18} className="ml-1" />
        </button>
      </div>
      {success && (
        <p className="mt-2 text-green-600">Settings updated successfully!</p>
      )}
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
};
