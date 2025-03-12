import { User, Bell, Moon, Globe, Lock } from "lucide-react";

export const UserSettingsSection = ({
  userSettingsData,
  primaryLight,
  primaryDark,
  primaryColor,
  getIconForField,
  handleUserSettingChange,
}: {
  userSettingsData: any;
  primaryLight: string;
  primaryDark: string;
  primaryColor: string;
  getIconForField: (field: string) => string;
  handleUserSettingChange: (field: string, value: any) => void;
}) => (
  <div className="p-6 bg-gradient-to-br from-white to-orange-50">
    <h2
      className="text-2xl font-bold mb-6 flex items-center"
      style={{ color: primaryDark }}
    >
      <User className="mr-2" size={24} /> Account Settings
    </h2>

    {/* Profile Information */}
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: primaryDark }}>
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
            value={userSettingsData.name}
            onChange={(e) => handleUserSettingChange("name", e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: primaryColor }}
          >
            <span className="mr-2">{getIconForField("bio")}</span> Bio
          </label>
          <input
            type="text"
            className="border rounded-lg p-3 w-full focus:ring-2 focus:outline-none transition-all"
            style={{
              borderColor: primaryLight,
              backgroundColor: "#FFF9F5",
              outlineColor: primaryColor,
            }}
            value={userSettingsData.bio}
            onChange={(e) => handleUserSettingChange("bio", e.target.value)}
            placeholder="Short bio (up to 150 characters)"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: primaryColor }}
          >
            <span className="mr-2">{getIconForField("description")}</span>{" "}
            Description
          </label>
          <textarea
            className="border rounded-lg p-3 w-full focus:ring-2 focus:outline-none transition-all"
            style={{
              borderColor: primaryLight,
              backgroundColor: "#FFF9F5",
              outlineColor: primaryColor,
            }}
            value={userSettingsData.description}
            onChange={(e) =>
              handleUserSettingChange("description", e.target.value)
            }
            placeholder="Tell more about yourself"
            rows={4}
          />
        </div>
      </div>
    </div>

    {/* Settings */}
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
              checked={userSettingsData.notifications}
              onChange={() =>
                handleUserSettingChange(
                  "notifications",
                  !userSettingsData.notifications
                )
              }
            />
            <span
              className={`absolute inset-0 rounded-full transition-all ${
                userSettingsData.notifications
                  ? "bg-opacity-100"
                  : "bg-gray-300"
              }`}
              style={{
                backgroundColor: userSettingsData.notifications
                  ? primaryColor
                  : "",
              }}
            />
            <span
              className={`absolute w-6 h-6 bg-white rounded-full shadow-md top-1 transition-all transform ${
                userSettingsData.notifications
                  ? "translate-x-7"
                  : "translate-x-1"
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
              checked={userSettingsData.darkMode}
              onChange={() =>
                handleUserSettingChange("darkMode", !userSettingsData.darkMode)
              }
            />
            <span
              className={`absolute inset-0 rounded-full transition-all ${
                userSettingsData.darkMode ? "bg-opacity-100" : "bg-gray-300"
              }`}
              style={{
                backgroundColor: userSettingsData.darkMode ? primaryColor : "",
              }}
            />
            <span
              className={`absolute w-6 h-6 bg-white rounded-full shadow-md top-1 transition-all transform ${
                userSettingsData.darkMode ? "translate-x-7" : "translate-x-1"
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
            value={userSettingsData.language}
            onChange={(e) =>
              handleUserSettingChange("language", e.target.value)
            }
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
            value={userSettingsData.privacy}
            onChange={(e) => handleUserSettingChange("privacy", e.target.value)}
          >
            <option>Public</option>
            <option>Private</option>
            <option>Friends Only</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);
