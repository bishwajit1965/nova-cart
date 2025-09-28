import { Edit, Eye, EyeOff, Loader, LogInIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LucideIcon } from "../lib/LucideIcons";
import api from "../lib/api";
import toast from "react-hot-toast";
import { useState } from "react";
import useValidator from "../hooks/useValidator";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [comparePassword, setComparePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const formData = { password, confirmPassword };

  const validationRules = {
    password: {
      required: { message: "Password is required" },
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?#&^]).{6,}$/,
        message:
          "Password must include uppercase, lowercase, number, and special character",
      },
    },
    confirmPassword: {
      required: { message: "Confirm password is required" },
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?#&^]).{6,}$/,
        message:
          "Confirm password must include uppercase, lowercase, number, and special character",
      },
    },
  };

  const { errors, validate } = useValidator(validationRules, formData);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    const resetLoading = () => {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    if (!validate()) {
      resetLoading();
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      toast.error("🔴Passwords do not match!");
      return;
    }

    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset is successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="lg:max-w-3xl mx-auto bg-base-100 lg:p-8 p-4 rounded-lg shadow space-y-2">
      <form onSubmit={handleReset} className="space-y-4 max-w-sm mx-auto">
        <h2 className="text-xl font-bold flex items-center space-x-2">
          <span>
            <LucideIcon.RotateCcwKeyIcon />
          </span>
          <span>Reset Password</span>
        </h2>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            name="password"
            placeholder="New password"
            onChange={(e) => setPassword(e.target.value)}
            className={`${
              errors.password ? "input-error bg-yellow-100" : ""
            } input input-bordered w-full`}
          />
          <span
            className="absolute right-2 top-2 cursor-pointer z-50"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="text-gray-300" />
            ) : (
              <Eye className="text-gray-300" />
            )}
          </span>
          {errors.password && (
            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
          )}
        </div>
        <div className="relative">
          <Input
            type={comparePassword ? "text" : "password"}
            value={confirmPassword}
            name="confirmPassword"
            placeholder="Confirm new password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`${
              errors.confirmPassword ? "input-error bg-yellow-100" : ""
            } input input-bordered w-full`}
          />
          <span
            className="absolute right-2 top-2 cursor-pointer z-50"
            onClick={() => setComparePassword(!comparePassword)}
          >
            {comparePassword ? (
              <EyeOff className="text-gray-300" />
            ) : (
              <Eye className="text-gray-300" />
            )}
          </span>
          {errors.confirmPassword && (
            <p className="text-red-600 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div
          className={`${
            loading
              ? "cursor-not-allowed flex items-center justify-between"
              : "cursor-progress space-x-2 flex items-center justify-between"
          }`}
        >
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className={`${
              !loading ? "cursor-progress" : "cursor-not-allowed"
            } w-48 disabled:cursor-not-allowed disabled:opacity-100 btn`}
          >
            {loading ? (
              <Loader className="animate-spin text-slate-500" />
            ) : (
              <LucideIcon.RotateCcwKeyIcon />
            )}
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
          <Link to="/login">
            <Button variant="indigo" className="btn">
              <LogInIcon size={20} /> Login
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
