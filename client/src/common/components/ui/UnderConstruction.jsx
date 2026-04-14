import { Wrench, Rocket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../ui/Button";

const UnderConstruction = () => {
  return (
    <div className="min-h-[calc(100vh-230px)] flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-950 text-white px-6 rounded-md">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="flex justify-center"
        >
          <div className="p-6 rounded-full bg-white/10 backdrop-blur-md shadow-xl">
            <Wrench size={48} className="text-indigo-400" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-extrabold leading-tight"
        >
          This Page is Under Construction 🚧
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-300 text-base md:text-lg leading-relaxed"
        >
          We're working hard to bring this feature to life. Stay tuned —
          something awesome is on the way.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/super-admin">
            <Button variant="indigo" className="flex items-center gap-2">
              <Rocket size={18} />
              Go Home
            </Button>
          </Link>

          <Link to="/super-admin/product-management">
            <Button variant="success" className="flex items-center gap-2">
              Explore Products
              <ArrowRight size={18} />
            </Button>
          </Link>
        </motion.div>

        {/* Footer hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-400 pt-6"
        >
          🚀 Nova Cart — building something better for you
        </motion.div>
      </div>
    </div>
  );
};

export default UnderConstruction;
