import Card, {
  CardContent,
  CardHeader,
  CardTitle,
} from "../../common/components/ui/Card";
import {
  Edit,
  Loader,
  Loader2,
  LoaderIcon,
  RefreshCcw,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import { LucideIcon } from "../../common/lib/LucideIcons";
import NoDataFound from "../../common/components/ui/NoDataFound";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import useValidator from "../../common/hooks/useValidator";

const SuperAdminVendorManagementPage = () => {
  const [vendors, setVendors] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validation
  const validationRules = {
    name: {
      required: { message: "Name is required" },
    },
    email: {
      required: { message: "Email is required" },
    },
    phone: {
      required: { message: "Phone is required" },
    },
    address: {
      required: { message: "Address is required" },
    },
  };

  /*** -----> Validator integration -----> */
  const { errors, validate } = useValidator(validationRules, {
    name,
    email,
    phone,
    address,
  });

  /*** ------> Vendor Mutation CREATE/UPDATE API Hook ------> */
  const vendorMutation = useApiMutation({
    method: editId ? "update" : "create",
    path: editId
      ? (payload) =>
          `${API_PATHS.SUP_ADMIN_VENDOR.SUP_ADMIN_VENDOR_ENDPOINT}/${payload.id}/edit-vendor`
      : API_PATHS.SUP_ADMIN_VENDOR.SUP_ADMIN_VENDOR_ENDPOINT,
    key: API_PATHS.SUP_ADMIN_VENDOR.SUP_ADMIN_VENDOR_KEY, // used by useQuery
    onSuccess: () => {
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setEditId(null);
    },
    onError: (error) => {
      toast.error("Error in saving plan!", error);
      console.error(error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!validate()) return;
      const payload = editId
        ? {
            id: editId,
            data: {
              name,
              email,
              phone,
              address,
            },
          }
        : {
            data: {
              name,
              email,
              phone,
              address,
            },
          };

      vendorMutation.mutate(payload, {
        onSuccess: () => {
          setTimeout(() => {
            setShowModal(false);
          }, 1000);
        },
      });
    } catch (error) {
      console.error("Error in creating/updating vendor!", error);
    } finally {
      setLoading(false);
    }
  };

  /*** ------> Vendor Mutation DELETE API Hook ------> */
  const deleteVendorMutation = useApiMutation({
    method: "delete",
    path: (id) =>
      `${API_PATHS.SUP_ADMIN_VENDOR.SUP_ADMIN_VENDOR_ENDPOINT}/${id}/delete-vendor`,
    key: API_PATHS.SUP_ADMIN_VENDOR.SUP_ADMIN_VENDOR_KEY,
  });
  /*** ------> Vendor query API Hook ------> */
  const {
    data: vendorsData,
    isLoadingVendors,
    isErrorVendors,
    errorVendors,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_VENDOR.SUP_ADMIN_VENDOR_ENDPOINT}`,
    queryKey: API_PATHS.SUP_ADMIN_VENDOR.SUP_ADMIN_VENDOR_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  useEffect(() => {
    if (vendorsData) setVendors(vendorsData);
  }, [vendorsData]);

  const vendorDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingVendors,
    isError: isErrorVendors,
    error: errorVendors,
    label: "Vendors",
  });

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setEditId(null);
  };

  const handleEdit = (vendor) => {
    setEditId(vendor._id);
    setName(vendor.name);
    setEmail(vendor.email);
    setPhone(vendor.phone || "");
    setAddress(vendor.address || "");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    try {
      deleteVendorMutation.mutate(id, {
        onSuccess: (res) => {
          res.data.message;
        },
        onError: (error) => {
          toast.error(
            error.response.data.message || "Error in deleting vendor"
          );
        },
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      {vendorDataStatus.status !== "success" ? (
        vendorDataStatus.content
      ) : (
        <>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{editId ? "Edit Vendor" : "Add New Vendor"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
                <div>
                  <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${
                      errors.name
                        ? "border border-red-500 bg-yellow-100 rounded-lg px-3 py-2"
                        : "border rounded-lg px-3 py-2"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${
                      errors.email
                        ? "border border-red-500 bg-yellow-100 rounded-lg px-3 py-2"
                        : "border rounded-lg px-3 py-2"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`${
                      errors.phone
                        ? "border border-red-500 bg-yellow-100 rounded-lg px-3 py-2"
                        : "border rounded-lg px-3 py-2"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`${
                      errors.address
                        ? "border border-red-500 bg-yellow-100 rounded-lg px-3 py-2"
                        : "border rounded-lg px-3 py-2"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <div
                  className={`${
                    vendorMutation.isPending ? "cursor-not-allowed" : ""
                  }`}
                >
                  <Button
                    onClick={handleSubmit}
                    variant="indigo"
                    disabled={vendorMutation.isPending}
                    className={`${
                      vendorMutation.isPending
                        ? "opacity-65 transition-all bg-red-400"
                        : "opacity-100"
                    }`}
                  >
                    {vendorMutation.isPending ? (
                      <LoaderIcon className="animate-spin" size={20} />
                    ) : editId ? (
                      <Edit />
                    ) : (
                      <Save />
                    )}
                    {vendorMutation.isPending
                      ? "Updating..."
                      : editId
                      ? "Update Vendor"
                      : "Add Vendor"}
                  </Button>
                </div>
                <Button
                  onClick={resetForm}
                  variant="warning"
                  className="btn lg:btn-md btn-sm"
                >
                  <RefreshCcw /> Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vendors List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="table table-xs min-w-full">
                  <thead className="bg-base-300">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th className="text-end py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors?.length > 0 ? (
                      vendors?.map((vendor, idx) => (
                        <tr key={vendor._id}>
                          <td>{idx + 1}</td>
                          <td>{vendor.name}</td>
                          <td>{vendor.email}</td>
                          <td>{vendor.phone || "—"}</td>
                          <td>{vendor.address || "—"}</td>
                          <td className="text-end space-x-2 py-2">
                            <Button
                              onClick={() => handleEdit(vendor)}
                              variant="indigo"
                              className="btn btn-sm"
                            >
                              <LucideIcon.Edit size={15} /> Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(vendor._id)}
                              variant="danger"
                              className="btn btn-sm"
                            >
                              <LucideIcon.Trash2 size={15} /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="text-center">
                        <td colSpan={6} className="text-xl font-bold">
                          <NoDataFound label={"Vendors"} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SuperAdminVendorManagementPage;
