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
      className="lg:py-16 py-6 bg-base-200 rounded-md shadow border border-base-content/15"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto lg:px-6 px-2 text-center text-base-content/70">
        <motion.h2
          className="lg:text-3xl text-xl font-extrabold lg:mb-8 mb-4"
          variants={itemVariants}
        >
          🚀 Featured Categories
        </motion.h2>
        <div className="grid lg:gap-6 gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCategories?.map((feature, idx) => (
            <Link to={`product-categories?category=${feature.slug}`} key={idx}>
              <motion.div
                key={idx}
                className="bg-base-100 text-base-content/70 rounded-2xl shadow hover:shadow-lg transition-all space-y-4"
                variants={itemVariants}
              >
                {feature.featuredImage && (
                  <div className="">
                    <LazyLoadImage
                      src={feature.featuredImage}
                      alt={feature.name}
                      effect="blur"
                      threshold={100}
                      delayTime={300}
                      wrapperProps={{
                        style: { transitionDelay: "1s" },
                      }}
                      className="h-40 object-cover w-full rounded-t-2xl"
                    />
                  </div>
                )}
                <motion.div
                  className="text-base-content/70 space-y-2 p-4"
                  variants={itemVariants}
                >
                  <h2 className="text-xl font-bold">{feature.name}</h2>
                  <p>{feature.description}</p>
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedCategoriesSection;
