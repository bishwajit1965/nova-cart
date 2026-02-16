import "react-lazy-load-image-component/src/effects/blur.css";

import {
  containerVariants,
  itemVariants,
} from "../../../client/service/animations";

import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useApiQuery } from "../../../superAdmin/services/hooks/useApiQuery";
import SectionTitle from "../../utils/sectionTitle/SectionTitle";
import { RocketIcon } from "lucide-react";

const FeaturedCategoriesSection = () => {
  const { data: categories = [], isLoading } = useApiQuery({
    url: API_PATHS.CATEGORIES.ENDPOINT,
    queryKey: API_PATHS.CATEGORIES.KEY,
  });

  const featuredCategories = categories.filter((cat) => cat.featured);

  if (isLoading) return <p className="text-center">Loading...</p>;

  if (!featuredCategories.length)
    return <p className="text-center text-gray-500">No featured categories.</p>;

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8, // total animation time
        ease: "easeInOut", // ease in and out
      }}
      className="lg:py-16 py-6 bg-base-200 rounded-md shadow border border-base-content/15"
    >
      <motion.div
        variants={containerVariants}
        className="max-w-6xl mx-auto lg:px-6 px-2 text-center text-base-content/70"
      >
        <motion.div variants={itemVariants} className="lg:mb-8 mb-4">
          <SectionTitle
            title="Featured"
            decoratedText="Categories"
            subTitle="Explore different features & categories"
            icon={<RocketIcon size={28} />}
            description="Handpicked collections, limited offers, and premium selections made just for you."
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:gap-6 gap-4"
        >
          {featuredCategories?.map((feature) => (
            <Link to={`product-categories?category=${feature.slug}`}>
              <div
                key={feature._id}
                className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all cursor-pointer"
              >
                {feature?.featuredImage && (
                  <LazyLoadImage
                    src={feature.featuredImage}
                    alt={feature.name}
                    effect="opacity"
                    loading="lazy"
                    className="min-h-44"
                  />
                )}
                <div className="text-base-content/70 space-y-2 p-4">
                  <h2 className="text-xl font-bold">{feature.name}</h2>
                  <p>{feature.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default FeaturedCategoriesSection;
