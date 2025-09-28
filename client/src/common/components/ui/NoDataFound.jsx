import { AlertTriangleIcon } from "lucide-react";

const NoDataFound = ({ label }) => {
  return (
    <div className="flex justify-center lg:min-h-96 h-24">
      <div className="flex items-center">
        <div className="">
          <div className="flex justify-center items-center">
            <AlertTriangleIcon size={30} className="text-red-600" />
          </div>
          <div className="flex items-center space-x-2 lg:pb-4 pb-3">
            <p className="text-red-500 font-bold lg:flex grid items-center font-serif space-x-2">
              <span className="lg:text-xl text-sm font-extrabold text-center animate-pulse">
                404 ERROR !
              </span>{" "}
              <span>{`${label} not found.`}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoDataFound;
