import { containerVariants, itemVariants } from "../../service/animations";

import CountUp from "react-countup";
import { motion } from "framer-motion";

const FunFacts = () => {
  const facts = [
    { label: "Products Sold", value: 1200 },
    { label: "Happy Clients", value: 350 },
    { label: "Years of Experience", value: 3 },
    { label: "Team Members", value: 5 },
  ];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
      className="bg-base-100 text-center"
    >
      <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-8 gap-4">
        {facts.map((fact, idx) => (
          <motion.div
            key={idx}
            className="lg:col-span-3 col-span-12 bg-base-100 shadow-md hover:shadow-xl rounded-2xl lg:p-6 p-2"
            variants={itemVariants}
          >
            <h3 className="text-4xl font-extrabold text-indigo-600">
              <CountUp end={fact.value} duration={3} />+
            </h3>
            <p className="mt-2 text-base-content/70">{fact.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default FunFacts;
