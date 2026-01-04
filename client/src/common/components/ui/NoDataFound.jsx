import { AlertTriangleIcon } from "lucide-react";

const NoDataFound = ({ label }) => {
  return (
    <div className="flex justify-center lg:py-6 py-4 bg-base-200/70 rounded-lg border border-base-content/10 shadow-xs hover:shadow-md">
      <div className="flex items-center">
        <div className="">
          <div className="flex justify-center items-center">
            <AlertTriangleIcon size={25} className="text-red-600" />
          </div>
          <div className="flex items-center flex-wrap space-x-2">
            <p className="text-red-500 font-bold lg:flex flex-wrap grid items-center overflow-hidden font-serif space-x-2 justify-center">
              <span className="lg:text-xl text-sm font-bold text-center animate-pulse">
                404 ERROR !
              </span>{" "}
              <span>{`${label} not available ! Try later.`}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoDataFound;
