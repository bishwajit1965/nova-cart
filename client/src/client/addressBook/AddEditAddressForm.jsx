import { Edit, PlusCircleIcon } from "lucide-react";
import { FaEdit, FaPlusSquare } from "react-icons/fa";

import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import { LucideIcon } from "../../common/lib/LucideIcons";

const AddEditAddressForm = ({
  initialData,
  onFormSubmit,
  onClose,
  formData,
  setFormData,
}) => {
  return (
    <div className="rounded-xl shadow border border-base-content/15">
      <div className="lg:p-6 p-2">
        <div className="">
          <h2 className="lg:text-2xl text-xl font-bold lg:mb-4">
            {initialData ? (
              <span className="flex items-center space-x-2">
                {" "}
                <FaEdit size={25} /> <span>Edit Address</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                {" "}
                <FaPlusSquare size={25} /> <span>Add a New Address</span>
              </span>
            )}
          </h2>
        </div>
        <form onSubmit={onFormSubmit} className="lg:space-y-4 space-y-2">
          <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-6 gap-4">
            <div className="lg:col-span-6 col-span-12 lg:space-y-4 space-y-2">
              <div className="">
                <Input
                  icon={LucideIcon.User}
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Full name..."
                />
              </div>
              <div className="">
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Phone..."
                />
              </div>
              <div className="">
                <Input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) =>
                    setFormData({ ...formData, addressLine1: e.target.value })
                  }
                  placeholder="Area, road no, house no, floor etc..."
                />
              </div>
              <div className="">
                <Input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={(e) =>
                    setFormData({ ...formData, addressLine2: e.target.value })
                  }
                  placeholder="Area, road no, house no, floor etc......"
                />
              </div>
              <div className="">
                <Input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  placeholder="Postal code..."
                />
              </div>
            </div>

            <div className="lg:col-span-6 col-span-12 lg:space-y-4 space-y-2">
              <div className="">
                <Input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email address..."
                />
              </div>
              <div className="">
                <Input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="City name..."
                />
              </div>
              <div className="">
                <Input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  placeholder="State name..."
                />
              </div>
              <div className="">
                <Input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  placeholder="Country name..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                />
                <label htmlFor="isDefault">Set as Default</label>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="space-x-">
              <Button
                type="submit"
                variant="primary"
                className="btn lg:btn-md btn-sm"
              >
                {initialData ? <Edit /> : <PlusCircleIcon />}
                {initialData ? "Update Address" : "Add New"}
              </Button>
            </div>

            <div className="">
              {initialData && (
                <Button
                  type="button"
                  variant="warning"
                  onClick={onClose}
                  className="btn lg:btn-md btn-sm"
                >
                  <LucideIcon.X /> <span>Cancel</span>
                </Button>
              )}
            </div>

            {!initialData && (
              <div className="">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="danger"
                  className="btn lg:btn-md btn-sm"
                >
                  <LucideIcon.X /> <span>Close</span>
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditAddressForm;
