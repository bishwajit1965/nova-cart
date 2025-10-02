import { containerVariants, itemVariants } from "../../service/animations";

import { motion } from "framer-motion";

const FounderNote = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
      className="lg:py-12 bg-base-200 rounded-md text-center"
    >
      <motion.h2
        className="lg:text-3xl text-xl font-bold mb-6"
        variants={itemVariants}
      >
        👤 Meet the Founder
      </motion.h2>
      <motion.div
        className="max-w-2xl mx-auto bg-base-100 shadow-md rounded-2xl lg:p-8 p-4 hover:shadow-xl"
        variants={itemVariants}
      >
        <motion.img
          src="bishwajit-1.jpg"
          alt="Founder"
          className="w-28 h-28 rounded-full mx-auto mb-4 object-cover"
          variants={itemVariants}
        />
        <motion.h3 className="text-xl font-semibold" variants={itemVariants}>
          Bishwajit Paul
        </motion.h3>
        <motion.p
          className="mt-4 text-gray-600 leading-relaxed"
          variants={itemVariants}
        >
          “Nova-Cart started as a dream project to build a scalable and modern
          e-commerce platform. My mission is to blend technology and creativity
          to deliver the best shopping experiences.”
        </motion.p>
      </motion.div>
    </motion.section>
  );
};

export default FounderNote;
