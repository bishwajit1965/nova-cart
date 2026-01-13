import {
  containerVariants,
  itemVariants,
} from "../../../client/service/animations";

import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import { Link } from "react-router-dom";
import NoDataFound from "../ui/NoDataFound";
import { motion } from "framer-motion";
import textShortener from "../../../utils/textShortener";
import { useApiQuery } from "../../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";

const BestSellersSection = () => {
  const [isExtended, setIsExtended] = useState(false);
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const bestSellerIds = [];

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

  // Pushing IDS into an empty array -> ids
  for (const data of bestSellers) {
    bestSellerIds.push(data.productId);
  }

  console.log("Best seller Ids", bestSellerIds);

  /*** Data fetch status handlers */
  const bestSellersDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingBestSellers,
    isError: isErrorBestSellers,
    error: errorBestSellers,
    label: "best sellers",
  });

  return (
    <motion.section
      className="lg:py-16 py-6 bg-base-200 rounded-md shadow border border-base-content/15"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
    >
      <motion.div
        className="max-w-6xl mx-auto lg:px-6 px-2 text-center text-base-content/70"
        variants={itemVariants}
      >
        <h2
          className="lg:text-3xl text-xl font-extrabold lg:mb-8 mb-4"
          variants={itemVariants}
        >
          🛒 Best Sellers
        </h2>
        {bestSellersDataStatus.status !== "success" ? (
          bestSellersDataStatus.content
        ) : bestSellers.length === 0 ? (
          <NoDataFound label="Best-sellers" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:gap-6 gap-4">
            {bestSellers.length > 0 ? (
              bestSellers?.map((product) => (
                <Link
                  to={`/product-details/${product.productId}`}
                  key={product.productId}
                >
                  <div
                    key={product.productId}
                    className="bg-base-100 rounded-2xl shadow hover:shadow-lg transition-all"
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
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">
                        {product.name}
                      </h3>

                      <p className="text-justify">
                        {isExtended
                          ? product?.description
                          : textShortener(product?.description, 60)}
                      </p>
                      <p className="text-primary font-bold">
                        $ {product.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <NoDataFound label={"Best sellers data"} />
            )}
          </div>
        )}
      </motion.div>
    </motion.section>
  );
};

export default BestSellersSection;
