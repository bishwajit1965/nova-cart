import { FaAddressCard, FaRegAddressBook } from "react-icons/fa";
import { IdCard, IdCardIcon } from "lucide-react";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import AddEditAddressForm from "./AddEditAddressForm";
import Button from "../../common/components/ui/Button";
import ClientAddressCard from "./ClientAddressCard";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import { useState } from "react";

const ClientAddressBookPage = () => {
  const pageTitle = usePageTitle();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const initialFormState = {
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  };

  const [formData, setFormData] = useState(initialFormState);

  /*** ------> Fetch address QUERY ------> */
  const {
    data: address,
    isLoading: isLoadingAddress,
    isError: isErrorAddress,
    error: errorAddress,
  } = useApiQuery({
    url: API_PATHS.CLIENT_ADDRESS.CLIENT_ADDRESS_ENDPOINT,
    queryKey: API_PATHS.CLIENT_ADDRESS.CLIENT_ADDRESS_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** ------> Create or Update ADDRESS MUTATION ------> */
  const addressMutation = useApiMutation({
    method: editingAddress ? "update" : "create",
    path: editingAddress
      ? (payload) =>
          `${API_PATHS.CLIENT_ADDRESS.CLIENT_ADDRESS_ENDPOINT}/${payload.addressId}`
      : API_PATHS.CLIENT_ADDRESS.CLIENT_ADDRESS_ENDPOINT,
    key: API_PATHS.CLIENT_ADDRESS.CLIENT_ADDRESS_KEY, // used by useQuery
    onSuccess: () => {},
    onError: (error) => {
      toast.error("Error saving address");
      console.error(error);
    },
  });

  /*** ------> Address DELETE MUTATION ------> */
  const deleteAddressMutation = useApiMutation({
    method: "delete",
    path: (addressId) =>
      `${API_PATHS.CLIENT_ADDRESS.CLIENT_ADDRESS_ENDPOINT}/${addressId}`,
    key: API_PATHS.CLIENT_ADDRESS.CLIENT_ADDRESS_KEY,
  });

  useEffect(() => {
    if (editingAddress) {
      setFormData(editingAddress);
    }
  }, [editingAddress]);

  /*** ------> CREATE OT UPDATE ADDRESS HANDLER ------> */
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = editingAddress
      ? { addressId: editingAddress._id, data: { formData } }
      : { data: { formData } };
    addressMutation.mutate(payload);
  };

  /*** ------> SET DEFAULT ADDRESS MUTATION ------> */
  const setDefaultAddressMutation = useApiMutation({
    method: "update",
    path: (addressId) =>
      `${API_PATHS.CLIENT_ADDRESS.CLIENT_ADDRESS_ENDPOINT}/set-default/${addressId}`,
    key: API_PATHS.CLIENT_ADDRESS.CLIENT_ADDRESS_KEY,
    onSuccess: () => {
      toast.success("Default address updated");
    },
    onError: (err) => {
      toast.error("Failed to update default address");
      console.error(err);
    },
  });

  /*** ------> SET DEFAULT ADDRESS HANDLER ------> */
  const handleSetDefault = (addressId) => {
    setDefaultAddressMutation.mutate(addressId);
  };

  const handleDelete = (addressId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteAddressMutation.mutate(addressId);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    setFormData(initialFormState);
  };

  console.log("Addresses fetched in address book", address);

  /*** -----> Use Fetched Data Status Handler -----> */
  const addressStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingAddress,
    isError: isErrorAddress,
    error: errorAddress,
    label: "address",
  });
  return (
    <div>
      <DynamicPageTitle pageTitle={pageTitle} />

      {/*** ------> FETCHED ADDRESS DATA VALIDATOR ------> */}
      {addressStatus.status !== "success" ? (
        addressStatus.content
      ) : (
        <div className="lg:max-width-3xl mx-auto lg:space-y-10 space-y-6">
          {/*** ------> MODAL TO ADD OR EDIT ADDRESS ------> */}
          {isModalOpen && (
            <div className="">
              <AddEditAddressForm
                initialData={editingAddress}
                onFormSubmit={handleSubmit}
                onClose={handleCloseForm}
                formData={formData}
                setFormData={setFormData}
              />
            </div>
          )}

          {/*** ------> NAVIGATION BUTTONS ------>  */}
          <div className="lg:flex grid justify-between gap-2 items-center lg:mb-6 mb-4">
            <h2 className="lg:text-2xl text-xl font-bold flex items-center space-x-2">
              <IdCard size={30} />
              <span>My Address Book </span>
            </h2>
            <Button
              onClick={handleAddNew}
              variant="primary"
              className="flex items-center space-x-2 btn lg:btn-md btn-sm"
            >
              <IdCard /> <span>New Address</span>
            </Button>
          </div>
          <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-6 gap-4">
            {address?.map((clientAddress, i) => (
              <ClientAddressCard
                key={i}
                clientAddress={clientAddress}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAddressBookPage;
