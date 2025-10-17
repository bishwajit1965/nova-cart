import {
  Loader,
  LucideUserCheck,
  Save,
  UserCheck,
  UserCheck2Icon,
  UserCircle2Icon,
  UserCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import { useAuth } from "../../common/hooks/useAuth";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";

const SuperAdminProfileSettingsSection = () => {
  const { user } = useAuth();
  const [editId, setEditId] = useState(user._id);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  /*** ------> Features data fetched ------> */
  const {
    data: profileData,
    isLoadingProfile,
    isErrorProfile,
    errorProfile,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_SYSTEM_SETTINGS.SUP_ADMIN_SYSTEM_SETTINGS_PROFILE_ENDPOINT}/get-profile`,
    queryKey:
      API_PATHS.SUP_ADMIN_SYSTEM_SETTINGS.SUP_ADMIN_SYSTEM_SETTINGS_PROFILE_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const profileMutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.SUP_ADMIN_SYSTEM_SETTINGS.SUP_ADMIN_SYSTEM_SETTINGS_PROFILE_ENDPOINT}/${payload.id}/update-profile`,

    key: API_PATHS.SUP_ADMIN_SYSTEM_SETTINGS
      .SUP_ADMIN_SYSTEM_SETTINGS_PROFILE_KEY, // used by useQuery

    onSuccess: () => {},
    onError: (error) => {
      toast.error("Error in saving feature!", error);
      console.error(error);
    },
  });

  useEffect(() => {
    if (profileData) {
      setProfile({
        name: profileData?.name,
        email: profileData?.email,
        avatar: profileData?.avatar,
      });
    } else {
      setProfile({
        name: "",
        email: "",
        avatar: "",
      });
    }
  }, [profileData]);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = () => {
    try {
      const payload = {
        id: user._id,
        data: {
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
        },
      };

      console.log("payload", payload);
      profileMutation.mutate(payload);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating profile");
    }
  };

  /** -------- Use Fetched Data Status Handler -------- */
  const profileDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
    error: errorProfile,
    label: "Profile",
  });
  return (
    <div>
      {profileDataStatus.status !== "success" ? (
        profileDataStatus.content
      ) : (
        <div className="bg-base-200 lg:p-12 p-2 rounded-2xl shadow-md">
          <div className="lg:pb-4 pb-2 flex items-center">
            <LucideUserCheck className="mr-1" />{" "}
            <h2 className="lg:text-2xl font-bold">Update Profile</h2>
          </div>

          <div className="flex flex-col gap-4 lg:min-w-xl rounded-2xl border shadow-md hover:shadow-lg border-base-content/15 lg:p-6 p-4 bg-base-100">
            <Input
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Name"
              className=""
            />
            <Input
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Email"
              className=" "
            />
            <Input
              name="avatar"
              value={profile.avatar}
              onChange={handleChange}
              placeholder="Profile Image URL"
              className=" "
            />
            <div
              className={`${
                profileMutation.isPending ? "cursor-not-allowed bg-red-300" : ""
              }`}
            >
              <Button
                onClick={handleSave}
                variant="indigo"
                disabled={profileMutation.isPending}
                className="btn btn-md w-full"
              >
                {profileMutation.isPending ? (
                  <Loader className="animate-spin" size={25} />
                ) : (
                  <Save size={25} />
                )}
                {profileMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminProfileSettingsSection;
