import { Construction } from "lucide-react";

const SuperAdminUnderConstructionSection = ({
  title = "This section is under construction",
  message = "We’re working behind the scenes to bring this feature to life. Check back soon! Thank you.",
}) => {
  return (
    <div className="flex items-center justify-center min-h-[300px] w-full px-4 lg:min-w-5xl">
      <div className="max-w-md text-center bg-base-200 border border-base-300 rounded-xl p-6 shadow-sm hover:shadow-xl">
        <div className="flex justify-center mb-4">
          <Construction className="w-10 h-10 text-primary animate-pulse" />
        </div>

        <h2 className="text-lg font-semibold text-base-content mb-2">
          {title}
        </h2>

        <p className="text-sm text-base-content/70 leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
};

export default SuperAdminUnderConstructionSection;
