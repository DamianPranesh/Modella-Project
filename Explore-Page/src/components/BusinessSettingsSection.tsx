import { Building2 } from "lucide-react";

export const BusinessSettingsSection = ({
  businessSettingsData,
  primaryLight,
  primaryDark,
  primaryColor,
  getIconForField,
  handleBusinessSettingChange,
}: {
  businessSettingsData: any;
  primaryLight: string;
  primaryDark: string;
  primaryColor: string;
  getIconForField: (field: string) => string;
  handleBusinessSettingChange: (field: string, value: any) => void;
}) => (
  <div className="p-6 bg-gradient-to-br from-white to-orange-50">
    <h2
      className="text-2xl font-bold mb-6 flex items-center"
      style={{ color: primaryDark }}
    >
      <Building2 className="mr-2" size={24} /> Business Profile
    </h2>

    {/* Business Information */}
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: primaryDark }}>
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
            value={businessSettingsData.businessName}
            onChange={(e) =>
              handleBusinessSettingChange("businessName", e.target.value)
            }
            placeholder="Your business name"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: primaryColor }}
          >
            <span className="mr-2">{getIconForField("bio")}</span> Tagline
          </label>
          <input
            type="text"
            className="border rounded-lg p-3 w-full focus:ring-2 focus:outline-none transition-all"
            style={{
              borderColor: primaryLight,
              backgroundColor: "#FFF9F5",
              outlineColor: primaryColor,
            }}
            value={businessSettingsData.bio}
            onChange={(e) => handleBusinessSettingChange("bio", e.target.value)}
            placeholder="Short business tagline (up to 150 characters)"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: primaryColor }}
          >
            <span className="mr-2">{getIconForField("description")}</span>{" "}
            Business Description
          </label>
          <textarea
            className="border rounded-lg p-3 w-full focus:ring-2 focus:outline-none transition-all"
            style={{
              borderColor: primaryLight,
              backgroundColor: "#FFF9F5",
              outlineColor: primaryColor,
            }}
            value={businessSettingsData.description}
            onChange={(e) =>
              handleBusinessSettingChange("description", e.target.value)
            }
            placeholder="Tell more about your business, services, and unique value proposition"
            rows={4}
          />
        </div>
      </div>
    </div>
  </div>
);
