import {
  containerVariants,
  itemVariants,
} from "../../../client/service/animations";

import { LucideIcon } from "../../lib/LucideIcons";
import { motion } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    question: "What is Nova-Cart?",
    answer:
      "Nova-Cart is a fully-featured e-commerce platform designed to provide seamless online shopping experiences.",
  },
  {
    question: "How do I track my orders?",
    answer:
      "Once you place an order, you can track it in your account dashboard under 'My Orders'. You will also receive email updates.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept Bkash, Rocket, credit/debit cards, and all popular online payment methods supported in Bangladesh.",
  },
  {
    question: "Can I return or exchange products?",
    answer:
      "Yes! Products can be returned or exchanged within 7 days of delivery. Please check our Return Policy for more details.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach our support team via email at support@nova-cart.com or through the live chat on the website.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <motion.section
      className="lg:py-20 py-4 bg-base-200 rounded-md shadow"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
    >
      <motion.div
        className="max-w-4xl mx-auto lg:px-6 px-2"
        variants={itemVariants}
      >
        <motion.h2
          className="text-xl lg:text-3xl font-extrabold text-center lg:mb-8 mb-4 text-base-content/70"
          variants={itemVariants}
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.div className="space-y-4" variants={itemVariants}>
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              className="bg-base-100 rounded-lg shadow-sm border border-base-content/15"
              variants={itemVariants}
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-lg focus:outline-none"
              >
                {faq.question}
                <span
                  className={`transform transition-transform duration-300 ${
                    activeIndex === idx
                      ? "rotate-180 text-primary"
                      : "rotate-0 text-gray-500"
                  }`}
                >
                  <LucideIcon.ChevronDown size={20} />
                </span>
              </button>
              <div
                className={`px-6 pb-4 text-gray-600 text-base transition-all duration-500 overflow-hidden ${
                  activeIndex === idx
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p>{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default FAQSection;
