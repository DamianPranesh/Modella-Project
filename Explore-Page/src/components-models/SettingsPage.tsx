import React, { useEffect, useState } from "react";
import { Settings, User, Tags, ChevronRight, Menu } from "lucide-react";

import { TagsSection } from "./TagSection";
import { PreferencesSection } from "./PreferenceSection";
import { UserSettingsSection } from "./UserSettingSection";
import { getDropdownOptions } from "../api/dropdowns";

export type PreferencesDataType = {
  age: number[];
  height: number[];
  natural_eye_color: string[];
  body_Type: string[];
  work_Field: string[];
  skin_Tone: string[];
  ethnicity: string[];
  natural_hair_type: string[];
  experience_Level: string[];
  gender: string[];
  location: string[];
  shoe_Size: number[];
  bust_chest: number[];
  waist: number[];
  hips: number[];
};

export type tagsDataType = {
  age: number;
  height: number;
  natural_eye_color: string;
  body_Type: string;
  work_Field: string[];
  skin_Tone: string;
  ethnicity: string;
  natural_hair_type: string;
  experience_Level: string;
  gender: string;
  location: string;
  shoe_Size: number;
  bust_chest: number;
  waist: number;
  hips: number;
};

interface SettingsPageProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  toggleSidebar,
  isSidebarOpen,
}) => {
  const [activeTab, setActiveTab] = useState("tags");

  const [dropdownOptions, setDropdownOptions] = useState<{
    [key: string]: string[];
  }>({});

  const fieldToCategoryMap: { [key: string]: string } = {
    natural_eye_color: "natural_eye_colors",
    body_Type: "body_types",
    work_Field: "work_fields",
    skin_Tone: "skin_tones",
    ethnicity: "ethnicities",
    natural_hair_type: "natural_hair_types",
    gender: "genders",
    location: "locations",
    experience_Level: "experience_levels",
  };

  useEffect(() => {
    const fetchAllDropdownOptions = async () => {
      const fetchedOptions: { [key: string]: string[] } = {};

      for (const [frontendField, backendCategory] of Object.entries(
        fieldToCategoryMap
      )) {
        fetchedOptions[frontendField] = await getDropdownOptions(
          backendCategory
        );
      }

      setDropdownOptions(fetchedOptions);
    };

    fetchAllDropdownOptions();
  }, []);

  // Sample initial data states
  const [tagsData, setTagsData] = useState({
    age: 8,
    height: 116,
    natural_eye_color: "",
    body_Type: "",
    work_Field: [] as string[],
    skin_Tone: "",
    ethnicity: "",
    natural_hair_type: "",
    experience_Level: "",
    gender: "",
    location: "",
    shoe_Size: 31,
    bust_chest: 61,
    waist: 51,
    hips: 61,
  });

  const [preferencesData, setPreferencesData] = useState<PreferencesDataType>({
    age: [8, 100],
    height: [116, 191],
    natural_eye_color: [],
    body_Type: [],
    work_Field: [],
    skin_Tone: [],
    ethnicity: [],
    natural_hair_type: [],
    experience_Level: [],
    gender: [],
    location: [],
    shoe_Size: [31, 50],
    bust_chest: [61, 117],
    waist: [51, 91],
    hips: [61, 107],
  });

  const [userSettingsData, setUserSettingsData] = useState({
    name: "",
    bio: "",
    description: "",
    notifications: true,
    darkMode: false,
    language: "English",
    privacy: "Public",
  });

  // State for dropdowns
  const [dropdownField, setDropdownField] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Primary colors
  const primaryColor = "#DD8560";
  const primaryLight = "#F5E1D6";
  const primaryDark = "#B66C4E";

  // Utility functions
  const getIconForField = (field: string) => {
    const icons: { [key: string]: string } = {
      age: "👤",
      height: "📏",
      natural_eye_color: "👁️",
      body_Type: "👗",
      work_Field: "💼",
      skin_Tone: "🧑",
      ethnicity: "🌏",
      natural_hair_type: "💇",
      experience_Level: "🎯",
      gender: "⚧️",
      location: "📍",
      shoe_Size: "👟",
      bust_chest: "📐",
      waist: "📐",
      hips: "📐",
      name: "📝",
      bio: "📋",
      description: "📄",
    };
    return icons[field] || "❓";
  };

  const getOptionsForField = (field: string) => {
    // Remove the mapping step since field names now directly match dropdown option keys
    return dropdownOptions[field] || [];
  };

  const hasDropdownOptions = (field: string) => {
    return [
      "natural_eye_color",
      "body_Type",
      "work_Field",
      "skin_Tone",
      "ethnicity",
      "natural_hair_type",
      "experience_Level",
      "gender",
      "location",
    ].includes(field);
  };

  const numericRanges: Record<string, [number, number]> = {
    age: [8, 100],
    height: [116, 191],
    shoe_Size: [31, 50],
    bust_chest: [61, 117],
    waist: [51, 91],
    hips: [61, 107],
  };

  const handleNumberChange = (
    field: string,
    value: string,
    isPreference = false,
    index: number | null = null
  ) => {
    if (!(field in numericRanges)) return; // Ensure it's a valid numeric field

    const [defaultMin, defaultMax] = numericRanges[field]; // Get predefined range
    let numValue = parseInt(value) || 0;
    numValue = Math.min(defaultMax, Math.max(defaultMin, numValue)); // Clamp within range

    if (isPreference) {
      setPreferencesData((prev) => {
        const newData = { ...prev };
        const key = field as keyof PreferencesDataType;

        if (index !== null && Array.isArray(newData[key])) {
          const currentValues = [...(newData[key] as number[])];

          if (index === 0) {
            // Ensure Min doesn't exceed Max
            numValue = Math.min(numValue, currentValues[1]);
          } else if (index === 1) {
            // Ensure Max isn't smaller than Min
            numValue = Math.max(numValue, currentValues[0]);
          }

          currentValues[index] = numValue;
          newData[key] = currentValues as any;
        }

        return newData;
      });
    } else {
      setTagsData((prev) => ({
        ...prev,
        [field]: numValue,
      }));
    }
  };

  const handleInputChange = (
    field: string,
    value: string,
    isPreference = false
  ) => {
    if (isPreference) {
      setPreferencesData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setTagsData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const selectPreferenceOption = (field: string, option: string) => {
    setPreferencesData((prev) => {
      const newData = { ...prev };
      const key = field as keyof PreferencesDataType;

      // For all fields in preferences that are arrays, add to the array if not already present
      if (Array.isArray(newData[key])) {
        const arr = newData[key] as unknown as string[];
        if (!arr.includes(option)) {
          newData[key] = [...arr, option] as any;
        }
      }
      return newData;
    });
    setIsDropdownOpen(false);
  };

  const removePreferenceOption = (field: string, index: number) => {
    setPreferencesData((prev) => {
      const newData = { ...prev };
      const key = field as keyof PreferencesDataType;
      if (Array.isArray(newData[key])) {
        newData[key] = (newData[key] as unknown as string[]).filter(
          (_, i) => i !== index
        ) as any;
      }
      return newData;
    });
  };

  const resetPreferencesData = () => {
    setPreferencesData({
      age: [8, 100],
      height: [116, 191],
      natural_eye_color: [],
      body_Type: [],
      work_Field: [],
      skin_Tone: [],
      ethnicity: [],
      natural_hair_type: [],
      experience_Level: [],
      gender: [],
      location: [],
      shoe_Size: [31, 50],
      bust_chest: [61, 117],
      waist: [51, 91],
      hips: [61, 107],
    });
    console.log("preferences data has been reset:", preferencesData);
  };

  useEffect(() => {
    console.log("Updated PreferencesData:", preferencesData);
  }, [preferencesData]);

  const handleUserSettingChange = (field: string, value: any) => {
    setUserSettingsData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleDropdown = (field: string) => {
    setDropdownField(field);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectTagOption = (field: string, option: string) => {
    if (field === "work_Field") {
      setTagsData((prev) => ({
        ...prev,
        [field]: [...prev[field], option],
      }));
    } else {
      setTagsData((prev) => ({
        ...prev,
        [field]: option,
      }));
    }
    setIsDropdownOpen(false);
  };

  const removeTag = (index: number) => {
    setTagsData((prev) => ({
      ...prev,
      work_Field: prev.work_Field.filter((_, i) => i !== index),
    }));
  };

  const resetTagsData = () => {
    setTagsData({
      age: 8,
      height: 116,
      natural_eye_color: "",
      body_Type: "",
      work_Field: [],
      skin_Tone: "",
      ethnicity: "",
      natural_hair_type: "",
      experience_Level: "",
      gender: "",
      location: "",
      shoe_Size: 31,
      bust_chest: 61,
      waist: 51,
      hips: 61,
    });
    console.log("Tags data has been reset:", tagsData);
  };

  useEffect(() => {
    console.log("Updated tagsData:", tagsData);
  }, [tagsData]);

  const renderDropdown = (field: string, isPreference = false) => {
    const options = getOptionsForField(field);
    return (
      <div
        className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border"
        style={{
          borderColor: primaryLight,
          maxHeight: "200px",
          overflowY: "auto",
        }}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className="p-2 hover:bg-orange-50 cursor-pointer"
            onClick={() =>
              isPreference
                ? selectPreferenceOption(field, option)
                : selectTagOption(field, option)
            }
          >
            {option}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div
        className="flex items-center p-4 text-white"
        style={{
          background: `linear-gradient(to right, ${primaryColor}, ${primaryDark})`,
        }}
      >
        {/* Sidebar toggle button */}
        <button
          className="md:hidden cursor-pointer"
          onClick={toggleSidebar}
          style={{ marginRight: "auto" }}
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>

      <div className="flex border-b bg-gray-50">
        <button
          className={`px-6 py-4 font-medium focus:outline-none transition-all flex items-center ${
            activeTab === "tags"
              ? "border-b-2 bg-white shadow-sm rounded-t-lg"
              : "text-gray-600 hover:text-orange-500"
          }`}
          style={{
            color: activeTab === "tags" ? primaryColor : "",
            borderColor: activeTab === "tags" ? primaryColor : "",
          }}
          onClick={() => setActiveTab("tags")}
        >
          <Tags size={18} className="mr-2" />
          Tags
        </button>
        <button
          className={`px-6 py-4 font-medium focus:outline-none transition-all flex items-center ${
            activeTab === "preferences"
              ? "border-b-2 bg-white shadow-sm rounded-t-lg"
              : "text-gray-600 hover:text-orange-500"
          }`}
          style={{
            color: activeTab === "preferences" ? primaryColor : "",
            borderColor: activeTab === "preferences" ? primaryColor : "",
          }}
          onClick={() => setActiveTab("preferences")}
        >
          <Settings size={18} className="mr-2" />
          Preferences
        </button>
        <button
          className={`px-6 py-4 font-medium focus:outline-none transition-all flex items-center ${
            activeTab === "userSettings"
              ? "border-b-2 bg-white shadow-sm rounded-t-lg"
              : "text-gray-600 hover:text-orange-500"
          }`}
          style={{
            color: activeTab === "userSettings" ? primaryColor : "",
            borderColor: activeTab === "userSettings" ? primaryColor : "",
          }}
          onClick={() => setActiveTab("userSettings")}
        >
          <User size={18} className="mr-2" />
          User Settings
        </button>
      </div>

      {activeTab === "tags" && (
        <TagsSection
          tagsData={tagsData}
          primaryLight={primaryLight}
          primaryDark={primaryDark}
          primaryColor={primaryColor}
          getIconForField={getIconForField}
          hasDropdownOptions={hasDropdownOptions}
          isDropdownOpen={isDropdownOpen}
          dropdownField={dropdownField}
          toggleDropdown={toggleDropdown}
          renderDropdown={renderDropdown}
          handleNumberChange={handleNumberChange}
          handleInputChange={handleInputChange}
          removeTag={removeTag}
          resetTagsData={resetTagsData}
        />
      )}
      {activeTab === "preferences" && (
        <PreferencesSection
          preferencesData={preferencesData}
          primaryLight={primaryLight}
          primaryDark={primaryDark}
          primaryColor={primaryColor}
          getIconForField={getIconForField}
          hasDropdownOptions={hasDropdownOptions}
          isDropdownOpen={isDropdownOpen}
          dropdownField={dropdownField}
          toggleDropdown={toggleDropdown}
          renderDropdown={renderDropdown}
          handleNumberChange={handleNumberChange}
          handleInputChange={handleInputChange}
          removePreferenceOption={removePreferenceOption}
          resetPreferencesData={resetPreferencesData}
        />
      )}
      {activeTab === "userSettings" && (
        <UserSettingsSection
          userSettingsData={userSettingsData}
          primaryLight={primaryLight}
          primaryDark={primaryDark}
          primaryColor={primaryColor}
          getIconForField={getIconForField}
          //handleUserSettingChange={handleUserSettingChange}
        />
      )}
    </div>
  );
};

export default SettingsPage;
