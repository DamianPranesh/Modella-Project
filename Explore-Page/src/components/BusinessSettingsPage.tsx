import React, { useEffect, useState } from "react";
import { Settings, Building2, Tags, ChevronRight, Menu } from "lucide-react";

import { BusinessTagsSection } from "./BusinessTagsSection";
import { BusinessPreferencesSection } from "./BusinessPreferencesSection";
import { BusinessSettingsSection } from "./BusinessSettingsSection";
import { getDropdownOptions } from "../api/dropdowns";

// Updated PreferencesDataType to match modeling requirements
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

const BusinessSettingsPage: React.FC<{
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}> = ({ toggleSidebar, isSidebarOpen }) => {
  const [activeTab, setActiveTab] = useState("tags"); // Change "preferences" to "tags"

  // State to store dropdown options from API
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

  // Function to fetch all dropdown options on page load
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
    work_Field: [] as string[],
    location: "",
  });

  // Updated initial state with modeling-specific fields and location as array
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

  const isNumberArray = (value: unknown): value is number[] => {
    return (
      Array.isArray(value) && value.every((item) => typeof item === "number")
    );
  };

  const handleNumberChange = (
    field: string,
    value: string,
    isPreference = false,
    index: number | null = null
  ) => {
    if (!(field in numericRanges)) return; // Ensure it's a numeric field

    const [defaultMin, defaultMax] = numericRanges[field]; // Get predefined range
    let numValue = parseInt(value) || 0;

    setPreferencesData((prev) => {
      const newData = { ...prev };

      if (
        index !== null &&
        isNumberArray(newData[field as keyof PreferencesDataType])
      ) {
        const currentValues = [
          ...(newData[field as keyof PreferencesDataType] as number[]),
        ];

        if (index === 0) {
          // Ensure Min doesn't exceed Max
          numValue = Math.min(numValue, currentValues[1]);
        } else if (index === 1) {
          // Ensure Max isn't smaller than Min
          numValue = Math.max(numValue, currentValues[0]);
        }

        // Keep within allowed range
        numValue = Math.min(defaultMax, Math.max(defaultMin, numValue));

        currentValues[index] = numValue;
        newData[field as keyof PreferencesDataType] = currentValues as any;
      }

      return newData;
    });
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

  // const handleBusinessSettingChange = (field: string, value: any) => {
  //   setBusinessSettingsData((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };

  const toggleDropdown = (field: string) => {
    setDropdownField(field);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectTagOption = (field: string, option: string) => {
    if (field === "work_Field") {
      setTagsData((prev) => {
        // Prevent duplicates
        if (prev.work_Field.includes(option)) {
          console.log(`"${option}" is already selected in work_Field.`);
          return prev;
        }

        const updatedData = { ...prev, [field]: [...prev[field], option] };
        console.log("Updated work_Field:", updatedData.work_Field);
        return updatedData;
      });
    } else if (field === "location") {
      setTagsData((prev) => {
        const updatedData = { ...prev, [field]: option };
        console.log("Updated location:", updatedData.location);
        return updatedData;
      });
    }
    setIsDropdownOpen(false);
  };

  const removeTag = (index: number) => {
    setTagsData((prev) => {
      const updatedWorkField = prev.work_Field.filter((_, i) => i !== index);
      console.log("Updated work_Field after removal:", updatedWorkField);
      return { ...prev, work_Field: updatedWorkField };
    });
  };

  const resetTagsData = () => {
    setTagsData({
      work_Field: [], // Empty the selected industries
      location: "", // Reset location
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
          resetTagsData={resetTagsData}
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
          resetPreferencesData={resetPreferencesData}
        />
      )}
      {activeTab === "userSettings" && (
        <BusinessSettingsSection
          businessSettingsData={businessSettingsData}
          primaryLight={primaryLight}
          primaryDark={primaryDark}
          primaryColor={primaryColor}
          getIconForField={getIconForField}
          // handleBusinessSettingChange={handleBusinessSettingChange}
        />
      )}
    </div>
  );
};

export default BusinessSettingsPage;
