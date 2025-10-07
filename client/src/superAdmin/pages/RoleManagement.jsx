import { Edit2, Loader, PlusCircle } from "lucide-react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import { LucideIcon } from "../../common/lib/LucideIcons";
import { MiniIconButton } from "../../common/components/ui/MiniIconButton";
import Pagination from "../../common/pagination/Pagination";
import Textarea from "../../common/components/ui/Textarea";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import { useState } from "react";
import useValidator from "../../common/hooks/useValidator";

const RoleManagement = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validation rules
  const validationRules = {
    name: {
      required: { message: "Name is required" },
    },
    description: {
      required: { message: "Description is required" },
      custom: (val) =>
        val && val.length > 100
          ? "Description must be less than 100 characters"
          : null,
    },
    permissions: {
      custom: (val) =>
        val && val.length === 0 ? "At least one permission is required" : null,
    },
  };

  const { errors, validate } = useValidator(validationRules, {
    name,
    description,
    permissions: selectedPermissions,
  });

  // Fetch all users
  const { data: users, isLoading: userLoading } = useApiQuery({
    url: API_PATHS.USERS.ENDPOINT,
    queryKey: API_PATHS.USERS.KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });
  const [paginatedData, setPaginatedData] = useState(users || []);
  // Fetch roles
  const {
    data: roles,
    isLoading: rolesLoading,
    isError: rolesError,
    error: rolesErrorObj,
  } = useApiQuery({
    url: API_PATHS.ROLES.ENDPOINT,
    queryKey: API_PATHS.ROLES.KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  // Fetch permissions to list in form
  const {
    data: permissions,
    isLoading: permsLoading,
    isError: permsError,
    error: permsErrorObj,
  } = useApiQuery({
    url: API_PATHS.PERMISSIONS.ENDPOINT,
    queryKey: API_PATHS.PERMISSIONS.KEY,
  });

  // Role create/update mutation
  const mutation = useApiMutation({
    method: editingRole ? "update" : "create",
    path: editingRole
      ? (payload) => `${API_PATHS.ROLES.ENDPOINT}/${payload.id}`
      : API_PATHS.ROLES.ENDPOINT,
    key: API_PATHS.ROLES.KEY,
    onSuccess: () => {
      setEditingRole(null);
      setName("");
      setDescription("");
      setSelectedPermissions([]);
    },
    onError: (error) => {
      toast.error("Error saving role");
      console.error(error);
    },
  });

  // Update/assign user role(s)
  const updateUserRolesMutation = useApiMutation({
    method: "update",
    path: (payload) => `${API_PATHS.USERS.ENDPOINT}/${payload.id}`,
    key: API_PATHS.USERS.KEY,
    onSuccess: () => {
      setSelectedUser(null);
      setEditingRole(null);
      setSelectedPermissions([]);
    },
    onError: (error) => {
      toast.error("Error saving role");
      console.error(error);
    },
  });

  const handleUserRolesAssign = () => {
    if (!selectedUser) return;
    setIsLoading(true);
    setTimeout(() => {
      try {
        updateUserRolesMutation.mutate({
          id: selectedUser._id,
          data: { roles: selectedRoles },
        });
      } catch (error) {
        console.error("error found", error);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  // Delete mutation
  const deleteRole = useApiMutation({
    method: "delete",
    path: (id) => `${API_PATHS.ROLES.ENDPOINT}/${id}`,
    key: API_PATHS.ROLES.KEY,
    onSuccess: () => toast.success("Role deleted"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = editingRole
      ? {
          id: editingRole._id,
          data: { name, description, permissions: selectedPermissions },
        }
      : { data: { name, description, permissions: selectedPermissions } };
    setIsLoading(true);
    setTimeout(() => {
      try {
        mutation.mutate(payload);
      } catch (error) {
        console.error("error found", error);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setName(role.name);
    setDescription(role.description);
    // permissions is an array of objects, map to _id
    setSelectedPermissions(
      role.permissions ? role.permissions.map((p) => p._id) : []
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      deleteRole.mutate(id);
    }
  };

  const togglePermission = (permId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  const toggleRole = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles.map((r) => r._id));
    setSelectedPermissions(user.permissions.map((p) => p._id));
  };
  console.log("USERS", users);

  if (userLoading || rolesLoading || permsLoading) return <p>Loading...</p>;
  if (rolesError) return <p>Error loading roles: {rolesErrorObj.message}</p>;
  if (permsError)
    return <p>Error loading permissions: {permsErrorObj.message}</p>;

  return (
    <div>
      <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-6 gap-4">
        {/* Form */}
        <div className="lg:col-span-4 col-span-12 bg-base-100 lg:p-4 p-2 rounded-xl shadow space-y-4">
          <h2 className="text-2xl font-bold">
            {editingRole
              ? "Edit Role"
              : selectedUser
              ? `Assign ${selectedUser?.name} Role`
              : "Add Role"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {" "}
            {selectedUser && (
              <Input
                icon={LucideIcon.User}
                type="text"
                placeholder="Role name..."
                value={selectedUser?.name}
                onChange={(e) => setName(e.target.value)}
                readOnly
              />
            )}
            {!selectedUser && (
              <>
                <Input
                  icon={LucideIcon.User}
                  type="text"
                  placeholder="Role name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                )}

                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of the role..."
                />
                {errors.description && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </>
            )}
            {selectedUser && (
              <div className="">
                <p className="font-semibold mb-2">Assign Roles</p>
                <div className="max-h-48 overflow-y-auto border border-base-content/25 rounded p-2 bg-base-100 grid grid-cols-2 text-sm">
                  {(roles || []).map((role) => (
                    <label
                      key={role._id}
                      className="flex items-center space-x-2 mb-1"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role._id)}
                        onChange={() => toggleRole(role._id)}
                      />
                      <span>{role.name}</span>
                    </label>
                  ))}
                </div>
                {errors.permissions && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.permissions}
                  </p>
                )}
              </div>
            )}
            {selectedUser && (
              <div className="flex items-center space-x-3">
                <div className="cursor-not-allowed">
                  <Button
                    onClick={handleUserRolesAssign}
                    type="button"
                    disabled={isLoading}
                    variant="indigo"
                    className="btn btn-primary cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <LucideIcon.Edit size={15} />
                    )}
                    {isLoading ? "Assigning Role..." : "Assign Role"}
                  </Button>
                </div>
                <Button
                  type="button"
                  icon={LucideIcon.X}
                  variant="warning"
                  onClick={() => {
                    setSelectedUser(null);
                    setDescription("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
            {!selectedUser && (
              <div className="">
                <p className="font-semibold mb-2">Assign Permissions</p>
                <div className="max-h-48 overflow-y-auto border border-base-content/25 rounded p-2 bg-base-100 grid grid-cols-2 text-sm">
                  {permissions.map((perm) => (
                    <label
                      key={perm._id}
                      className="flex items-center space-x-2 mb-1"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm._id)}
                        onChange={() => togglePermission(perm._id)}
                      />
                      <span>{perm.name}</span>
                    </label>
                  ))}
                </div>
                {errors.permissions && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.permissions}
                  </p>
                )}
              </div>
            )}
            <div className="flex space-x-3">
              {!selectedUser && (
                <Button
                  type="submit"
                  variant="indigo"
                  disabled={isLoading}
                  className="btn"
                >
                  {isLoading ? (
                    <Loader className="animate-spin" />
                  ) : editingRole ? (
                    <LucideIcon.Edit size={15} />
                  ) : (
                    <PlusCircle />
                  )}

                  {editingRole ? "Update Role" : "Add Role"}
                </Button>
              )}
              {editingRole && (
                <Button
                  type="button"
                  icon={LucideIcon.X}
                  variant="warning"
                  onClick={() => {
                    setEditingRole(null);
                    setSelectedUser(null);
                    setName("");
                    setDescription("");
                    setSelectedPermissions([]);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
        {/* Users Table */}

        <div className="lg:col-span-8 col-span-12 bg-base-100 overflow-x-auto space-y-6 lg:p-4 p-2 rounded-xl shadow">
          <div className="">
            <h2 className="text-2xl font-bold mb-4">Users List</h2>
            <div className="overflow-x-auto">
              <table className="table table-xs w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th>#</th>
                    <th>User name</th>
                    <th>User Email</th>
                    <th>Roles</th>
                    <th>Permissions</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {paginatedData?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center font-semibold">
                        No user found
                      </td>
                    </tr>
                  ) : (
                    (paginatedData || []).map((user, idx) => (
                      <tr key={user._id}>
                        <td>{idx + 1}</td>
                        <td className="font-semibold">{user.name}</td>
                        <td className="font-semibold">{user.email}</td>
                        <td>
                          {user?.roles && user?.roles.length > 0
                            ? user?.roles?.map((p) => (
                                <span
                                  key={p._id}
                                  className="inline-block bg-base-300 text-base-content my-1 rounded px-2 py-0.5 mr-1 text-xs"
                                >
                                  {p.name}
                                </span>
                              ))
                            : "No roles"}
                        </td>
                        <td>
                          {user?.roles?.length > 0
                            ? user?.roles?.flatMap(
                                (role) => role.permissions || []
                              ).length > 0
                              ? user.roles
                                  .flatMap((role) => role.permissions || [])
                                  .map((p, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block bg-base-300 text-base-content rounded px-2 py-0.5 mr-1 my-1 text-xs"
                                    >
                                      {p.key}
                                    </span>
                                  ))
                              : "No permissions"
                            : "No permissions"}
                        </td>

                        {!editingRole && (
                          <td className="flex justify-end space-x-2 text-right py-2">
                            <MiniIconButton
                              variant="indigo"
                              icon="defaultEdit"
                              onClick={() => handleUserSelect(user)}
                            />
                            <MiniIconButton
                              variant="danger"
                              icon="delete"
                              onClick={() => handleDelete(user._id)}
                            />
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-base-200">
                  <tr>
                    <th>#</th>
                    <th>User name</th>
                    <th>User Email</th>
                    <th>Roles</th>
                    <th>Permissions</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </tfoot>
              </table>
              {/* pagination begins*/}
              <Pagination
                items={users}
                onPaginatedDataChange={setPaginatedData}
              />
            </div>
          </div>
          <div className="divider m-0"></div>
          {/* Roles Table */}
          <div className="">
            <h2 className="text-2xl font-bold mb-4">Roles List</h2>
            <div className="overflow-x-auto">
              <table className="table table-xs w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th>#</th>
                    <th>Role name</th>
                    <th>Permissions</th>
                    <th>Description</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center font-semibold">
                        No roles found
                      </td>
                    </tr>
                  ) : (
                    roles.map((role, idx) => (
                      <tr key={role._id}>
                        <td>{idx + 1}</td>
                        <td className="font-semibold">{role.name}</td>
                        <td>
                          {role?.permissions && role?.permissions.length > 0
                            ? role?.permissions?.map((p) => (
                                <span
                                  key={p._id}
                                  className="inline-block bg-base-300 text-base-content rounded px-2 py-1 m-1 text-xs"
                                >
                                  {p.name}
                                </span>
                              ))
                            : "No permissions"}
                        </td>
                        <td>{role.description}</td>
                        {!selectedUser && (
                          <td className="flex justify-end space-x-2 py-2">
                            <MiniIconButton
                              icon="defaultEdit"
                              variant="default"
                              onClick={() => handleEdit(role)}
                            />
                            <MiniIconButton
                              variant="danger"
                              icon="delete"
                              onClick={() => handleDelete(role._id)}
                            />
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-base-200">
                  <tr>
                    <th>#</th>
                    <th>Role name</th>
                    <th>Permissions</th>
                    <th>Description</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
