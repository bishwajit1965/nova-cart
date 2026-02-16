import "react-lazy-load-image-component/src/effects/blur.css";

import {
  containerVariants,
  itemVariants,
} from "../../../client/service/animations";
import { useEffect, useState } from "react";

import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import Button from "../ui/Button";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import NoDataFound from "../ui/NoDataFound";
import { motion } from "framer-motion";
import { useApiQuery } from "../../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../utils/hooks/useFetchedDataStatusHandler";
import SectionTitle from "../../utils/sectionTitle/SectionTitle";
import { Layers3Icon } from "lucide-react";

const ShopByCategoriesSection = () => {
  const [visibleCount, setVisibleCount] = useState(4); // show first 8

  const {
    data: categories = [],
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: errorCategory,
  } = useApiQuery({
    url: API_PATHS.CLIENT_CATEGORIES.NON_FEATURED,
    queryKey: API_PATHS.CLIENT_CATEGORIES.NON_FEATURED_KEY,
  });

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  /*** ------> Data fetch status handlers ------> */
  const categoryDataStatus = useFetchedDataStatusHandler({
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: errorCategory,
    label: "categories",
  });

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8, // total animation time
        ease: "easeInOut", // ease in and out
      }}
      className="lg:py-16 py-6 bg-base-200 rounded-md shadow border border-base-content/15"
    >
      <div className="max-w-6xl mx-auto lg:px-6 px-2 text-center text-base-content/70">
        <motion.div variants={itemVariants} className="lg:mb-8 mb-4">
          <SectionTitle
            title="Shop"
            decoratedText="by Category"
            subTitle="Explore different categories"
            icon={<Layers3Icon size={28} />}
            description="Handpicked collections, limited offers, and premium selections made just for you."
          />
        </motion.div>

        <motion.div variants={containerVariants}>
          {categoryDataStatus.status !== "success" ? (
            categoryDataStatus.content
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:gap-6 gap-4">
              {categories.length > 0 ? (
                categories?.slice(0, visibleCount).map((category) => (
                  <Link to={`product-categories?category=${category.slug}`}>
                    <div
                      key={category._id}
                      className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all cursor-pointer"
                    >
                      <LazyLoadImage
                        src={category.featuredImage}
                        alt={category.name}
                        effect="opacity"
                        loading="lazy"
                        className="min-h-44"
                      />

                      <div className="p-4 bg-base-100">
                        <h2 className="text-xl font-bold">{category.name}</h2>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <NoDataFound label="Categories" />
              )}
            </div>
          )}
        </motion.div>
        {visibleCount < categories?.length && (
          <div className="lg:mt-8 mt-4 text-center" variants={itemVariants}>
            <Button onClick={handleLoadMore} variant="outline" className="mt-4">
              Load More
            </Button>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default ShopByCategoriesSection;
