// src/components/ui/SplashScreen.jsx

import { Loader } from "lucide-react";

const SplashScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader size={48} className="animate-spin text-primary" />
  </div>
);

export default SplashScreen;
