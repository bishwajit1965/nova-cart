import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
} from "../../../client/service/animations";
import SectionTitle from "../../utils/sectionTitle/SectionTitle";
import { FileQuestionMarkIcon } from "lucide-react";

const features = [
  {
    icon: "🚚",
    title: "Fast & Free Shipping",
    description: "Get your orders delivered quickly, without extra charges.",
  },
  {
    icon: "💳",
    title: "Secure Payment",
    description: "We use trusted gateways to protect your transactions.",
  },
  {
    icon: "📞",
    title: "24/7 Support",
    description: "Our team is available round-the-clock to assist you.",
  },
  {
    icon: "🔄",
    title: "Easy Returns",
    description: "Hassle-free 7-day return policy on most products.",
  },
];

const WhyChooseUsSection = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
      className="lg:py-16 py-6 bg-base-200 text-base-content rounded-md shadow border border-base-content/15"
    >
      <div className="max-w-6xl mx-auto lg:px-6 px-2 text-center text-base-content/70">
        <motion.div variants={itemVariants} className="lg:mb-8 mb-4">
          <SectionTitle
            icon={<FileQuestionMarkIcon size={28} />}
            title="Why Choose"
            subTitle="Explore reasons to choose Nova Cart"
            decoratedText="Nova-Cart?"
            description="Handpicked collections, limited offers, and premium selections made just for you."
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {features.map((item) => (
            <div
              key={item._id}
              className="bg-base-100 lg:p-6 p-2 rounded-2xl shadow hover:shadow-md transition"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-base-content">{item.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhyChooseUsSection;
