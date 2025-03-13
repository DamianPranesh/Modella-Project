import React, { useState } from "react";
import { Settings, Building2, Tags, ChevronRight, Menu } from "lucide-react";

import { BusinessTagsSection } from "./BusinessTagsSection";
import { BusinessPreferencesSection } from "./BusinessPreferencesSection";
import { BusinessSettingsSection } from "./BusinessSettingsSection";

const BusinessSettingsPage: React.FC<{
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}> = ({ toggleSidebar, isSidebarOpen }) => {
  const [activeTab, setActiveTab] = useState("tags"); // Change "preferences" to "tags"

  // Updated dropdown options for modeling industry
  const dropdownOptions: { [key: string]: string[] } = {
    natural_eye_color: [
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
    body_Type: [
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
    work_Field: [
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
    skin_Tone: [
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
    ethnicity: [
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
    natural_hair_type: [
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
    gender: [
      "Female",
      "Male",
      "Non-Binary",
      "Androgynous",
      "Transgender Female",
      "Transgender Male",
      "Genderfluid",
      "Agender",
    ],
    location: [
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
    work_field: [
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
    experience_Level: [
      "Beginner (0-1 years)",
      "Intermediate (1-3 years)",
      "Experienced (3-5 years)",
      "Advanced (5-7 years)",
      "Expert (7+ years)",
    ],
  };

  // Sample initial data states
  const [tagsData, setTagsData] = useState({
    work_field: [] as string[],
    location: "",
  });

  // Updated PreferencesDataType to match modeling requirements
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

  // Updated initial state with modeling-specific fields and location as array
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

  const [businessSettingsData, setBusinessSettingsData] = useState({
    businessName: "",
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

  // Updated utility functions
  const getIconForField = (field: string) => {
    const icons: { [key: string]: string } = {
      age: "🎂",
      height: "📏",
      natural_eye_color: "👁️",
      body_Type: "🧍",
      work_Field: "💼",
      work_field: "💼",
      skin_Tone: "🎨",
      ethnicity: "🌍",
      natural_hair_type: "💇",
      experience_Level: "⭐",
      gender: "⚧️",
      location: "📍",
      shoe_Size: "👞",
      bust_chest: "📐",
      waist: "🧵",
      hips: "🧮",
      businessName: "🏢",
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
      "work_field",
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
        if (index !== null && Array.isArray(newData[key])) {
          (newData[key] as number[])[index] = safeValue;
        }
        return newData;
      });
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

  const handleBusinessSettingChange = (field: string, value: any) => {
    setBusinessSettingsData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleDropdown = (field: string) => {
    setDropdownField(field);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectTagOption = (field: string, option: string) => {
    if (field === "work_field") {
      // For work_field in tags, allow multiple options
      setTagsData((prev) => ({
        ...prev,
        [field]: [...prev[field], option],
      }));
    } else if (field === "location") {
      // For location in tags, only allow one option
      setTagsData((prev) => ({
        ...prev,
        [field]: option,
      }));
    } else {
      // Default behavior for other fields
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

  const removeTag = (index: number) => {
    setTagsData((prev) => ({
      ...prev,
      work_field: prev.work_field.filter((_, i) => i !== index),
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
        <h1 className="text-2xl font-bold">Business Profile Settings</h1>
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
          Business Tags
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
          Business Preferences
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
          <Building2 size={18} className="mr-2" />
          Business Profile
        </button>
      </div>

      {activeTab === "tags" && (
        <BusinessTagsSection
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
          handleInputChange={handleInputChange}
          removeTag={removeTag}
        />
      )}
      {activeTab === "preferences" && (
        <BusinessPreferencesSection
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
        <BusinessSettingsSection
          businessSettingsData={businessSettingsData}
          primaryLight={primaryLight}
          primaryDark={primaryDark}
          primaryColor={primaryColor}
          getIconForField={getIconForField}
          handleBusinessSettingChange={handleBusinessSettingChange}
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

export default BusinessSettingsPage;
