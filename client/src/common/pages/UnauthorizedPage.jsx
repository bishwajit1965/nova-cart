import { Link } from "react-router-dom";
import { LucideIcon } from "../lib/LucideIcons";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-base-200 px-4">
      <div className="text-center">
        <LucideIcon.AlertCircle
          size={64}
          className="text-red-500 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-6">
          You do not have permission to view this page.
        </p>
        <div className="space-x-4">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link to="/login" className="btn btn-outline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
