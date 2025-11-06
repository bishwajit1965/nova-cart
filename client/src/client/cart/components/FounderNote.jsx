import { containerVariants, itemVariants } from "../../service/animations";

import { motion } from "framer-motion";

const FounderNote = ({ aboutFounder }) => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
      className="lg:py-12 bg-base-200 rounded-md text-center"
    >
      {aboutFounder?.map((founder) => (
        <div className="">
          <h2 className="lg:text-3xl text-xl font-bold mb-6">
            👤 {founder.title}
          </h2>
          <div className="max-w-2xl mx-auto bg-base-100 shadow-md rounded-2xl lg:p-8 p-4 hover:shadow-xl">
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/${founder.image}`}
              alt="Founder"
              className="w-28 h-28 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold">{founder.extraData}</h3>
            <p className="mt-4 text-gray-600 leading-relaxed">
              {founder.content}
            </p>
          </div>
        </div>
      ))}
    </motion.section>
  );
};

export default FounderNote;
