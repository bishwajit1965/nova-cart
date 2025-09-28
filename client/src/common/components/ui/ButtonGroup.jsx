import { cn } from "../../lib/utils";

const ButtonGroup = ({ children, className = "" }) => {
  return (
    <div className={cn("inline-flex rounded-md space-x-4 py-4", className)}>
      {children}
    </div>
  );
};

export default ButtonGroup;
