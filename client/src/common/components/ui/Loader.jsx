import { Loader as LoaderIcon } from "lucide-react";

const Loader = ({
  size = 48,
  color = "currentColor",
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <LoaderIcon className="animate-spin" size={size} color={color} />
      <span className="text-lg font-medium text-gray-700">{message}</span>
    </div>
  );
};

export default Loader;
