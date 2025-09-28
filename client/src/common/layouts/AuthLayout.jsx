import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300">
      <div className="lg:min-w-xs mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
