import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import { CheckCircleIcon } from "lucide-react";
import { Input } from "../../common/components/ui/Input";
import NoDataFound from "../../common/components/ui/NoDataFound";
import ProductCard from "./ProductCard";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";
import { LucideIcon } from "../../common/lib/LucideIcons";
import { motion, AnimatePresence } from "framer-motion";

const ProductsListSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleProductsCount, setVisibleProductsCount] = useState(9);

  // Fetch products
  const {
    data: products,
    isLoadingProducts,
    isErrorProducts,
    errorProducts,
  } = useApiQuery({
    url: API_PATHS.CLIENT_PRODUCTS.CLIENT_ENDPOINT,
    queryKey: API_PATHS.CLIENT_PRODUCTS.CLIENT_KEY,
    options: { staleTime: 0, refetchOnWindowFocus: true },
  });

  const filteredProducts = (products || []).filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleFilteredProducts = filteredProducts?.slice(
    0,
    visibleProductsCount
  );

  const handleLoadMoreProducts = () =>
    setVisibleProductsCount((prev) => prev + 9);

  const handleLoadLessProducts = () =>
    setVisibleProductsCount((prev) => prev - 9);

  const productsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
    label: "Products",
  });

  return (
    <div className="bg-base-200 text-base-content/70 lg:p-15 p-2 shadow border border-base-content/15 rounded-lg">
      <div className="bg-base-300 rounded-lg lg:p-8 p-4 lg:mb-12 mb-6 shadow">
        <div className="lg:pb-8 pb-4">
          <h2 className="lg:text-3xl text-lg font-extrabold justify-center flex items-center gap-2">
            🚙 Our Products{" "}
            <span className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-base-100 text-[18px] font-bold p-1 text-white flex items-center justify-center shadow-sm">
              {products ? products?.length : 0}
            </span>
          </h2>
        </div>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto lg:pb-8 pb-4 flex items-center gap-2">
          <Input
            icon={LucideIcon.Search}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full border rounded-full px-3 py-2 focus:outline-indigo-500"
          />
          {searchTerm && (
            <Button onClick={() => setSearchTerm("")} variant="defaultRounded">
              <CheckCircleIcon size={18} /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-6 gap-4 justify-between">
        {productsDataStatus.status !== "success" ? (
          productsDataStatus.content
        ) : visibleFilteredProducts.length === 0 ? (
          <div className="text-xl font-bold text-center w-full col-span-12">
            <NoDataFound label="Product" />
          </div>
        ) : (
          <AnimatePresence>
            {visibleFilteredProducts.map((product, idx) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ scale: 1.03 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Load More / Less Buttons */}
      <div className="flex w-full justify-center mt-10 gap-4">
        {visibleProductsCount < filteredProducts?.length && (
          <Button
            onClick={handleLoadMoreProducts}
            icon={LucideIcon.ChevronDown}
            variant="indigoRounded"
          >
            Load More
          </Button>
        )}
        {visibleProductsCount > 9 && (
          <Button
            onClick={handleLoadLessProducts}
            icon={LucideIcon.ChevronUp}
            variant="successRounded"
          >
            Load Less
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductsListSection;
