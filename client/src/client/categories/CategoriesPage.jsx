import { Link, useSearchParams } from "react-router-dom";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { LucideIcon } from "../../common/lib/LucideIcons";
import NoDataFound from "../../common/components/ui/NoDataFound";
import PageMeta from "../../common/components/ui/PageMeta";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { LucidePackageCheck } from "lucide-react";

const CategoriesPage = () => {
  const pageTile = usePageTitle();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [addedToCart, setAddedToCart] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const apiURL = import.meta.env.VITE_API_URL || "http:localhost:3000";

  // Filters from URL
  const categorySlug = searchParams.get("category") || "";
  const subCategorySlug = searchParams.get("subCategory") || "";
  const brandFilter = searchParams.get("brand") || "All Brands";
  const minPrice = parseFloat(searchParams.get("minPrice")) || 0;

  // Always define the current filters from searchParams
  const maxPrice = parseFloat(searchParams.get("maxPrice")) || Infinity;
  const CART_LIMIT = 10;

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
        (p) => p.subCategory?.slug === subCategorySlug,
      );
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max,
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

  /*** ------> Add to Cart Mutation Query ------> */
  const addToCartMutation = useApiMutation({
    method: "create",
    path: `${API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT}`,
    key: API_PATHS.CLIENT_CARTS.CLIENT_KEY,
    onSuccess: (res) => {
      setCart(res.data.items); // update cart with latest
    },
    onError: (err) => {
      toast.error("Failed to add product to cart");
      console.error(err);
    },
  });

  /** --------> Add product to cart --------> */
  const handleAddToCart = (product) => {
    if (addedToCart.length >= CART_LIMIT) {
      toast.success("You have added 10 items!");
      return; // prevent adding more
    }
    addToCartMutation.mutate(
      {
        data: {
          productId: product._id,
          quantity: 1,
        },
      },
      {
        onSuccess: (res) => {
          setAddedToCart((prev) => {
            const existing = prev.find((item) => item._id === product._id);
            if (existing) {
              // update quantity
              return prev.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              );
              // toast.error("Item already added! try new one!");
            } else {
              return [
                ...prev,
                {
                  _id: product._id,
                  name: product.name,
                  brand: product.brand,
                  image: product.images?.[0], // first image
                  price: product.price,
                  quantity: 1,
                },
              ];
            }
          });
        },
      },
    );
  };

  /*** -----> Sidebar toggler handler -----> */
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
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

  /*** -----> Use Fetched PRODUCT Data Status Handler -----> */
  const productsStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
    label: "products",
  });

  return (
    <div className="lg:max-w-7xl mx-auto">
      {/* --------> Page Meta --------> */}
      <PageMeta
        title="Category Page || Nova-Cart"
        description="Have a look on all categories in detail."
      />

      <DynamicPageTitle
        pageTitle={pageTile}
        icon={<LucideIcon.Layers3Icon />}
      />

      <div
        className={`${isSidebarOpen ? "flex justify-end z-10" : "flex justify-start"} block lg:hidden mb-4 bg-base-300 p-2 rounded-t-md`}
      >
        {!isSidebarOpen ? (
          <FaBars
            size={22}
            onClick={handleToggleSidebar}
            className="border border-base-content/15 shadow-sm p-0.5 rounded-sm"
          />
        ) : (
          <FaTimes
            size={22}
            onClick={handleToggleSidebar}
            className="border border-base-content/15 shadow-sm p-0.5 rounded-sm"
          />
        )}
        <span className="ml-2 font-bold"> Sidebar Toggler</span>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          onClick={handleToggleSidebar}
          className="fixed inset-0 bg-black/90 z-20 lg:hidden"
        ></div>
      )}

      <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-10 gap-4 justify-between">
        {/*** ------> Aside Categories section ----->  */}
        {categoriesStatus.status !== "success" ? (
          categoriesStatus.content
        ) : (
          <aside
            className={`
            bg-base-100 shadow
            lg:col-span-3 col-span-12
            fixed lg:static
            top-0 left-0
            h-screen lg:h-auto
            w-80 lg:w-auto
            lg:z-30
            z-50
            transform transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            lg:max-h-[calc(100vh-6rem)] max-h-screen
            lg:sticky lg:top-20
            overflow-y-auto
          `}
          >
            <div className="mb-4 text-sm text-gray-500 bg-base-300 lg:p-2 p-2 lg:text-2xl font-bold border border-base-content/10 lg:rounded-t-lg rounded-t-xs sticky top-0">
              <h3
                className={`lg:text-2xl text-lg font-bold flex items-center justify-between gap-2`}
              >
                <span className="flex items-center gap-2">
                  <LucideIcon.ListCheck /> Categories
                </span>
                <span>
                  {isSidebarOpen && (
                    <FaTimes
                      onClick={handleToggleSidebar}
                      size={25}
                      className="lg:hidden block border border-base-content/15 p-1 rounded-sm text-red-500"
                    />
                  )}
                </span>
              </h3>
            </div>

            <div className="lg:px-4 px-2 pb-4">
              <ul className="space-y-2 lg:mb-4 mb-2">
                <li
                  className={`${
                    selectedCategory
                      ? "hover:bg-base-200"
                      : "bg-base-200 border-b border-base-content/15 text-indigo-500 font-semibold hover:bg-base-200"
                  } `}
                >
                  <Link
                    to="/product-categories"
                    className="flex items-center gap-2 font-bold"
                  >
                    {" "}
                    <LucidePackageCheck size={20} /> All Products
                  </Link>
                </li>

                {categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      className={`rounded text-base-content/70 hover:bg-base-100 cursor-pointer w-full text-left flex items-center gap-2 font-bold ${
                        selectedCategory === cat.slug
                          ? "bg-base-200 border-base-content/15 text-indigo-500 font-semibold cursor-pointer w-full border-b"
                          : ""
                      }`}
                      onClick={() => handleCategoryClick(cat.slug)}
                    >
                      <LucideIcon.List size={18} /> {cat.name}
                    </button>

                    {cat.subcategories?.length &&
                      cat.subcategories.length > 0 && (
                        <ul className="pl-4 space-y-1 text-sm w-full block text-base-content">
                          {cat.subcategories.map((sub) => (
                            <li key={sub._id}>
                              <button
                                className={`px-2 py-1 rounded hover:bg-gray-100 flex items-center gap-2 ${
                                  subCategorySlug.toString() ===
                                  sub.slug.toString()
                                    ? "bg-base-200 text-indigo-500 font-semibold px-2 block cursor-pointer w-full"
                                    : "cursor-pointer"
                                }`}
                                onClick={() =>
                                  handleSubCategoryClick(cat.slug, sub.slug)
                                }
                              >
                                <LucideIcon.CheckCircle size={14} /> {sub.name}
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
                        priceRange.max,
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
                        Math.max(Number(e.target.value), priceRange.min),
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
          <main className="lg:col-span-9 col-span-12 rounded-lg">
            {/* Breadcrumb */}
            <div className="mb-4 text-sm text-gray-500 bg-base-300 lg:p-2 p-1 rounded-t-lg border-t border-b border-base-content/10 flex items-center gap-2">
              <Link to="/" className="m-0 p-0 flex items-center">
                <h3 className="lg:text-2xl text-lg font-bold flex items-center gap-2">
                  <LucideIcon.Home />
                  Home
                </h3>
              </Link>
              {selectedCategory && (
                <div className="flex items-center pt-1">
                  &gt;&gt; {selectedCategory}
                </div>
              )}
            </div>

            {/*Added product limit to cart pop-up*/}
            {addedToCart.length > 0 && (
              <div className="rounded-xl lg:mb-10 mb-4 shadow hover:shadow-md lg:p-4 p-2">
                <div className="space-y-4">
                  <div className="text-base-content">
                    <h2 className="lg:text-2xl text-xl font-bold text-center">
                      🛒 Products Added to Cart Calculation Panel ➡️
                      <span className="w-10 h-10 rounded-full bg-white text-red-500">
                        {addedToCart.length}
                      </span>{" "}
                    </h2>
                  </div>
                  {addedToCart.length >= CART_LIMIT && (
                    <p className="text-xl text-red-600 text-center">
                      You have reached the limit of 10 products!!!
                    </p>
                  )}
                  <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-6 gap-4 justify-between bg-base-100 rounded-2xl">
                    {addedToCart?.map((c, idx) => (
                      <div className="lg:col-span-3 col-span-6" key={c._id}>
                        <div className="flex items-center flex-wrap p-2 border border-base-content/15 rounded-lg shadow space-y-2 min-h-20 space-x-2">
                          <div className="w-full bg-red-500">
                            {c?.image && (
                              <img
                                src={`${apiURL}${c?.image}`}
                                alt={c?.brand}
                                className="w-full h-40 object-cover mb-2 rounded-t-md"
                              />
                            )}
                          </div>
                          <div className="">
                            <h2 className="font-bold text-sm">
                              {idx + 1} {") "}
                              {c?.brand}
                              {<br />}
                              ➡️
                              {c?.name}
                            </h2>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Products grid */}
            {products?.length > 0 ? (
              <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-6 gap-4">
                {products?.map((p) => (
                  <div
                    key={p._id}
                    className="lg:col-span-4 col-span-1 border border-base-content/20 rounded-lg hover:shadow-lg transition"
                  >
                    {p.images && (
                      <img
                        src={`${apiURL}${p?.images[0]}`}
                        alt={p.name}
                        className="w-full h-40 object-cover mb-2 rounded-t-md"
                      />
                    )}
                    <div className="p-2">
                      <h3 className="text-sm font-bold">{p.name}</h3>
                      <p className="text-sm font-bold">{p.brand}</p>
                      <p className="text-gray-600">${p.price.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between rounded-b-lg p-2 shadow">
                      <Link to={`/product-details/${p._id}`}>
                        <Button variant="base" className="btn btn-sm">
                          <LucideIcon.EyeIcon size={20} /> View Details
                        </Button>
                      </Link>

                      <div
                        className={`${
                          addedToCart.some((item) => item._id === p._id)
                            ? "cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <Button
                          disabled={addedToCart.some(
                            (item) =>
                              item._id === p._id ||
                              addedToCart.length >= CART_LIMIT,
                          )}
                          type="submit"
                          variant={`${
                            addedToCart.some((item) => item._id === p._id)
                              ? "base"
                              : "indigo"
                          }`}
                          onClick={() => handleAddToCart(p)}
                          className={`btn btn-sm ${
                            addedToCart.some((item) => item._id === p._id)
                              ? "disabled cursor-not-allowed"
                              : "visible"
                          }`}
                        >
                          {addedToCart.some((item) => item._id === p._id) ? (
                            <LucideIcon.CircleCheckBig
                              size={20}
                              className="text-base-content"
                            />
                          ) : (
                            <LucideIcon.ShoppingCart
                              size={20}
                              className="text-white"
                            />
                          )}

                          {addedToCart.some((item) => item._id === p._id)
                            ? "Added"
                            : addedToCart.length >= CART_LIMIT
                              ? "Cart Full!"
                              : "Add to Cart"}
                        </Button>
                      </div>
                    </div>
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
