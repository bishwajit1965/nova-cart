import {
  Loader,
  LockKeyhole,
  RefreshCcw,
  RotateCcwKey,
  Save,
} from "lucide-react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useAuth } from "../../common/hooks/useAuth";
import { useState } from "react";
import useValidator from "../../common/hooks/useValidator";

const SuperAdminPasswordSettingsSection = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Validation
  const validationRules = {
    currentPassword: {
      required: { message: "Current password is required" },
    },
    newPassword: {
      required: { message: "New password is required" },
    },
  };

  /*** -----> Validator integration -----> */
  const { errors, validate } = useValidator(validationRules, {
    currentPassword,
    newPassword,
  });

  const passwordMutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.SUP_ADMIN_SYSTEM_SETTINGS.SUP_ADMIN_SYSTEM_SETTINGS_PASSWORD_ENDPOINT}/${payload.id}/update-password`,
    key: API_PATHS.SUP_ADMIN_SYSTEM_SETTINGS
      .SUP_ADMIN_SYSTEM_SETTINGS_PASSWORD_KEY,
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Error updating password"),
  });

  const handlePasswordChange = () => {
    if (!validate()) return;

    const payload = { id: user._id, data: { currentPassword, newPassword } };
    passwordMutation.mutate(payload, {
      onSuccess: () => {},
      onError: (error) => {},
    });
  };

  return (
    <div className="bg-base-200 lg:p-12 p-2 rounded-2xl shadow-md mx-auto">
      <div className="lg:pb-4 pb-2 flex items-center">
        <LockKeyhole className="mr-1" />{" "}
        <h2 className="lg:text-2xl font-bold">Update Password</h2>
      </div>
      <div className="flex flex-col gap-4 lg:min-w-xl rounded-2xl border shadow-md hover:shadow-lg border-base-content/15 lg:p-6 p-4 bg-base-100">
        <div className="">
          <Input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={`${
              errors.currentPassword ? "border-red-500 bg-yellow-100" : ""
            }`}
          />
          {errors.currentPassword && (
            <p className="text-red-600 text-xs mt-1">
              {errors.currentPassword}
            </p>
          )}
        </div>
        <div className="">
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`${
              errors.newPassword ? "border-red-500 bg-yellow-100" : ""
            }`}
          />
          {errors.newPassword && (
            <p className="text-red-600 text-xs mt-1">{errors.newPassword}</p>
          )}
        </div>
        <div
          className={`${
            passwordMutation.isPending ? "cursor-not-allowed bg-red-300" : ""
          }`}
        >
          <Button
            onClick={handlePasswordChange}
            variant="indigo"
            disabled={passwordMutation.isPending}
            className="w-full btn"
          >
            {passwordMutation.isPending ? (
              <Loader className="animate-spin" size={25} />
            ) : (
              <RotateCcwKey size={25} />
            )}
            {passwordMutation.isPending ? "Changing..." : "Change Password"}
            {/* <RefreshCcw /> Change Password */}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPasswordSettingsSection;
