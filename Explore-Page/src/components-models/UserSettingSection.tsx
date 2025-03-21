import { User, Bell, Moon, Globe, Lock } from "lucide-react";
import { fetchData } from "../api/api";
import { useState } from "react";
import { UserSettingsData } from "./SettingsPage";

interface UserSettingsSectionProps {
  userSettingsData: UserSettingsData;
  primaryLight: string;
  primaryDark: string;
  primaryColor: string;
  getIconForField: (field: string) => string;
}

export const UserSettingsSection = ({
  userSettingsData,
  primaryLight,
  primaryDark,
  primaryColor,
  getIconForField,
}: UserSettingsSectionProps) => {
  const [formData, setFormData] = useState<UserSettingsData>(userSettingsData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const user_Id = "model_67c5af423ae5b4ccb85b9a02";

  const handleChange = (
    field: keyof UserSettingsData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateUserSettings = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        name: formData.name,
        bio: formData.bio,
        description: formData.description,
      };

      await fetchData(`users/${user_Id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update settings.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...userSettingsData });
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white to-orange-50">
      <h2
        className="text-2xl font-bold mb-6 flex items-center"
        style={{ color: primaryDark }}
      >
        <User className="mr-2" size={24} /> Account Settings
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: primaryDark }}
        >
          Profile Information
        </h3>
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: primaryColor }}
            >
              <span className="mr-2">{getIconForField("name")}</span> Name
            </label>
            <input
              type="text"
              className="border rounded-lg p-3 w-full focus:ring-2 focus:outline-none transition-all"
              style={{
                borderColor: primaryLight,
                backgroundColor: "#FFF9F5",
                outlineColor: primaryColor,
              }}
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your name"
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
              placeholder="Short bio (up to 150 characters)"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: primaryColor }}
            >
              <span className="mr-2">{getIconForField("bio")}</span> Description
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
              placeholder="Tell more about yourself"
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="flex items-center p-4 rounded-xl hover:shadow-md transition-all"
            style={{ backgroundColor: "#FFF9F5" }}
          >
            <div
              className="p-3 rounded-full mr-4"
              style={{ backgroundColor: primaryLight }}
            >
              <Bell size={24} style={{ color: primaryColor }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold" style={{ color: primaryDark }}>
                Notifications
              </h3>
              <p className="text-sm" style={{ color: primaryColor }}>
                Get alerts about activity
              </p>
            </div>
            <div className="relative inline-block w-14 h-8">
              <input
                type="checkbox"
                className="opacity-0 w-0 h-0"
                checked={formData.notifications}
                onChange={() =>
                  handleChange("notifications", !formData.notifications)
                }
              />
              <span
                className={`absolute inset-0 rounded-full transition-all ${
                  formData.notifications ? "bg-opacity-100" : "bg-gray-300"
                }`}
                style={{
                  backgroundColor: formData.notifications ? primaryColor : "",
                }}
              />
              <span
                className={`absolute w-6 h-6 bg-white rounded-full shadow-md top-1 transition-all transform ${
                  formData.notifications ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </div>
          </div>

          <div
            className="flex items-center p-4 rounded-xl hover:shadow-md transition-all"
            style={{ backgroundColor: "#FFF9F5" }}
          >
            <div
              className="p-3 rounded-full mr-4"
              style={{ backgroundColor: primaryLight }}
            >
              <Moon size={24} style={{ color: primaryColor }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold" style={{ color: primaryDark }}>
                Dark Mode
              </h3>
              <p className="text-sm" style={{ color: primaryColor }}>
                Toggle dark theme
              </p>
            </div>
            <div className="relative inline-block w-14 h-8">
              <input
                type="checkbox"
                className="opacity-0 w-0 h-0"
                checked={formData.darkMode}
                onChange={() => handleChange("darkMode", !formData.darkMode)}
              />
              <span
                className={`absolute inset-0 rounded-full transition-all ${
                  formData.darkMode ? "bg-opacity-100" : "bg-gray-300"
                }`}
                style={{
                  backgroundColor: formData.darkMode ? primaryColor : "",
                }}
              />
              <span
                className={`absolute w-6 h-6 bg-white rounded-full shadow-md top-1 transition-all transform ${
                  formData.darkMode ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </div>
          </div>

          <div
            className="flex items-center p-4 rounded-xl hover:shadow-md transition-all"
            style={{ backgroundColor: "#FFF9F5" }}
          >
            <div
              className="p-3 rounded-full mr-4"
              style={{ backgroundColor: primaryLight }}
            >
              <Globe size={24} style={{ color: primaryColor }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold" style={{ color: primaryDark }}>
                Language
              </h3>
              <p className="text-sm" style={{ color: primaryColor }}>
                Set your preferred language
              </p>
            </div>
            <select
              className="border rounded-lg p-2 bg-white focus:ring-2 focus:outline-none shadow-sm"
              style={{ borderColor: primaryLight }}
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>

          <div
            className="flex items-center p-4 rounded-xl hover:shadow-md transition-all"
            style={{ backgroundColor: "#FFF9F5" }}
          >
            <div
              className="p-3 rounded-full mr-4"
              style={{ backgroundColor: primaryLight }}
            >
              <Lock size={24} style={{ color: primaryColor }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold" style={{ color: primaryDark }}>
                Privacy
              </h3>
              <p className="text-sm" style={{ color: primaryColor }}>
                Manage profile visibility
              </p>
            </div>
            <select
              className="border rounded-lg p-2 bg-white focus:ring-2 focus:outline-none shadow-sm"
              style={{ borderColor: primaryLight }}
              value={formData.privacy}
              onChange={(e) => handleChange("privacy", e.target.value)}
            >
              <option>Public</option>
              <option>Private</option>
              <option>Friends Only</option>
            </select>
          </div>
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
          onClick={updateUserSettings}
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
  );
};
