import {
  containerVariants,
  itemVariants,
} from "../../../client/service/animations";

import { motion } from "framer-motion";

const PromoSection = () => {
  return (
    <motion.section
      className="py-12 bg-primary text-white rounded-md shadow"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold mb-2">
            🎉 Big Sale: Up to 50% Off!
          </h2>
          <p className="text-lg">
            Limited-time offer. Shop your favorites before they're gone.
          </p>
        </motion.div>
        <motion.a
          href="/client-cart-management"
          className="bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          variants={itemVariants}
        >
          Shop Now
        </motion.a>
      </div>
    </motion.section>
  );
};

export default PromoSection;
