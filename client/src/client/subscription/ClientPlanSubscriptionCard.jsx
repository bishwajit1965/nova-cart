import Badge from "../../common/components/ui/Badge";
import Button from "../../common/components/ui/Button";
import { CheckCircle } from "lucide-react";

const ClientPlanSubscriptionCard = ({
  plan,
  selectedPlanId,
  onSelect,
  isCurrent,
}) => {
  const isSelected = selectedPlanId === plan?._id;
  return (
    <div className="lg:col-span-4 col-span-12">
      <div
        className={`${
          isSelected || isCurrent
            ? "border border-blue-500 shadow transition-all"
            : "border border-base-content/15"
        } lg:relative rounded-lg shadow hover:shadow-lg transition lg:min-h-80`}
      >
        <div className="flex items-center space-x-2 font-bold bg-base-300 border-b rounded-t-lg border-base-content/15 shadow lg:p-4 p-2 relative">
          <h2 className="text-2xl font-semibold">{plan.name}</h2>
          <span> || </span>
          <p className="capitalize font-bold">{plan.duration}</p>
          <span> || </span>
          <p className=""> ${plan.price}</p>
        </div>
        <div className="lg:p-4 p-2">
          {isCurrent && (
            <div className="mb-1.5 lg:absolute top-5 right-4">
              <span className="bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow opacity-90">
                {isCurrent ? "My Plan" : ""}
              </span>
            </div>
          )}

          <p className="mb-2 font-bold">
            Features: {plan?.features?.length || 0}
          </p>
          <ul className="">
            {plan?.features?.map((feature) => (
              <li className="flex items-center space-x-2" key={feature._id}>
                <CheckCircle size={20} className="text-indigo-500 font-bold" />
                <span className="font-bold">{feature?.title}</span>
              </li>
            ))}
          </ul>
          <p className="">{plan.description}</p>
        </div>
        {!isCurrent && (
          <div className="lg:absolute lg:bottom-4 flex gap-2 left-4 mt-2">
            <Button variant="indigo" className=" " onClick={onSelect}>
              <CheckCircle size={20} />{" "}
              {isSelected ? "Selected" : "Select Plan"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPlanSubscriptionCard;
