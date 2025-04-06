import { useState } from "react";
import { Building2 } from "lucide-react";
import { fetchData } from "../api/api";
import { useUser } from "../components-login/UserContext";

interface BusinessSettings {
  businessName: string;
  bio: string;
  description: string;
  notifications: boolean;
  darkMode: boolean;
  language: string;
  privacy: string;
}

interface BusinessSettingsSectionProps {
  businessSettingsData: BusinessSettings;
  primaryLight: string;
  primaryDark: string;
  primaryColor: string;
  getIconForField: (field: string) => string;
}

export const BusinessSettingsSection = ({
  businessSettingsData,
  primaryLight,
  primaryDark,
  primaryColor,
  getIconForField,
}: BusinessSettingsSectionProps) => {
  const [formData, setFormData] =
    useState<BusinessSettings>(businessSettingsData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // const user_Id = "brand_67c5b2c43ae5b4ccb85b9a11";
  const { userId } = useUser();
  const user_Id = userId || "";

  const handleChange = (field: keyof BusinessSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateUserBusinessSettings = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        name: formData.businessName,
        bio: formData.bio,
        description: formData.description,
      };

      await fetchData(`users/${user_Id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setSuccess(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg || "Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...businessSettingsData });
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white to-orange-50">
      <h2
        className="text-2xl font-bold mb-6 flex items-center"
        style={{ color: primaryDark }}
      >
        <Building2 className="mr-2" size={24} /> Business Profile
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: primaryDark }}
        >
          Business Information
        </h3>

        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: primaryColor }}
            >
              <span className="mr-2">{getIconForField("businessName")}</span>{" "}
              Business Name
            </label>
            <input
              type="text"
              className="border rounded-lg p-3 w-full focus:ring-2 focus:outline-none transition-all"
              style={{
                borderColor: primaryLight,
                backgroundColor: "#FFF9F5",
                outlineColor: primaryColor,
              }}
              value={formData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              placeholder="Your business name"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: primaryColor }}
            >
              <span className="mr-2">{getIconForField("description")}</span>{" "}
              Tagline
            </label>
            <input
              type="text"
              className="border rounded-lg p-3 w-full focus:ring-2 focus:outline-none transition-all"
              style={{
                borderColor: primaryLight,
                backgroundColor: "#FFF9F5",
                outlineColor: primaryColor,
              }}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Short business tagline (up to 150 characters)"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: primaryColor }}
            >
              <span className="mr-2">{getIconForField("bio")}</span> Business
              Description
            </label>
            <textarea
              className="border rounded-lg p-3 w-full focus:ring-2 focus:outline-none transition-all"
              style={{
                borderColor: primaryLight,
                backgroundColor: "#FFF9F5",
                outlineColor: primaryColor,
              }}
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell more about your business, services, and unique value proposition"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg mr-3 font-medium hover:bg-gray-300 transition-colors"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            onClick={updateUserBusinessSettings}
            disabled={loading}
            className="px-6 py-3 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
            style={{
              background: `linear-gradient(to right, ${primaryColor}, ${primaryDark})`,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {success && (
          <p className="mt-2 text-green-600">Settings updated successfully!</p>
        )}
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </div>
    </div>
  );
};
