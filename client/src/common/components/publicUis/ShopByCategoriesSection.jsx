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

const ShopByCategoriesSection = () => {
  const [categoriesData, setCategoriesData] = useState([]);
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

  useEffect(() => {
    if (categories.length > 0) setCategoriesData(categories);
  }, [categories]);

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
      className="lg:py-16 py-6 bg-base-200 rounded-md shadow"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto lg:px-6 px-2 text-center text-base-content/70">
        <h2 className="lg:text-3xl text-xl font-extrabold lg:mb-8 mb-4">
          Shop by Category
        </h2>
        <motion.div className="" variants={itemVariants}>
          {categoryDataStatus.status !== "success" ? (
            categoryDataStatus.content
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:gap-6 gap-4">
              {categoriesData.length > 0 ? (
                categoriesData.slice(0, visibleCount).map((category, idx) => (
                  <Link
                    to={`product-categories?category=${category.slug}`}
                    key={idx}
                  >
                    <motion.div
                      key={idx}
                      className="rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all cursor-pointer"
                      variants={itemVariants}
                    >
                      <LazyLoadImage
                        src={category.featuredImage}
                        alt={category.name}
                        effect="blur"
                        threshold={100}
                        delayTime={300}
                        wrapperProps={{
                          // If you need to, you can tweak the effect transition using the wrapper style.
                          style: { transitionDelay: "1s" },
                        }}
                      />

                      <div className="p-4 bg-base-100">
                        <h3 className="text-lg font-medium">{category.name}</h3>
                      </div>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <NoDataFound label="Categories" />
              )}
            </div>
          )}
        </motion.div>
        {visibleCount < categoriesData?.length && (
          <motion.div
            className="lg:mt-8 mt-4 text-center"
            variants={itemVariants}
          >
            <Button onClick={handleLoadMore} variant="outline" className="mt-4">
              Load More
            </Button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default ShopByCategoriesSection;
