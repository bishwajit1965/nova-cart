import { Loader, LockKeyhole, Save } from "lucide-react";
import { useEffect, useState } from "react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import Textarea from "../../common/components/ui/Textarea";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";

const fileFields = ["logo", "favicon"];

const SuperAdminPreferencesSettingsSection = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [preferences, setPreferences] = useState({
    paymentGateways: { stripe: true, bkash: false },
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      gitHub: "",
      linkedIn: "",
    },
    themeColor: "#2563eb",
  });

  const [selectedFiles, setSelectedFiles] = useState({});
  const [filePreviews, setFilePreviews] = useState({
    logo: null,
    favicon: null,
  });

  // Fetch existing system preferences
  const {
    data: systemData,
    isLoadingSystemData,
    isErrorSystemData,
    errorSystemData,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_SYSTEM_SETTINGS.SUP_ADMIN_SYSTEM_SETTINGS_PREFERENCES_ENDPOINT}/get-create`,
    queryKey:
      API_PATHS.SUP_ADMIN_SYSTEM_SETTINGS
        .SUP_ADMIN_SYSTEM_SETTINGS_PREFERENCES_KEY,
  });

  useEffect(() => {
    if (systemData) {
      setPreferences({
        ...preferences,
        ...systemData,
        paymentGateways:
          systemData.paymentGateways || preferences.paymentGateways,
        socialLinks: systemData.socialLinks || preferences.socialLinks,
      });

      setFilePreviews({
        logo: systemData.logo ? `${apiURL}/uploads/${systemData.logo}` : null,
        favicon: systemData.favicon
          ? `${apiURL}/uploads/${systemData.favicon}`
          : null,
      });
    }
  }, [systemData]);

  const handleChange = (e, nestedGroup) => {
    const { name, value, type, checked, files } = e.target;

    if (nestedGroup) {
      setPreferences({
        ...preferences,
        [nestedGroup]: {
          ...preferences[nestedGroup],
          [name]: type === "checkbox" ? checked : value,
        },
      });
    } else if (type === "checkbox") {
      setPreferences({ ...preferences, [name]: checked });
    } else if (type === "file" && files[0]) {
      const file = files[0];
      setSelectedFiles({ ...selectedFiles, [name]: file });
      setFilePreviews({ ...filePreviews, [name]: URL.createObjectURL(file) });
    } else {
      setPreferences({ ...preferences, [name]: value });
    }
  };

  // Mutation for updating preferences
  const mutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.SUP_ADMIN_SYSTEM_SETTINGS.SUP_ADMIN_SYSTEM_SETTINGS_PREFERENCES_ENDPOINT}/${payload.id}/update-preference`,
    key: API_PATHS.SUP_ADMIN_SYSTEM_SETTINGS
      .SUP_ADMIN_SYSTEM_SETTINGS_PREFERENCES_KEY,
    onSuccess: () => {
      setFilePreviews({});
      setSelectedFiles({});
    },
    onError: () => toast.error("Failed to update preferences"),
  });

  const handleSave = () => {
    if (!systemData?._id) return toast.error("System ID missing");

    const formData = new FormData();

    // Normal fields
    Object.entries(preferences).forEach(([key, value]) => {
      if (!fileFields.includes(key) && typeof value !== "object") {
        formData.append(key, value);
      }
    });

    // JSON fields
    formData.append(
      "paymentGateways",
      JSON.stringify(preferences.paymentGateways)
    );
    formData.append("socialLinks", JSON.stringify(preferences.socialLinks));

    // Files
    fileFields.forEach((field) => {
      if (selectedFiles[field]) {
        formData.append(field, selectedFiles[field]);
      }
    });

    mutation.mutate({ id: systemData._id, data: formData });
  };

  const dataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingSystemData,
    isError: isErrorSystemData,
    error: errorSystemData,
    label: "System Preferences",
  });

  if (dataStatus.status !== "success") return dataStatus.content;

  return (
    <div className="bg-base-200 lg:p-6 p-2 rounded-2xl shadow-md lg:max-w-4xl mx-auto">
      <div className="flex items-center mb-4">
        <LockKeyhole className="mr-2" />
        <h2 className="lg:text-2xl text-xl font-bold">System Preferences</h2>
      </div>

      {/* Text inputs */}
      {[
        "appName",
        "tagline",
        "supportEmail",
        "contactNumber",
        "currency",
        "locale",
      ].map((field) => (
        <Input
          key={field}
          name={field}
          value={preferences[field] || ""}
          onChange={handleChange}
          placeholder={field}
          className="mb-2 input"
        />
      ))}

      {/* Social Links */}
      {["facebook", "instagram", "twitter", "gitHub", "linkedIn"].map(
        (social) => (
          <Input
            key={social}
            name={social}
            value={preferences.socialLinks?.[social] || ""}
            onChange={(e) => handleChange(e, "socialLinks")}
            placeholder={social}
            className="mb-2 input"
          />
        )
      )}

      {/* File Inputs */}
      {fileFields.map((field) => (
        <div
          key={field}
          className="mb-2 grid lg:grid-cols-12 grid-cols-12 lg:gap-4 gap-2 justify-between"
        >
          <div className="lg:col-span-11 col-span-12">
            <label className="capitalize font-semibold text-sm text-gray-500">
              {field}
            </label>
            <Input
              type="file"
              name={field}
              onChange={(e) => handleChange(e)}
              className="file-input input-bordered w-full items-center pl-0"
            />
          </div>
          <div className="lg:col-span-1 col-span-12">
            <div className="flex gap-2 justify-between items-start lg:pb-0 pb-0">
              <div className="">
                {/* Show newly selected file preview */}
                {selectedFiles[field] && (
                  <img
                    src={URL.createObjectURL(selectedFiles[field])}
                    alt={`Selected ${field}`}
                    className="w-12 h-10 lg:mt-6 border border-base-content/15 rounded-md shadow object-cover"
                  />
                )}
              </div>
              <div className="">
                {/* Show current uploaded file only if no new file is selected */}
                {!selectedFiles[field] && systemData?.[field] && (
                  <img
                    src={`${apiURL}/uploads/${systemData[field]}`}
                    alt={`Current ${field}`}
                    className="w-12 h-10 lg:mt-6 border border-base-content/15 rounded-md shadow object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Textareas */}
      {["footerText", "metaDescription"].map((field) => (
        <Textarea
          key={field}
          name={field}
          value={preferences[field] || ""}
          onChange={handleChange}
          placeholder={field}
          className="mb-2"
        />
      ))}

      <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-6 gap-2 items-start my-2">
        {/* Payment Gateways */}
        <div className="lg:col-span-4 col-span-12 border border-base-content/15 p-2 shadow rounded-lg">
          <div className="mb-">
            <label className="font-semibold text-sm text-gray-500 mb-1">
              Payment Gateways
            </label>
            <div className="flex items-center space-x-2">
              {["stripe", "bkash"].map((gateway) => (
                <label key={gateway} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={gateway}
                    checked={preferences.paymentGateways?.[gateway] || false}
                    onChange={(e) => handleChange(e, "paymentGateways")}
                  />
                  {gateway.charAt(0).toUpperCase() + gateway.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>
        {/* Maintenance Mode */}
        <div className="lg:col-span-4 col-span-12 border border-base-content/15 p-2 shadow rounded-lg">
          <label htmlFor="">Site Maintenance Mode</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={preferences.maintenanceMode || false}
              onChange={handleChange}
            />
            Enable Maintenance Mode
          </label>
        </div>
        {/* Theme Color Picker */}
        <div className="lg:col-span-4 col-span-12 border border-base-content/15 p-2 shadow rounded-lg">
          <label className="font-semibold text-sm text-gray-500 flex">
            Theme Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              name="themeColor"
              value={preferences.themeColor || "#4f46e5"} // default Indigo
              onChange={handleChange}
              className="w-14 h-7 rounded border border-gray-300 cursor-pointer"
            />
            <span className="text-sm text-gray-600">
              {preferences.themeColor}
            </span>
          </div>
        </div>
      </div>

      <div
        className={mutation.isPending ? "opacity-50 pointer-events-none" : ""}
      >
        <Button
          onClick={handleSave}
          variant="indigo"
          disabled={mutation.isPending}
          className="btn lg:btn-md btn-sm"
        >
          {mutation.isPending ? (
            <Loader className="animate-spin mr-1" />
          ) : (
            <Save className="mr-1" />
          )}
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default SuperAdminPreferencesSettingsSection;
