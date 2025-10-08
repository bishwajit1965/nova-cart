import { MiniIconButton } from "../../common/components/ui/MiniIconButton";

const SuperAdminFeatureCard = ({ feature, onEdit, onDelete }) => {
  return (
    <div className="lg:col-span-3 col-span-12">
      <div className="lg:p-4 p-2 border border-base-content/15 rounded-lg shadow hover:shadow-md transition">
        <h2 className="text-lg font-semibold">{feature.title}</h2>
        <p className="text-sm text-gray-500">Key: {feature.key}</p>
        <p className="text-sm text-gray-400">{feature.description}</p>
        <div className="flex gap-2 mt-2">
          <MiniIconButton
            variant="indigo"
            icon="defaultEdit"
            label="Edit"
            className=""
            onClick={onEdit}
          />

          <MiniIconButton
            icon="delete"
            variant="danger"
            label="Delete"
            className=""
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminFeatureCard;
