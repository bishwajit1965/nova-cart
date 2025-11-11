import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "../lib/LucideIcons";
import { Home } from "lucide-react";
import { FaSignInAlt } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const Unauthorized = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const deniedMessage = location.state?.deniedMessage;
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-50px)] bg-base-200 px-4">
      <div className="text-center">
        <LucideIcon.AlertCircle
          size={64}
          className="text-red-500 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-2">Access Denied</h1>

        {deniedMessage && (
          <p className="text-lg text-gray-600 mb-6">{deniedMessage}</p>
        )}
        <div className="space-x-4">
          <Link to="/" className="btn btn-primary">
            <Home size={20} /> Go Home
          </Link>
          {!isAuthenticated && (
            <Link to="/login" className="btn btn-outline">
              <FaSignInAlt size={20} /> Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
