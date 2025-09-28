import { cn } from "../../lib/utils";

const Input = ({
  type = "text",
  name,
  icon: Icon,
  value,
  onChange,
  placeholder,
  className = "",
  error,
  label,
  ...props
}) => {
  return (
    <div className="relative form-control w-full space-y-1">
      {label && (
        <label
          htmlFor={name}
          className="font-medium text-sm flex justify-items-start"
        >
          <span className="label-text text-gray-400">{label}</span>
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground pointer-events-none z-10 text-base-content/25">
            <Icon className="w-5 h-5" />
          </span>
        )}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "input input-bordered w-full",
            Icon && "pl-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 flex justify-items-start">{error}</p>
      )}
    </div>
  );
};

export { Input };

// import { cn } from "../../lib/utils";

// const Input = ({
//   type = "text",
//   name,
//   icon: Icon,
//   value,
//   onChange,
//   placeholder,
//   className = "",
//   error,
//   label,
//   ...props
// }) => {
//   return (
//     <div className="relative w-full space-y-1">
//       {label && (
//         <label htmlFor={name} className="font-medium text-sm">
//           {label}
//         </label>
//       )}
//       {Icon && (
//         <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground pointer-events-none z-10 text-base-content/25">
//           <Icon className="w-5 h-5" />
//         </span>
//       )}
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className={cn(
//           "input input-bordered w-full",
//           Icon && "pl-10", // add left padding when icon is shown
//           className
//         )}
//         {...props}
//       />
//     </div>
//   );
// };

// export { Input };
