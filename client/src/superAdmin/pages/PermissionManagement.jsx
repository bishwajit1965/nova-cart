import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import { LucideIcon } from "../../common/lib/LucideIcons";
import { MiniIconButton } from "../../common/components/ui/MiniIconButton";
import NoDataFound from "../../common/components/ui/NoDataFound";
import Pagination from "../../common/pagination/Pagination";
import Textarea from "../../common/components/ui/Textarea";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";
import useValidator from "../../common/hooks/useValidator";

const PermissionManagement = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [key, setKey] = useState("");
  const [editingPermission, setEditingPermission] = useState(null);

  // Validation
  const validationRules = {
    key: {
      required: { message: "Key is required" },
    },
    name: {
      required: { message: "Name is required" },
    },

    description: {
      required: { message: "Description is required" }, // <-- Add this line
      custom: (val) =>
        val && val.length > 100
          ? "Description must be less than 100 characters"
          : null,
    },
  };

  // Validator integration
  const { errors, validate } = useValidator(validationRules, {
    key,
    name,
    description,
  });

  const {
    data: permissions = [],
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
    error: errorPermissions,
  } = useApiQuery({
    url: API_PATHS.PERMISSIONS.ENDPOINT,
    queryKey: API_PATHS.PERMISSIONS.KEY,
    // select: (res) => res.data, //NOT NEEDED HERE AS HOOK DOES IT
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const [paginatedData, setPaginatedData] = useState(permissions || []);
  // To display total permissions in pagination
  const dataLength = permissions?.length;

  const mutation = useApiMutation({
    method: editingPermission ? "update" : "create",
    path: editingPermission
      ? (payload) => `${API_PATHS.PERMISSIONS.ENDPOINT}/${payload.id}`
      : API_PATHS.PERMISSIONS.ENDPOINT,
    key: API_PATHS.PERMISSIONS.KEY, // used by useQuery
    onSuccess: () => {
      setEditingPermission(null);
      setName("");
      setDescription("");
      setKey("");
    },
    onError: (error) => {
      toast.error("Error saving permission");
      console.error(error);
    },
  });

  const deletePermissionMutation = useApiMutation({
    method: "delete",
    path: (id) => `${API_PATHS.PERMISSIONS.ENDPOINT}/${id}`,
    key: API_PATHS.PERMISSIONS.KEY,
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = editingPermission
      ? { id: editingPermission._id, data: { key, name, description } }
      : { data: { key, name, description } };

    mutation.mutate(payload);
  };

  const handleEdit = (perm) => {
    setEditingPermission(perm);
    setName(perm.name);
    setDescription(perm.description);
    setKey(perm.key || "");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deletePermissionMutation.mutate(id);
    }
  };

  /** --------> Use Fetched Data Status Handler --------> */
  const permissionsStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
    error: errorPermissions,
    label: "permissions",
  });

  return (
    <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-6 gap-4">
      <div className="lg:col-span-6 col-span-12 bg-base-100 lg:p-4 p-2 rounded-xl border border-base-content/15 shadow-sm">
        <div className="lg:mb-4 mb-2">
          <h1 className="lg:text-2xl font-bold">Permission Management</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="">
            <Input
              icon={LucideIcon.User}
              type="text"
              placeholder="Permission name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div className="">
            <Input
              icon={LucideIcon.RotateCcwKeyIcon}
              type="text"
              placeholder="Permission key..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            {errors.key && (
              <p className="text-red-600 text-xs mt-1">{errors.key}</p>
            )}
          </div>

          <div className="">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the permission..."
            />
            {errors.description && (
              <p className="text-red-600 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div className="space-x-3">
            <Button
              type="submit"
              disabled={mutation.isPending}
              icon={LucideIcon.Edit}
            >
              {editingPermission ? "Update Permission" : "Add Permission"}
            </Button>
            {editingPermission && (
              <Button
                type="button"
                icon={LucideIcon.X}
                variant="warning"
                onClick={() => {
                  setEditingPermission(null);
                  setName("");
                  setDescription("");
                  setKey("");
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="lg:col-span-6 col-span-12 bg-base-100 lg:p-4 p-2 rounded-xl border border-base-content/15 shadow-sm lg:space-y-6 space-y-4">
        <div className="overflow-x-auto">
          <div className="lg:mb-4 mb-2">
            <h2 className="lg:text-2xl text-xl font-bold space-y-3">
              Permission List
            </h2>
          </div>
          {permissionsStatus.status !== "success" ? (
            permissionsStatus.content
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-xs">
                <thead className="bg-base-200">
                  <tr>
                    <th>#</th>
                    <th>Permission</th>
                    <th>Permission Key</th>
                    <th>Description</th>
                    <th className="flex justify-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData?.length === 0 ? (
                    <tr className="text-xl font-bold text-center">
                      <td>
                        <NoDataFound label="Permissions" />
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((perm, idx) => (
                      <tr key={perm._id}>
                        <th>{idx + 1}</th>
                        <td className="text-sm font-semibold">{perm.name}</td>
                        <td className="text-sm font-semibold">{perm.key}</td>
                        <td>{perm.description}</td>
                        <td className="space-x-2 flex justify-end">
                          <MiniIconButton
                            variant="indigo"
                            onClick={() => handleEdit(perm)}
                          />
                          <MiniIconButton
                            variant="danger"
                            icon="delete"
                            onClick={() => handleDelete(perm._id)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-base-200">
                  <tr>
                    <th>#</th>
                    <th>Permission</th>
                    <th>Permission Key</th>
                    <th>Description</th>
                    <th className="flex justify-end">Actions</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
        {/* pagination begins*/}
        <Pagination
          items={permissions}
          dataLength={dataLength}
          onPaginatedDataChange={setPaginatedData}
        />
      </div>
    </div>
  );
};

export default PermissionManagement;
