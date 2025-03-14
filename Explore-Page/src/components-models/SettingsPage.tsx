import React, { useState } from "react";
import { Settings, User, Tags, ChevronRight, Menu } from "lucide-react";

import { TagsSection } from "./TagSection";
import { PreferencesSection } from "./PreferenceSection";
import { UserSettingsSection } from "./UserSettingSection";

interface SettingsPageProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  toggleSidebar,
  isSidebarOpen,
}) => {
  const [activeTab, setActiveTab] = useState("tags");

  // Dropdown options data
  const dropdownOptions: { [key: string]: string[] } = {
    eye_colors: [
      "Brown",
      "Blue",
      "Hazel",
      "Green",
      "Gray",
      "Amber",
      "Red",
      "Violet",
      "Heterochromia",
    ],
    body_types: [
      "Straight Size Models",
      "Plus-Size Models",
      "Petite Models",
      "Fitness Models",
      "Glamour Models",
      "Mature Models",
      "Alternative Models",
      "Parts Models",
      "Child Models",
      "Body-Positive Models",
      "Androgynous Models",
      "Fit Models",
    ],
    work_fields: [
      "Fashion/Runway Modeling",
      "Commercial Modeling",
      "Beauty Modeling",
      "Lingerie/Swimsuit Modeling",
      "Fitness Modeling",
      "Plus-Size Modeling",
      "Editorial Modeling",
      "Child Modeling",
      "Parts Modeling",
      "Catalog Modeling",
      "Runway Modeling",
      "Commercial Print Modeling",
      "Virtual Modeling",
      "Lifestyle Modeling",
    ],
    skin_tones: [
      "Fair",
      "Light",
      "Medium",
      "Olive",
      "Tan",
      "Deep Tan",
      "Brown",
      "Dark Brown",
      "Ebony",
    ],
    ethnicities: [
      "Caucasian",
      "African",
      "African-American",
      "Hispanic/Latino",
      "Asian",
      "South Asian (Indian, Pakistani, Bangladeshi)",
      "Middle Eastern",
      "Native American/Indigenous",
      "Pacific Islander",
      "Mixed-Race",
      "Mediterranean",
      "Nordic",
      "East Asian (Chinese, Japanese, Korean)",
      "Southeast Asian (Thai, Filipino, Vietnamese, etc.)",
      "Caribbean",
    ],
    hair_types: [
      "Straight",
      "Wavy",
      "Curly",
      "Coily",
      "Kinky",
      "Textured",
      "Afro",
      "Braided",
      "Buzz Cut",
      "Shaved",
      "Dyed/Colored Hair",
      "Gray/White Hair",
      "Bald",
    ],
    genders: [
      "Female",
      "Male",
      "Non-Binary",
      "Androgynous",
      "Transgender Female",
      "Transgender Male",
      "Genderfluid",
      "Agender",
    ],
    locations: [
      "Mumbai, India",
      "New York City, USA",
      "Shanghai, China",
      "Dubai, UAE",
      "Rome, Italy",
      "Seoul, South Korea",
      "Paris, France",
      "Mexico City, Mexico",
      "London, United Kingdom",
      "Cape Town, South Africa",
    ],
    experience_levels: [
      "Beginner (0-1 years)",
      "Intermediate (1-3 years)",
      "Experienced (3-5 years)",
      "Advanced (5-7 years)",
      "Expert (7+ years)",
    ],
  };

  // Sample initial data states
  const [tagsData, setTagsData] = useState({
    age: 0,
    height: 0,
    natural_eye_color: "",
    body_Type: "",
    work_Field: [] as string[],
    skin_Tone: "",
    ethnicity: "",
    natural_hair_type: "",
    experience_Level: "",
    gender: "",
    location: "",
    shoe_Size: 0,
    bust_chest: 0,
    waist: 0,
    hips: 0,
  });

  type PreferencesDataType = {
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

  const [preferencesData, setPreferencesData] = useState<PreferencesDataType>({
    age: [0, 0],
    height: [0, 0],
    natural_eye_color: [],
    body_Type: [],
    work_Field: [],
    skin_Tone: [],
    ethnicity: [],
    natural_hair_type: [],
    experience_Level: [],
    gender: [],
    location: [],
    shoe_Size: [0, 0],
    bust_chest: [0, 0],
    waist: [0, 0],
    hips: [0, 0],
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
    const fieldMappings: { [key: string]: string } = {
      natural_eye_color: "eye_colors",
      body_Type: "body_types",
      work_Field: "work_fields",
      skin_Tone: "skin_tones",
      ethnicity: "ethnicities",
      natural_hair_type: "hair_types",
      gender: "genders",
      location: "locations",
      experience_Level: "experience_levels",
    };

    const mappedField = fieldMappings[field];
    return mappedField ? dropdownOptions[mappedField] || [] : [];
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

  const handleNumberChange = (
    field: string,
    value: string,
    isPreference = false,
    index: number | null = null
  ) => {
    const numValue = parseInt(value) || 0;
    const safeValue = Math.max(0, numValue);

    if (isPreference) {
      setPreferencesData((prev) => {
        const newData = { ...prev };
        const key = field as keyof PreferencesDataType;
        if (index !== null) {
          (newData[key] as number[])[index] = safeValue;
        }
        return newData;
      });
    } else {
      setTagsData((prev) => ({
        ...prev,
        [field]: safeValue,
      }));
    }
  };

  const handleInputChange = (
    field: string,
    value: string,
    isPreference = false
  ) => {
    if (isPreference) {
      // For preferences, handle separately if needed
    } else {
      setTagsData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addPreferenceOption = (field: string) => {
    setPreferencesData((prev) => {
      const newData = { ...prev };
      const key = field as keyof PreferencesDataType;
      newData[key] = [...(newData[key] as unknown as string[]), ""] as any;
      return newData;
    });
  };

  const removePreferenceOption = (field: string, index: number) => {
    setPreferencesData((prev) => {
      const newData = { ...prev };
      const key = field as keyof PreferencesDataType;
      newData[key] = (newData[key] as unknown as string[]).filter(
        (_, i) => i !== index
      ) as any;
      return newData;
    });
  };

  const updatePreferenceOption = (
    field: string,
    index: number,
    value: string
  ) => {
    setPreferencesData((prev) => {
      const newData = { ...prev };
      const key = field as keyof PreferencesDataType;
      (newData[key] as unknown as string[])[index] = value;
      return newData;
    });
  };

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

  const selectPreferenceOption = (field: string, option: string) => {
    setPreferencesData((prev) => {
      const newData = { ...prev };
      const key = field as keyof PreferencesDataType;
      const arr = newData[key] as unknown as string[];
      if (!arr.includes(option)) {
        newData[key] = [...arr, option] as any;
      }
      return newData;
    });
    setIsDropdownOpen(false);
  };

  const removeTag = (index: number) => {
    setTagsData((prev) => ({
      ...prev,
      work_Field: prev.work_Field.filter((_, i) => i !== index),
    }));
  };

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
        />
      )}
      {activeTab === "userSettings" && (
        <UserSettingsSection
          userSettingsData={userSettingsData}
          primaryLight={primaryLight}
          primaryDark={primaryDark}
          primaryColor={primaryColor}
          getIconForField={getIconForField}
          handleUserSettingChange={handleUserSettingChange}
        />
      )}

      <div className="p-6 border-t flex justify-end bg-gray-50">
        <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg mr-3 font-medium hover:bg-gray-300 transition-colors flex items-center">
          Cancel
        </button>
        <button
          className="text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, ${primaryDark})`,
          }}
        >
          Save Changes
          <ChevronRight size={18} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
