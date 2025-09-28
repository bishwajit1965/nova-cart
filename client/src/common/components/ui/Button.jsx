import { cn } from "../../lib/utils";

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  href,
  disabled = false,
  loading = false,
  icon: Icon,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 px-2 py-2 rounded font-semibold transition duration-150 cursor-pointer hover:scale-100 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-90 text-sm px-2";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:text-gray-200 hover:bg-blue-800 shadow-md rounded-md",
    success:
      "bg-green-600 text-white hover:text-gray-200 hover:bg-green-700 shadow-md rounded-md",
    secondary:
      "bg-gray-200 text-gray-800 hover:text-base-800 hover:bg-gray-300 shadow-md rounded-md",
    indigo:
      "bg-indigo-800 text-white hover:text-base-300 hover:bg-indigo-900 shadow-md rounded-md",
    danger:
      "bg-red-600 text-white hover:text-base-100 hover:bg-red-700 shadow-md outline-none border-none rounded-md",
    green:
      "bg-green-500 text-white hover:text-gray-200 hover:bg-green-800 shadow-md rounded-md",
    purple:
      "bg-purple-600 text-white hover:text-base-100 hover:bg-purple-700 shadow-md outline-none border-none rounded-md",
    ghost:
      "text-gray-600 hover:text-gray-800 hover:text-black hover:bg-gray-100 border border-gray-200 shadow-md rounded-md",
    cyan: "bg-cyan-700 text-base-200 hover:text-white hover:bg-cyan-800 shadow-md",
    outline:
      "border border-gray-300 text-gray-800 hover:text-gray-800 hover:bg-gray-100 shadow-md ring-2 ring-offset-2 ring-slate-700 ring-2 outline-2 shadow-md rounded-md",
    warning:
      "bg-yellow-600 border border-yellow-600 text-base-100 hover:text-gray-200 hover:bg-yellow-700 shadow-md rounded-md",
    muted:
      "bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-100 shadow-md rounded-md", // 👈 Add this
    base: "bg-base-content/5 border border-base-content/25 text-base-content/70 hover:text-base-content/80 hover:bg-base-200 shadow-sm rounded-md",
    default:
      "px-2 py-1 text-base-content/80 border border-base-content/40 shadow-sm rounded-lg hover:bg-base-300 hover:text-base-content/90",
    defaultRounded:
      "bg-base-content/5 lg:px-4 px-2 border border-base-content/40 text-base-content/70 font-semibold hover:text-gray-800 hover:bg-gray-200 shadow-sm rounded-full",
    remove:
      "bg-base-100 text-base-content hover:text-base-300 hover:bg-red-700 shadow-sm outline outline-red-500 rounded-md",
    global:
      "bg-base-100 text-base-content hover:text-base-content/80 hover:bg-base-300 shadow-sm outline outline-base-content/50 rounded-sm px-3 py-2 hover:outline-none",
  };

  const disabledStyles =
    "opacity-50 cursor-not-allowed pointer-events-none hover:!text-gray-400 hover:!bg-transparent";

  const loadingSpinner = (
    <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
  );

  const Component = href ? "a" : "button";
  const isDisabled = disabled || loading;

  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      onClick?.(e);
    }
  };

  return (
    <Component
      href={href && !isDisabled ? href : undefined}
      onClick={handleClick}
      className={cn(
        "cursor-pointer",
        "disabled:cursor-not-allowed",
        "disabled:opacity-60",
        base,
        variants[variant],
        isDisabled && disabledStyles,
        className
      )}
      aria-disabled={isDisabled}
      {...(Component === "button" ? { disabled: isDisabled } : {})}
      {...props}
    >
      {loading ? loadingSpinner : null}
      {Icon && <Icon className="w-4 h-4" />}
      {!loading && children}
    </Component>
  );
};

export default Button;

// USAGE EXAMPLE
{
  /* <Button
  variant="green" // 👈 Variant: green (you can try "primary", "outline", etc.)
  icon={CheckCircle} // 👈 Icon: Lucide Icon component
  loading={isSaving} // 👈 Loader spinner enabled
  disabled={isSaving} // 👈 Disabled while loading
  href="/success" // 👈 Acts like a link (but disabled if loading)
  className="w-full" // 👈 Custom width (optional)
  onClick={() => console.log("Submitted")} // 👈 Click handler
>
  Save & Continue
</Button>; */
}
