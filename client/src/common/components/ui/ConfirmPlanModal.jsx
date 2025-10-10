import { CheckCircle, X } from "lucide-react";

const ConfirmPlanModal = ({ isOpen, onClose, plan, onConfirm }) => {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sms transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Panel */}
      <div className="bg-base-100 rounded-2xl shadow-2xl max-w-md w-full z-10 p-6 transform scale-95 animate-modalFadeIn">
        <h2 className="text-xl text-base-content/70 font-bold flex items-center space-x-2">
          <CheckCircle className="text-indigo-500" />
          <span>Confirm Plan Upgrade ?</span>
        </h2>
        <p className="text-base-content/70 mt-3">
          Are you sure you want to upgrade to the{" "}
          <span className="font-semibold text-amber-600">{plan.name}</span>{" "}
          plan?
        </p>
        <p className="text-base-content/70 mt-1">
          Price: <span className="font-semibold">${plan.price}</span> (
          {plan.duration})
        </p>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition flex items-center cursor-pointer"
          >
            <X size={16} /> <span> Cancel</span>
          </button>
          <button
            onClick={() => {
              onConfirm(plan);
              onClose();
            }}
            className="px-2 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md flex items-center space-x-2 cursor-pointer"
          >
            <CheckCircle size={16} />
            <span> Confirm</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPlanModal;
