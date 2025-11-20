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

const ProductsListSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleProductsCount, setVisibleProductsCount] = useState(9);

  /*** ------> Products data fetched ------> */
  const {
    data: products,
    isLoadingProducts,
    isErrorProducts,
    errorProducts,
  } = useApiQuery({
    url: API_PATHS.CLIENT_PRODUCTS.CLIENT_ENDPOINT,
    queryKey: API_PATHS.CLIENT_PRODUCTS.CLIENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const filteredProducts = (products || []).filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleFilteredProducts = filteredProducts.slice(
    0,
    visibleProductsCount
  );

  const handleLoadMoreProducts = () => {
    setVisibleProductsCount((prevCount) => prevCount + 9);
  };

  const handleLoadLessProducts = () => {
    setVisibleProductsCount((prevCount) => prevCount - 9);
  };

  /*** ------> Data fetch status handlers ------> */
  const productsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
    label: "Products",
  });

  return (
    <div className="bg-base-200 text-base-content/70 lg:p-15 p-2 shadow border border-base-content/15">
      <div className="lg:pb-8 pb-4">
        <h2 className="lg:text-3xl font-extrabold text-center">
          🚙Our Products
        </h2>
      </div>
      <div className="max-w-lg mx-auto lg:pb-8 pn-4">
        <div className="flex items-center gap-2">
          <Input
            icon={LucideIcon.Search}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full border rounded-full px-3 py-2 focus:outline-indigo-500"
          />
          {searchTerm && (
            <Button
              onClick={() => setSearchTerm("")}
              variant="defaultRounded"
              className=""
            >
              <CheckCircleIcon size={18} /> Clear
            </Button>
          )}
        </div>
      </div>
      <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-6 gap-2 justify-between">
        {productsDataStatus.status !== "success" ? (
          productsDataStatus.content
        ) : (visibleFilteredProducts || []).length === 0 ? (
          <div className="text-xl font-bold text-center w-full col-span-12">
            <NoDataFound label="Product" />
          </div>
        ) : (
          (visibleFilteredProducts || []).map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))
        )}
        <div className="flex w-full justify-center col-span-12">
          {visibleProductsCount < filteredProducts.length && (
            <div className="text-center mt-4">
              <Button
                onClick={handleLoadMoreProducts}
                icon={LucideIcon.ChevronDown}
                variant="indigoRounded"
                className="border-none"
              >
                Load More Products
              </Button>
            </div>
          )}
          {visibleProductsCount > filteredProducts.length && (
            <div className="text-center mt-4">
              <Button
                onClick={handleLoadLessProducts}
                icon={LucideIcon.ChevronUp}
                variant="successRounded"
                className="border-none"
              >
                Load Less Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsListSection;
