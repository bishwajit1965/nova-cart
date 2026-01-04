import { LucideIcon } from "../../../common/lib/LucideIcons";

const OrderTimeline = ({ statusHistory, currentStatus }) => {
  const stages = ["pending", "processing", "shipped", "delivered"];

  return (
    <div className="flex items-center justify-between w-full lg:space-x-4 space-x-2 mt-4">
      {stages.map((stage, idx) => {
        const isCompleted = stages.indexOf(currentStatus) >= idx;
        const isCurrent = currentStatus === stage;

        return (
          <div
            key={idx}
            className="flex-1 relative flex flex-col items-center w-full"
          >
            {/* Circle */}
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                ${
                  isCompleted
                    ? "bg-green-500 border-green-500 z-50"
                    : "bg-base-200 border-2 border-base-content/15 z-50"
                }`}
            >
              {isCompleted ? (
                <LucideIcon.Check size={18} className="text-white" />
              ) : (
                <span className="text-base-content/50">{idx + 1}</span>
              )}
            </div>

            {/* Label */}
            <span
              className={`mt-2 text-xs font-semibold capitalize
                ${isCurrent ? "text-blue-600" : "text-gray-500"}`}
            >
              {stage}
            </span>

            {/* Connector */}
            {idx !== stages.length - 1 && (
              <div
                className={`absolute top-4 right-[-50%] w-full h-1
                  ${
                    stages.indexOf(currentStatus) > idx
                      ? "bg-green-500"
                      : "bg-base-content/15"
                  }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
