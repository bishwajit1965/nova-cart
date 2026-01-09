import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  showClose = true,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={cn(
          "bg-base-100 lg:p-4 p-2 py- rounded-xl shadow-xl lg:w-[90%] w-[96%] max-w-lg relative lg:text-lg text-xs flex flex-col",
          className
        )}
      >
        {showClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black dark:hover:text-white"
          >
            <X className="w-7 h-7 bg-base-200 hover:bg-base-300 rounded-full p-1 text-base-content shadow-sm border border-base-content/15 cursor-pointer hover:text-red-500" />
          </button>
        )}
        {title && (
          <h2 className="lg:text-xl font-bold flex items-center gap-x-24 mb-2 pb-1 border-b border-base-content/20">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
