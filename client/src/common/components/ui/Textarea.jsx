import clsx from "clsx";
import { forwardRef } from "react";

const Textarea = forwardRef(
  (
    {
      name,
      label,
      placeholder = "",
      value,
      onChange,
      rows = 4,
      className,
      disabled = false,
      icon: Icon,
      error,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="form-control w-full space-y-1">
        {label && (
          <label htmlFor={name} className="label flex justify-items-start">
            <span className="label-text">{label}</span>
          </label>
        )}

        <div className="relative">
          {Icon && (
            <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground pointer-events-none z-10 text-base-content/25">
              <Icon className="w-5 h-5" />
            </span>
          )}

          <textarea
            id={name}
            name={name}
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={clsx(
              "textarea textarea-bordered w-full",
              error && "textarea-error",
              className,
            )}
            {...props}
          />
        </div>

        {error && (
          <label className="label flex justify-items-start">
            <span className="label-text-alt text-error text-xs">{error}</span>
          </label>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
