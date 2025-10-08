import { MiniIconButton } from "../../common/components/ui/MiniIconButton";

const SuperAdminPlanCard = ({ plan, onEdit, onDelete, isCurrent }) => {
  return (
    <div className="lg:col-span-3 col-span-12">
      <div className="lg:p-4 p-2 border border-base-content/15 rounded-lg shadow hover:shadow-md transition">
        <h2 className="text-xl font-semibold">{plan.name}</h2>

        <p className="text-gray-600 capitalize font-bold">{plan.duration}</p>
        <p className="font-bold">${plan.price}</p>
        <p className="text-sm text-gray-500">
          Features: {plan?.features?.length || 0}
        </p>

        <p>{plan.description}</p>
        <div className="flex gap-2 mt-2">
          <MiniIconButton
            variant="indigo"
            icon="defaultEdit"
            label="Edit"
            onClick={onEdit}
          />

          <MiniIconButton
            variant="danger"
            label="Delete"
            icon="delete"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPlanCard;
