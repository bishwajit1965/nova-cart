import { CheckCircle, RocketIcon, ShoppingBag } from "lucide-react";
import Button from "../ui/Button";
import { motion } from "framer-motion";
import SocialMediaLinks from "../../utils/socialMediaLinks/SocialMediaLinks";
import HeroImage from "../../../assets/heroImage/Nova-Cart-Hero-BG.png";

const statsData = [
  { value: 1200, label: "Happy Customers" },
  { value: 500, label: "Products" },
  { value: 99, label: "Delivery Success" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
};

const TopHeroSection = () => {
  return (
    <section className="relative min-h-screen w-full">
      <div className="bg-[url(./assets/heroImage/Nova-Cart_Hero-Image.png)] rounded-xl min-h-screen bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs-disabled rounded-xl"></div>
        <div className="flex max-w-7xl mx-auto min-h-screen items-center justify-center lg:py-20 py-10">
          <div className="grid lg:grid-cols-12 gird-cols-1 lg:gap-10 gap-5 justify-center z-10">
            {/* LEFT SIDE CONTENT */}
            <div className="lg:col-span-6 col-span-12 lg:p-0 p-2">
              <motion.div
                className="text-white lg:space-y-6 space-y-3 lg:col-span-6 col-span-12"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.h1
                  className="text-xl lg:text-5xl font-extrabold leading-tight drop-shadow-md"
                  variants={itemVariants}
                >
                  Your Trusted Online Marketplace{" "}
                  <span className="block bg-gradient-to-r from-indigo-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                    Nova-Cart
                  </span>
                </motion.h1>

                <motion.p
                  className="text-base lg:text-lg opacity-90 leading-relaxed max-w-lg"
                  variants={itemVariants}
                >
                  Shop Smarter. Experience Faster. Premium-quality products,
                  transparent policies, and a smooth shopping journey — all in
                  one place.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-wrap gap-4"
                  variants={itemVariants}
                >
                  <Button
                    variant="success"
                    size="lg"
                    href="/product-categories"
                    className="lg:w-44 w-full"
                  >
                    <RocketIcon size={18} /> View categories
                  </Button>

                  <Button
                    href="/client-cart-management"
                    variant="primary"
                    size="lg"
                    className="lg:w-44 w-full"
                  >
                    <ShoppingBag size={18} /> Buy Products
                  </Button>
                </motion.div>

                {/* Policies List */}
                <motion.ul className="space-y-2 mt-4" variants={itemVariants}>
                  {[
                    "100% Secure Online Shopping",
                    "Fast Delivery Across Bangladesh",
                    "Dedicated Customer Support",
                    "Authentic & Quality-Assured Products",
                    "Easy Return & Refund Policy",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-2 text-sm lg:text-base"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 150 }}
                    >
                      <CheckCircle size={18} className="text-indigo-400" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* Social Media Links */}
                <motion.div variants={itemVariants}>
                  <SocialMediaLinks />
                </motion.div>
              </motion.div>
            </div>
            {/* RIGHT SIDE CONTENT */}
            <div className="lg:col-span-6 col-span-12 flex items-center lg:justify-end justify-center lg:p-0 p-2">
              {/* RIGHT SIDE: Animated Circle Stats */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1, type: "spring", stiffness: 120 }}
                className="bg-white/10 border border-white/20
               rounded-full backdrop-blur-md shadow-2xl
               flex flex-col justify-center items-center
               lg:h-96 lg:w-96 w-72 h-72 text-white
              "
              >
                {statsData.map((stat, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center space-y-1 lg:space-y-2 text-center my-2"
                  >
                    <span className="lg:text-3xl text-2xl font-bold">
                      {stat.value}+
                    </span>
                    <span className="text-sm lg:text-lg opacity-90">
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
      </div>
    </section>
  );
};

export default TopHeroSection;
