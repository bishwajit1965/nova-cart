import { containerVariants, itemVariants } from "../service/animations";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import { Link } from "react-router-dom";
import { LucideIcon } from "../../common/lib/LucideIcons";
import { motion } from "framer-motion";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const RandomProductsSection = () => {
  const limit = 8;
  /*** ------> Products data fetched ------> */
  const {
    data: randomProducts,
    isLoadingProducts,
    isErrorProducts,
    errorProducts,
  } = useApiQuery({
    url: `${API_PATHS.CLIENT_PRODUCTS.CLIENT_ENDPOINT}/random?limit=${limit}`,
    queryKey: API_PATHS.CLIENT_PRODUCTS.CLIENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const randomProductsData = randomProducts
    ? [...randomProducts]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(limit, randomProducts.length))
    : [];

  /** -------- Use Fetched Data Status Handler -------- */
  const randomProductsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
    label: "Random products",
  });

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
      // initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8, // total animation time
        ease: "easeInOut", // ease in and out
      }}
      className="lg:py-16 py-6 bg-base-200 text-base-content rounded-md shadow"
    >
      {randomProductsDataStatus.status !== "success" ? (
        randomProductsDataStatus.content
      ) : (
        <motion.div
          className="max-w-6xl mx-auto lg:px-6 px-2 text-center text-base-content/70"
          variants={itemVariants}
        >
          <motion.h2
            className="lg:text-3xl text-xl font-extrabold text-center lg:mb-8 mb-4"
            variants={itemVariants}
          >
            Discover Something New{" "}
            {randomProducts?.length > 0 ? randomProducts?.length : "0"} ✨
          </motion.h2>
          <motion.div
            className="grid lg:grid-cols-12 grid-cols-1 md:grid-cols-4 lg:gap-6 gap-4 justify-between"
            variants={itemVariants}
          >
            {randomProductsData?.map((p) => (
              <div
                key={p._id}
                className="lg:col-span-3 col-span-12 relative group border border-base-content/15 rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-base-100"
              >
                <img
                  src={`${apiURL}${p?.images?.[0]}`}
                  alt={p?.name}
                  className="w-full h-48 object-contain"
                />
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <div className="space-y-2">
                    <div className="">
                      <h2 className="test-xl font-bold text-base-100">
                        {p?.name} ➡️ {p?.brand}
                      </h2>
                      <p className="test-xl font-bold text-base-100">
                        Price: {p.price.toFixed(2)}
                      </p>
                    </div>
                    <Link
                      to={`/product-details/${p?._id}`}
                      className="bg-white text-indigo-600 px-3 py-1 rounded font-semibold flex items-center space-x-2 w-max mx-auto"
                    >
                      <LucideIcon.EyeIcon size={20} />{" "}
                      <span> View Details </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
};

export default RandomProductsSection;
