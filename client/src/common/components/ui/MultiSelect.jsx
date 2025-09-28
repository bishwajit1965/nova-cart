import { useEffect, useRef, useState } from "react";

import { CheckIcon } from "lucide-react";

const MultiSelect = ({ label, options, value = [], onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className="w-full relative text-base-content/60 text-sm" ref={ref}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div
        className="border border-base-content/25 rounded-lg px-3 py-2 text-sm cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {value.length > 0
          ? options
              .filter((o) => value.includes(o.value))
              .map((o) => o.label)
              .join(", ")
          : "Select..."}
      </div>

      {open && (
        <div className="absolute mt-1 border border-base-content/25 rounded-lg shadow bg-base-100 max-h-48 overflow-y-auto w-full z-10 p-2">
          {options.map((opt) => (
            <div
              key={opt.value}
              className="flex items-center gap-2 px-2 py-1 hover:bg-base-200 cursor-pointer"
              onClick={() => toggleOption(opt.value)}
            >
              <input
                type="checkbox"
                checked={value.includes(opt.value)}
                readOnly
                className="checkbox checkbox-sm text-sm border-base-content/40"
              />
              <span>{opt.label}</span>
            </div>
          ))}

          {/* Done Button */}
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-indigo-500 text-white text-sm px-3 py-1 rounded-md hover:bg-indigo-600 flex items-center space-x-4"
            >
              <CheckIcon size={15} /> &nbsp; Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
