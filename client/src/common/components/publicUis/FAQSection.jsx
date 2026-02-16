import {
  containerVariants,
  itemVariants,
} from "../../../client/service/animations";

import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import { LucideIcon } from "../../lib/LucideIcons";
import { motion } from "framer-motion";
import { useApiQuery } from "../../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";
import { FaQuestion, FaQuestionCircle } from "react-icons/fa";
import SectionTitle from "../../utils/sectionTitle/SectionTitle";

const FAQSection = () => {
  /*** ------> Faq data fetched ------> */
  const {
    data: faqs,
    isLoading: isLoadingFaqs,
    isError: isErrorFaqs,
    error: errorFaqs,
  } = useApiQuery({
    url: `${API_PATHS.CLIENT_FAQ.CLIENT_FAQ_ENDPOINT}/all-faqs`,
    queryKey: API_PATHS.CLIENT_FAQ.CLIENT_FAQ_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** Use data fetch status Handler */
  const faqDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingFaqs,
    isError: isErrorFaqs,
    error: errorFaqs,
    label: "Faq",
  });
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (faqDataStatus.status !== "success") return faqDataStatus.content;

  return (
    <motion.section
      className="lg:py-20 py-4 bg-base-200 rounded-md shadow border border-base-content/15"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
    >
      <motion.div
        className="max-w-4xl mx-auto lg:px-6 px-2"
        variants={itemVariants}
      >
        <motion.div variants={itemVariants} className="lg:mb-8 mb-4">
          <SectionTitle
            title="Frequently"
            decoratedText="Asked Questions"
            subTitle="Explore your question & our answer"
            icon={<FaQuestionCircle size={28} />}
            description="Relevant questions have been answered here. Just explore to know in details."
          />
        </motion.div>

        <motion.div className="space-y-4" variants={itemVariants}>
          {faqs?.map((faq, idx) => (
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
