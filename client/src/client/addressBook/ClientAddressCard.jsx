import { Edit, IdCard, Trash, Trash2Icon } from "lucide-react";

import Badge from "../../common/components/ui/Badge";
import Button from "../../common/components/ui/Button";

const ClientAddressCard = ({
  clientAddress,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  const {
    _id,
    fullName,
    email,
    addressLine1,
    addressLine2,
    city,
    state,
    phone,
    postalCode,
    country,
    isDefault,
  } = clientAddress || {};
  return (
    <div
      className={`${
        isDefault === true ? "border border-green-500 bg-base-200" : ""
      } lg:col-span-6 col-span-12 lg:space-y-6 space-y-4 lg:p-4 p-2 bg-base-100 border border-base-content/15 rounded-xl lg:pb-4`}
    >
      <div className="">
        <p>{_id}</p>
        <h2 className="text-xl font-bold">{fullName}</h2>
        <p className="text-sm flex items-center space-x-2">
          Email: &nbsp; <span>{email},</span>
        </p>
        <p className="text-sm flex items-center space-x-2">
          Address 1: &nbsp; <span>{addressLine1},</span>
        </p>
        <p className="text-sm flex items-center space-x-2">
          Address 2: &nbsp; <span>{addressLine2},</span>
        </p>
        <p className="text-sm flex items-center space-x-2">
          City: &nbsp; <span>{city}</span>
        </p>
        <p className="flex items-center">
          Division / State: &nbsp; <span>{state}</span>,
        </p>
        <p className="flex items-center">
          Postal Code: &nbsp; <span>{postalCode}</span>,
        </p>
        <p className="flex items-center">
          Country: &nbsp;<span>{country}</span>,
        </p>
        <p className="flex items-center">
          Default Address: &nbsp;
          <Badge color={`${isDefault === true ? "green" : "red"}`}>
            <span>{isDefault.toString()}</span>
          </Badge>
        </p>
        <p className="flex items-center">Phone &nbsp; {phone}</p>
      </div>

      <div className="space-x-2 lg:pb-4 pb-2 flex items-center">
        <Button onClick={() => onEdit(clientAddress)} variant="primary">
          <Edit /> Edit
        </Button>
        <Button onClick={() => onDelete(clientAddress._id)} variant="danger">
          <Trash2Icon /> Delete
        </Button>
        {!clientAddress.isDefault && (
          <Button
            onClick={() => onSetDefault(clientAddress._id)}
            variant="primary"
            className="btn flex items-center"
          >
            <IdCard /> Set As Default
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClientAddressCard;
