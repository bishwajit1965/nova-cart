import { CheckCircle, RocketIcon, ShoppingBag } from "lucide-react";
import Button from "../ui/Button";
import { motion, useAnimation } from "framer-motion";
import SocialMediaLinks from "../../utils/socialMediaLinks/SocialMediaLinks";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const statsData = [
  { value: 1200, label: "Happy Customers" },
  { value: 500, label: "Products" },
  { value: 99, label: "Delivery Success" },
];

const TopHeroSection = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ scale: 1, opacity: 0.9 });
  }, [controls]);

  return (
    <section className="relative w-full min-h-[60vh] bg-[url('/online-shop-7089820_1920.png')] bg-cover bg-center rounded-xl shadow-2xl overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-10 gap-5 items-center">
          {/* LEFT SIDE CONTENT */}
          <div className="text-white space-y-6 lg:col-span-6 col-span-12">
            <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight drop-shadow-md">
              Your Trusted Online Marketplace
              <span className="block text-indigo-300">Nova-Cart</span>
            </h1>

            <p className="text-base lg:text-lg opacity-90 leading-relaxed">
              Shop smarter, faster, and with complete confidence.
              Premium-quality products, transparent policies, and a smooth
              shopping journey — all in one place.
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap gap-4">
              <Link to="/client-cart-management">
                <Button
                  variant="indigo"
                  className="btn btn-md flex items-center gap-2"
                >
                  <RocketIcon size={18} /> Start Shopping
                </Button>
              </Link>

              <Button
                variant="default"
                className="btn btn-md flex items-center gap-2"
              >
                <ShoppingBag size={18} /> View Deals
              </Button>
            </div>

            {/* POLICIES LIST */}
            <ul className="space-y-2 mt-4">
              {[
                "100% Secure Online Shopping",
                "Fast Delivery Across Bangladesh",
                "Dedicated Customer Support",
                "Authentic & Quality-Assured Products",
                "Easy Return & Refund Policy",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm lg:text-base"
                >
                  <CheckCircle size={18} className="text-indigo-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Social Medial Links */}
            <SocialMediaLinks />
          </div>

          {/* RIGHT SIDE: Animated Circle Stats */}
          <div className="hidden lg:flex lg:col-span-6 justify-center items-center relative">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 1, type: "spring", stiffness: 120 }}
              className="bg-white/10 border border-white/20
               rounded-full backdrop-blur-md shadow-2xl
               flex flex-col justify-center items-center
               h-96 w-96 text-white
               animate-[spin_40s_linear_infinite]"
            >
              {statsData.map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center space-y-1 lg:space-y-2 text-center my-2"
                >
                  <span className="text-3xl font-bold">{stat.value}+</span>
                  <span className="text-xs lg:text-sm opacity-90">
                    {stat.label}
                  </span>
                </div>
              ))}
              <span className="text-xs lg:text-sm font-semibold mt-4">
                🔒 Secured Payments
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopHeroSection;
