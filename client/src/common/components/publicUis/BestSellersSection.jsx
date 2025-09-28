import {
  containerVariants,
  itemVariants,
} from "../../../client/service/animations";

import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import { Link } from "react-router-dom";
import NoDataFound from "../ui/NoDataFound";
import { motion } from "framer-motion";
import { useApiQuery } from "../../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../utils/hooks/useFetchedDataStatusHandler";

const BestSellersSection = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const {
    data: bestSellers = [],
    isLoading: isLoadingBestSellers,
    isError: isErrorBestSellers,
    error: errorBestSellers,
  } = useApiQuery({
    url: `${API_PATHS.CLIENT_BEST_SELLER_PRODUCTS.CLIENT_BEST_SELLER_ENDPOINT}?limit=8`,
    queryKey: API_PATHS.CLIENT_BEST_SELLER_PRODUCTS.CLIENT_BEST_SELLER_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** Data fetch status handlers */
  const bestSellersDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingBestSellers,
    isError: isErrorBestSellers,
    error: errorBestSellers,
    label: "best sellers",
  });

  return (
    <motion.section
      className="lg:py-16 py-6 bg-base-200 rounded-md shadow"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
    >
      <motion.div
        className="max-w-6xl mx-auto lg:px-6 px-2 text-center text-base-content/70"
        variants={itemVariants}
      >
        <motion.h2
          className="lg:text-3xl text-xl font-extrabold lg:mb-8 mb-4"
          variants={itemVariants}
        >
          Best Sellers
        </motion.h2>
        {bestSellersDataStatus.status !== "success" ? (
          bestSellersDataStatus.content
        ) : bestSellers.length === 0 ? (
          <NoDataFound label="Best-sellers" />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:gap-6 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={containerVariants}
          >
            {bestSellers?.map((product) => (
              <Link
                to={`/product-details/${product.productId}`}
                key={product.productId}
              >
                <motion.div
                  key={product.productId}
                  className="bg-base-100 rounded-2xl shadow hover:shadow-lg transition-all"
                  variants={itemVariants}
                >
                  {product?.image ? (
                    <motion.img
                      src={product?.image ? product.image : product.images[0]}
                      alt={product?.name}
                      className="h-36 object-contain w-full"
                      variants={itemVariants}
                    />
                  ) : (
                    product.images[0] && (
                      <motion.img
                        src={`${apiURL}${
                          product.images[0].startsWith("/") ? "" : "/"
                        }${product.images[0]}`}
                        alt={product.name || ""}
                        className="h-36 object-contain w-full"
                        variants={itemVariants}
                      />
                    )
                  )}
                  <motion.div className="p-4" variants={itemVariants}>
                    <h3 className="text-xl font-semibold mb-2">
                      {product.name}
                    </h3>
                    <p>{product.description}</p>
                    <p className="text-primary font-bold">$ {product.price}</p>
                  </motion.div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
};

export default BestSellersSection;
