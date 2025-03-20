import React, { useEffect, useState } from "react";
import { Settings, User, Tags, Menu } from "lucide-react";
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

export type TagsDataType = {
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

export type UserSettingsData = {
  name: string;
  bio: string;
  description: string;
  notifications: boolean;
  darkMode: boolean;
  language: string;
  privacy: string;
};

interface SettingsPageProps {
  toggleSidebar: () => void;
  // isSidebarOpen removed because it is not used
}

export type NumericPreferenceField =
  | "age"
  | "height"
  | "shoe_Size"
  | "bust_chest"
  | "waist"
  | "hips";
export type StringPreferenceField =
  | "natural_eye_color"
  | "body_Type"
  | "work_Field"
  | "skin_Tone"
  | "ethnicity"
  | "natural_hair_type"
  | "experience_Level"
  | "gender"
  | "location";

const SettingsPage: React.FC<SettingsPageProps> = ({ toggleSidebar }) => {
  const [activeTab, setActiveTab] = useState("tags");
  const [dropdownOptions, setDropdownOptions] = useState<{
    [key: string]: string[];
  }>({});

  // fieldToCategoryMap is now defined inside useEffect so it does not change on every render.
  useEffect(() => {
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

  // Initial sample states
  const [tagsData, setTagsData] = useState<TagsDataType>({
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

  // Since we never update user settings here, we only pass it down.
  const [userSettingsData] = useState<UserSettingsData>({
    name: "",
    bio: "",
    description: "",
    notifications: true,
    darkMode: false,
    language: "English",
    privacy: "Public",
  });

  // Dropdown state
  const [dropdownField, setDropdownField] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Primary colors
  const primaryColor = "#DD8560";
  const primaryLight = "#F5E1D6";
  const primaryDark = "#B66C4E";

  // Utility: Get icon for a field
  const getIconForField = (field: string): string => {
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

  const getOptionsForField = (field: string): string[] => {
    return dropdownOptions[field] || [];
  };

  const hasDropdownOptions = (field: string): boolean => {
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

  // Update number for numeric fields in either tags or preferences.
  const handleNumberChange = (
    field: string,
    value: string,
    isPreference: boolean = false,
    index: number | null = null
  ) => {
    if (!(field in numericRanges)) return;
    const [defaultMin, defaultMax] = numericRanges[field];
    let numValue = parseInt(value) || 0;
    numValue = Math.min(defaultMax, Math.max(defaultMin, numValue));

    if (
      isPreference &&
      (
        [
          "age",
          "height",
          "shoe_Size",
          "bust_chest",
          "waist",
          "hips",
        ] as string[]
      ).includes(field)
    ) {
      setPreferencesData((prev) => {
        const newData = { ...prev };
        const key = field as NumericPreferenceField;
        if (index !== null) {
          const currentValues = [...(newData[key] as number[])];
          if (index === 0) {
            numValue = Math.min(numValue, currentValues[1]);
          } else if (index === 1) {
            numValue = Math.max(numValue, currentValues[0]);
          }
          currentValues[index] = numValue;
          newData[key] = currentValues;
        }
        return newData;
      });
    } else {
      // For tagsData numeric fields:
      setTagsData((prev) => ({
        ...prev,
        [field]: numValue,
      }));
    }
  };

  const handleInputChange = (
    field: string,
    value: string,
    isPreference: boolean = false
  ) => {
    if (isPreference) {
      // For string dropdown fields in preferences
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

  // For dropdown options in preferences (string arrays only)
  const selectPreferenceOption = (field: string, option: string) => {
    setPreferencesData((prev) => {
      const newData = { ...prev };
      const key = field as StringPreferenceField;
      if (Array.isArray(newData[key])) {
        const arr = newData[key] as string[];
        if (!arr.includes(option)) {
          newData[key] = [...arr, option];
        }
      }
      return newData;
    });
    setIsDropdownOpen(false);
  };

  const removePreferenceOption = (field: string, index: number) => {
    setPreferencesData((prev) => {
      const newData = { ...prev };
      if (
        (
          [
            "natural_eye_color",
            "body_Type",
            "work_Field",
            "skin_Tone",
            "ethnicity",
            "natural_hair_type",
            "experience_Level",
            "gender",
            "location",
          ] as string[]
        ).includes(field)
      ) {
        const key = field as StringPreferenceField;
        newData[key] = (newData[key] as string[]).filter(
          (_item, i) => i !== index
        );
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
    console.log("preferences data has been reset");
  };

  const toggleDropdown = (field: string) => {
    setDropdownField(field);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectTagOption = (field: string, option: string) => {
    if (field === "work_Field") {
      setTagsData((prev) => ({
        ...prev,
        [field]: [...prev.work_Field, option],
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
    console.log("Tags data has been reset");
  };

  const renderDropdown = (field: string, isPreference: boolean = false) => {
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
        />
      )}
    </div>
  );
};

export default SettingsPage;
