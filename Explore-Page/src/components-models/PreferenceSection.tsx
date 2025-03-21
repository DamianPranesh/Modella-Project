import { Settings, X, Plus, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchData } from "../api/api";
import { PreferencesDataType } from "./SettingsPage";

interface PreferencesSectionProps {
  preferencesData: PreferencesDataType;
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
  resetPreferencesData: () => void;
}

export const PreferencesSection = ({
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
  removePreferenceOption,
  resetPreferencesData,
}: PreferencesSectionProps) => {
  const [formData, setFormData] = useState({ ...preferencesData });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const user_Id = "model_67c5af423ae5b4ccb85b9a02";

  const defaultRanges: Record<string, [number, number]> = {
    age: [8, 100],
    height: [116, 191],
    shoe_Size: [31, 50],
    bust_chest: [61, 117],
    waist: [51, 91],
    hips: [61, 107],
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    console.log("Saved Data:", formData);
    try {
      const preferenceData = {
        user_Id: user_Id,
        age: formData.age,
        height: formData.height,
        natural_eye_color: formData.natural_eye_color,
        body_Type: formData.body_Type,
        work_Field: formData.work_Field,
        skin_Tone: formData.skin_Tone,
        ethnicity: formData.ethnicity,
        natural_hair_type: formData.natural_hair_type,
        experience_Level: formData.experience_Level,
        gender: formData.gender,
        location: formData.location,
        shoe_Size: formData.shoe_Size,
        bust_chest: formData.bust_chest,
        waist: formData.waist,
        hips: formData.hips,
      };

      const filteredData = Object.fromEntries(
        Object.entries(preferenceData).filter(
          ([, value]) => !(Array.isArray(value) && value.length === 0)
        )
      );

      const response = await fetchData(
        "ModellaPreference/preferences/upsert/model/",
        {
          method: "PUT",
          body: JSON.stringify(filteredData),
        }
      );
      setSuccess(true);
      console.log("Successfully updated model tags:", response);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update settings.";
      console.error("Failed to update model tags:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData(preferencesData);
  }, [preferencesData]);

  const resetStatus = () => {
    setSuccess(false);
    setError(null);
  };

  const handleReset = () => {
    resetStatus();
    resetPreferencesData();
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white to-orange-50">
      <h2
        className="text-2xl font-bold mb-6 flex items-center"
        style={{ color: primaryDark }}
      >
        <Settings className="mr-2" size={24} /> Your Preferences
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
              className="text-sm font-semibold mb-2 capitalize flex items-center"
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
                  min={defaultRanges[key]?.[0] ?? 0}
                  max={defaultRanges[key]?.[1] ?? 1000}
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
                  min={defaultRanges[key]?.[0] ?? 0}
                  max={defaultRanges[key]?.[1] ?? 1000}
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
            ) : null}
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
