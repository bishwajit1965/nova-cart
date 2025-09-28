import { Link, useSearchParams } from "react-router-dom";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import NoDataFound from "../../common/components/ui/NoDataFound";
import PageMeta from "../../common/components/ui/PageMeta";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import { useState } from "react";

const CategoriesPage = () => {
  const pageTile = usePageTitle();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedBrand, setSelectedBrand] = useState("All Brands");

  // Filters from URL
  const categorySlug = searchParams.get("category") || "";
  const subCategorySlug = searchParams.get("subCategory") || "";
  const brandFilter = searchParams.get("brand") || "All Brands";
  const minPrice = parseFloat(searchParams.get("minPrice")) || 0;
  // Always define the current filters from searchParams
  const maxPrice = parseFloat(searchParams.get("maxPrice")) || Infinity;

  // Local UI state synced to URL
  useEffect(() => {
    setSelectedCategory(categorySlug || null);
    setSelectedBrand(brandFilter);
    setPriceRange({ min: minPrice, max: maxPrice });
  }, [categorySlug, brandFilter, minPrice, maxPrice]);

  /*** -----> Fetch Categories Query -----> */
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = useApiQuery({
    url: API_PATHS.CLIENT_CATEGORIES.CLIENT_CATEGORIES_ENDPOINT,
    queryKey: API_PATHS.CLIENT_CATEGORIES.CLIENT_CATEGORIES_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  console.log("All categories", categories);

  /*** -----> Fetch sub_Categories Query -----> */
  const {
    data: subCategories,
    isLoading: isLoadingSubCategories,
    isError: isErrorSubCategories,
    error: errorSubCategories,
  } = useApiQuery({
    url: API_PATHS.CLIENT_SUB_CATEGORIES.CLIENT_SUB_CATEGORIES_ENDPOINT,
    queryKey: API_PATHS.CLIENT_SUB_CATEGORIES.CLIENT_SUB_CATEGORIES_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** -----> Fetch Products Query -----> */
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
  } = useApiQuery({
    url: API_PATHS.CLIENT_PRODUCTS.CLIENT_ENDPOINT,
    queryKey: API_PATHS.CLIENT_PRODUCTS.CLIENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  console.log("All products", productsData);

  /*** -------> PRICE & BRAND RELATED SEARCH -------> */
  const allBrands = [
    "All Brands",
    ...new Set(productsData?.map((p) => p.brand).filter(Boolean)),
  ];

  useEffect(() => {
    if (!productsData) return;

    let filtered = [...productsData];

    // Category filter
    if (categorySlug) {
      filtered = filtered.filter((p) => p.category?.slug === categorySlug);
    }

    // Subcategory filter
    if (subCategorySlug) {
      filtered = filtered.filter(
        (p) => p.subCategory?.slug === subCategorySlug
      );
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Brand filter
    if (selectedBrand !== "All Brands") {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    setProducts(filtered);
  }, [productsData, categorySlug, subCategorySlug, priceRange, selectedBrand]);

  /*** ------> Category slug handler ------> */
  const handleCategoryClick = (slug) => {
    setSearchParams({
      category: slug || "",
      brand: "All Brands",
      minPrice: priceRange.min.toString(),
      maxPrice: priceRange.max.toString(),
    });
  };

  // Subcategory clicked → keep parent category
  const handleSubCategoryClick = (categorySlug, subCategorySlug) => {
    setSearchParams({
      category: categorySlug,
      subCategory: subCategorySlug,
      brand: "All Brands",
      minPrice: priceRange.min.toString(),
      maxPrice: priceRange.max.toString(),
    });
  };

  /*** --------> Price set handler --------> */
  const handlePriceChange = (min, max) => {
    setSearchParams({
      category: "", //resets category
      brand: "All Brands",
      minPrice: min?.toString() || "0",
      maxPrice: max === Infinity ? "" : max.toString(),
    });
  };

  /*** -----> Brand selector handler -----> */
  const handleBrandChange = (brand) => {
    setSearchParams({
      category: "", //resets category
      brand: brand || "All Brands",
      minPrice: priceRange.min.toString(),
      maxPrice: priceRange.max.toString(),
    });
  };

  /*** -----> Use Fetched CATEGORY Data Status Handler -----> */
  const categoriesStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
    label: "categories",
  });
  /*** -----> Use Fetched SUB-CATEGORY Data Status Handler -----> */
  const subCategoriesStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingSubCategories,
    isError: isErrorSubCategories,
    error: errorSubCategories,
    label: "sub-categories",
  });

  console.log("SUB_CATEGORIES", subCategories);

  /*** -----> Use Fetched PRODUCT Data Status Handler -----> */
  const productsStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
    label: "products",
  });

  return (
    <div>
      {/* --------> Page Meta --------> */}
      <PageMeta
        title="Category Page || Nova-Cart"
        description="Have a look on all categories in detail."
      />
      <DynamicPageTitle pageTitle={pageTile} />

      <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-10 gap-4 justify-between">
        {/*** ------> Aside Categories section ----->  */}
        {categoriesStatus.status !== "success" ? (
          categoriesStatus.content
        ) : (
          <aside className="lg:col-span-3 col-span-12 shadow rounded-lg sticky lg:top-20 lg:max-h-[calc(100vh-200px)] pb-6 overflow-y-auto">
            <div className="mb-4 text-sm text-gray-500 bg-base-200 p-2 lg:text-2xl font-bold border border-base-content/15 rounded-t-lg">
              <h3 className="lg:text-2xl font-bold text-lg">Categories</h3>
            </div>

            <div className="lg:px-4 px-2">
              <ul className="space-y-2 lg:mb-4 mb-2">
                <li
                  className={`${
                    selectedCategory
                      ? "hover:bg-base-200"
                      : "bg-base-200 border-b border-base-content/15 text-amber-500 font-semibold hover:bg-base-200"
                  }`}
                >
                  <Link to="/product-categories">All Products</Link>
                </li>

                {categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      className={`block rounded hover:bg-base-100 cursor-pointer w-full text-left ${
                        selectedCategory === cat.slug
                          ? "bg-base-200 border-base-content/15 text-amber-500 font-semibold cursor-pointer w-full border-b"
                          : ""
                      }`}
                      onClick={() => handleCategoryClick(cat.slug)}
                    >
                      {cat.name}
                    </button>

                    {cat.subcategories?.length &&
                      cat.subcategories.length > 0 && (
                        <ul className="pl- space-y-1 text-sm w-full block">
                          {cat.subcategories.map((sub) => (
                            <li key={sub._id}>
                              <button
                                className={`block px-2 py-1 rounded hover:bg-gray-100 ${
                                  selectedCategory === sub.slug
                                    ? "bg-gray-200 font-semibold px-2 block cursor-pointer w-full"
                                    : "cursor-pointer"
                                }`}
                                onClick={() =>
                                  handleSubCategoryClick(cat.slug, sub.slug)
                                }
                              >
                                {sub.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                  </li>
                ))}
              </ul>

              <div className="divider m-0"></div>

              {/* Mobile Price Filter: Dual-handle slider */}
              <div className="mt-2 px-2 w-full space-y-1">
                <p className="text-sm mb- font-semibold">Price</p>

                {/* Display current range */}
                <div className="flex justify-between text-xs">
                  <span>${priceRange.min}</span>
                  <span>
                    ${priceRange.max === Infinity ? 1000 : priceRange.max}
                  </span>
                </div>

                <div className="relative w-full h-6">
                  {/* Track range */}
                  <div className="absolute top-2 w-full h-1 bg-base-300 rounded"></div>

                  {/* Range fill */}
                  <div
                    className="absolute top-[10px] h-1 bg-indigo-600 rounded"
                    style={{
                      left: `${(priceRange.min / 1000) * 100}%`,
                      right: `${
                        100 -
                        ((priceRange.max === Infinity ? 1000 : priceRange.max) /
                          1000) *
                          100
                      }%`,
                    }}
                  ></div>

                  {/* Min handle */}
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    value={priceRange.min}
                    onChange={(e) =>
                      handlePriceChange(
                        Math.min(Number(e.target.value), priceRange.max),
                        priceRange.max
                      )
                    }
                    className="absolute w-full h-6 bg-transparent appearance-none pointer-events-auto"
                    style={{ zIndex: 2 }}
                  />

                  {/* Max handle */}
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    value={priceRange.max === Infinity ? 1000 : priceRange.max}
                    onChange={(e) =>
                      handlePriceChange(
                        priceRange.min,
                        Math.max(Number(e.target.value), priceRange.min)
                      )
                    }
                    className="absolute w-full h-6 bg-transparent appearance-none pointer-events-auto"
                    style={{ zIndex: 3 }}
                  />
                </div>
              </div>

              {/* Optional Filters */}
              <div className="lg:my-4 my-2">
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) =>
                      handlePriceChange(Number(e.target.value), priceRange.max)
                    }
                    className="sm:w-1/2 border rounded px-2 py-1 border-base-content/25 w-full transition-all duration-200 ease-in-out"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) =>
                      handlePriceChange(priceRange.min, Number(e.target.value))
                    }
                    className="sm:w-1/2 border rounded px-2 py-1 border-base-content/25 w-full transition-all duration-200 ease-in-out"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/*------> Brand selection begins ------>*/}
              <div className="mt-2 space-y-1">
                <p className="text-sm font-semibold">Brand</p>
                <select
                  className="w-full border rounded px-2 py-1 border-base-content/25"
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                >
                  {allBrands.map((b, i) => (
                    <option key={i} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>
        )}

        {/*** -----> Main content section PRODUCTS -----> */}

        {productsStatus.status !== "success" ? (
          productsStatus.content
        ) : (
          <main className="lg:col-span-9 col-span-12 shadow rounded-lg">
            {/* Breadcrumb */}
            <div className="mb-4 text-sm text-gray-500 bg-base-200 p-2 lg:text-2xl font-bold border border-base-content/15 rounded-t-lg">
              <Link to="/">Home</Link>
              {selectedCategory && <> &gt; {selectedCategory}</>}
            </div>

            {/* Products grid */}
            {products?.length > 0 ? (
              <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-6 gap-4">
                {products?.map((p) => (
                  <div
                    key={p._id}
                    className="lg:col-span-4 col-span-1 border border-base-content/20 rounded-lg hover:shadow-lg transition"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-44 object-contain mb-2"
                    />
                    <div className="p-2">
                      <h3 className="font-medium">{p.name}</h3>
                      <p className="text-gray-600">${p.price.toFixed(2)}</p>
                    </div>
                    <button className="mt-2 w-full bg-indigo-600 text-white py-1 rounded hover:bg-indigo-700">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <NoDataFound label={"Product"} />
            )}
          </main>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
