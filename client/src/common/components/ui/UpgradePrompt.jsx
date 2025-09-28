import { Edit, Lock } from "lucide-react";

import Button from "./Button";
import { Link } from "react-router-dom";

const FEATURE_LABELS = {
  "view-audit-log": "Audit Logs",
  "manage-users": "User Management",
  "custom-theme": "Custom Themes",
  "analytics-dashboard": "Analytics Dashboard",
  "premium-support": "Premium Support",
  // Add more as needed
};

const UpgradePrompt = ({ feature }) => {
  const featureLabel = FEATURE_LABELS[feature] || feature || "this feature";

  return (
    <div className="p-6 bg-yellow-100 border border-yellow-400 rounded-lg text-center text-yellow-800 space-y-4">
      <div className="flex justify-center text-warning mb-2">
        <Lock size={32} />
      </div>
      <h2 className="text-xl font-bold">This Feature is Locked</h2>
      <p className="text-sm my-2 text-gray-600">
        You need to upgrade your plan to access <strong>{featureLabel}</strong>.
      </p>
      <Link to="/dashboard">
        <Button variant="primary">
          <Edit size={18} /> Upgrade Plan
        </Button>
      </Link>
    </div>
  );
};

export default UpgradePrompt;
