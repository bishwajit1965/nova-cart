import { cn } from "../../lib/utils";

const IconButton = ({
  icon: Icon,
  onClick,
  variant = "primary",
  tooltip = "",
  disabled = false,
  size = "md",
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center rounded-full transition";
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    cyan: "bg-cyan-600 text-white hover:bg-cyan-700",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-gray-600 hover:bg-gray-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        base,
        sizes[size],
        variants[variant],
        className,
        disabled && "opacity-50 cursor-not-allowed"
      )}
      title={tooltip}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}
    </button>
  );
};

export default IconButton;
