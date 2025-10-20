import SuperAdminPasswordSettingSection from "../components/SuperAdminPasswordSettingSection";
import SuperAdminPlatformSettingsSection from "../components/SuperAdminPlatformSettingsSection";
import SuperAdminPreferencesSettingsSection from "../components/SuperAdminPreferencesSettingsSection";
import SuperAdminProfileSettingsSection from "../components/SuperAdminProfileSettingsSection";
import { useState } from "react";

const SuperAdminSystemSettingsManagementPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile Info" },
    { id: "password", label: "Password" },
    { id: "preferences", label: "Preferences" },
    { id: "platform", label: "Platform Config" },
  ];

  return (
    <div>
      <div className="lg:p-6 p-2 bg-base-100 rounded-2xl shadow">
        <div className="lg:flex grid gap-4 border-b border-base-content/15 mb-6">
          {tabs?.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-4 font-medium transition cursor-pointer ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-600 cursor-pointer"
                  : "text-gray-500 hover:text-gray-700 cursor-pointer"
              }`}
            >
              {tab.label}
            </button>
          ))}{" "}
        </div>

        <div className="mt-4 lg:flex grid">
          {activeTab === "profile" && <SuperAdminProfileSettingsSection />}
          {activeTab === "password" && <SuperAdminPasswordSettingSection />}
          {activeTab === "preferences" && (
            <SuperAdminPreferencesSettingsSection />
          )}
          {activeTab === "platform" && <SuperAdminPlatformSettingsSection />}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSystemSettingsManagementPage;
