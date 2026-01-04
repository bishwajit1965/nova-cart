import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { containerVariants, itemVariants } from "../service/animations";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { LucideIcon } from "../../common/lib/LucideIcons";
import { AnimatePresence, motion } from "framer-motion";
import textShortener from "../../utils/textShortener";
import toast from "react-hot-toast";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import { useState } from "react";
import { useEffect } from "react";
import {
  AlertTriangle,
  ArrowDownAZ,
  Boxes,
  Diff,
  Layers3,
  Loader,
  Package,
  ShoppingCart,
  ShoppingCartIcon,
} from "lucide-react";
import CartSummaryPanel from "../cart/components/CartSummaryPanel";
import useGlobalContext from "../../common/hooks/useGlobalContext";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import CartItemList from "../cart/components/CartItemList";
import RecentlyViewedProducts from "../recentlyViewedProducts/RecentlyViewedProducts";
import ClientRelatedProducts from "../relatedProducts/ClientRelatedProducts";
import { useAuth } from "../../common/hooks/useAuth";

const ProductDetails = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const navigate = useNavigate();
  const pageTitle = usePageTitle();
  const product = useLoaderData();
  const productData = product?.data;
  const [isExpanded, setIsExpanded] = useState(false);
  const [instruction, setInstruction] = useState(false);
  const [openViewPanel, setOpenViewPanel] = useState(false);
  const [isOpenRelatedProducts, setIsOpenRelatedProducts] = useState(false);
  const { user } = useAuth();

  // Global cart data
  const {
    cart,
    setCart,
    wishList,
    coupons,
    handleAddToCart,
    handleAddToWishList,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleGenerateCouponCode,
    cartsDataStatus,

    loadingCartId,
    loadingWishListId,

    deleteModalData,
    setDeleteModalData,
    handleRequestCartItemDelete,
    handleRemoveCartItem,
  } = useGlobalContext();

  console.log("Product Data", productData);

  /*** ========> API USE-QUERIES ========> */

  //DB based
  const {
    data: relatedProducts,
    isLoading: isLoadingRelatedProducts,
    isError: isErrorRelatedProducts,
    error: errorRelatedProducts,
  } = useApiQuery({
    url: `${API_PATHS.CLIENT_RELATED_PRODUCTS.ENDPOINT}?categoryId=${productData?.category}&exclude=${productData?._id}&limit=10`,
    queryKey: [...API_PATHS.CLIENT_RELATED_PRODUCTS.KEY, productData?._id],
    options: {
      enabled: !!productData?._id && !!productData?.category && !!productData,
    },
  });

  const {
    data: viewedProducts,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: errorProducts,
  } = useApiQuery({
    url: API_PATHS.CLIENT_RECENTLY_VIEWED.ENDPOINT,
    queryKey: API_PATHS.CLIENT_RECENTLY_VIEWED.KEY,
    options: {
      enabled: !!user,
      // staleTime: 1000 * 60 * 5,
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  console.log("Related Products Data", relatedProducts);
  console.log("Viewed Products Data", viewedProducts);

  /*** ------> Helper to build image URL safely ------> */
  const buildUrl = (src) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    // If it's already like '/uploads/xxx' or '/images/..' keep leading slash
    const cleaned = src.startsWith("/") ? src : `/${src}`;
    return `${apiURL}${cleaned}`;
  };

  /*** ========> API USE-MUTATIONS ========> */

  // Product details destructured
  const productDetail = {
    image: product.data.image || null,
    images: product.data.images || [],
    name: product.data.name,
    brand: product.data.brand,
    description: product.data.description,
    price: product.data.price,
    stock: product.data.stock,
  };

  // Variant color set
  const colors = product.data.variants.length
    ? Array.from(new Set(product.data.variants.map((v) => v.color)))
    : [];

  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product?.data?.images[0]) || "";
  const [selectedColor, setSelectedColor] = useState(colors[0]) || "";
  const [selectedVariant, setSelectedVariant] = useState(
    product.data.variants.find((v) => v.color === colors[0] || null)
  );

  // Variant sizes
  const sizes = selectedColor
    ? product.data.variants
        .filter((v) => v.color === selectedColor)
        .map((v) => v.size)
    : [];

  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const variant = product.data.variants.find(
      (v) => v.color === selectedColor && v.size === size
    );
    setSelectedVariant(variant);
  };

  /*** =============> USE-EFFECTS =============> */

  // mobile sticky add-to-cart visibility on scroll
  const [showSticky, setShowSticky] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setShowSticky(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // animations
  const mainImgVariants = {
    enter: { opacity: 0, scale: 0.98 },
    center: { opacity: 1, scale: 1, transition: { duration: 0.22 } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.18 } },
  };

  // update selectedVariant when selectedColor changes (keep size preference)
  useEffect(() => {
    if (!selectedColor) return;
    const match = productData.variants?.find((v) => v.color === selectedColor);
    if (match) setSelectedVariant(match);
  }, [selectedColor, productData.variants]);

  // update main image when selectedVariant changes
  useEffect(() => {
    if (!selectedVariant) return;
    if (selectedVariant.images?.length) {
      setMainImage(selectedVariant.images[0]);
    } else if (productDetail.image) {
      setMainImage(productDetail.image);
    } else if (productDetail.images?.length) {
      setMainImage(productDetail.images[0]);
    } else {
      setMainImage("");
    }
    setQuantity(1); // reset quantity when variant changes
  }, [selectedVariant]); // eslint-disable-line

  // Update sizes and selected variant when selectedColor changes
  useEffect(() => {
    const newSizes = product.data.variants
      .filter((v) => v.color === selectedColor)
      .map((v) => v.size);

    setSelectedSize(newSizes[0] || "");
    setSelectedVariant(
      product.data.variants.find(
        (v) => v.color === selectedColor && v.size === newSizes[0]
      ) || null
    );
  }, [selectedColor]);

  /*** ========> HANDLER METHODS ========> */

  const onAddToCart = () => {
    handleAddToCart({
      product: product?.data,
      variant: selectedVariant,
      quantity: 1,
    });
  };

  const onAddToWishList = () => {
    handleAddToWishList({
      product: product?.data,
      variant: selectedVariant,
    });
  };

  const onGenerateCouponCode = (e) => {
    e?.preventDefault();
    if (cart?.length === 0) {
      toast.error("Your cart is empty! Add products to cart.");
      return;
    }
    handleGenerateCouponCode();
    navigate("/client-cart-checkout");
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const variant = product.data.variants.find((v) => v.color === color);
    setSelectedVariant(variant);
    // Optional: update main image if variant images exist per color
    if (variant.images.length > 0) {
      setMainImage(variant.images[0]);
    } else {
      setMainImage(product?.data?.images[0] || "");
    }
  };

  const handleViewPanelToggler = () => {
    setOpenViewPanel((prev) => !prev);
    setIsOpenRelatedProducts(false);
  };

  const handleRelatedProductsToggler = () => {
    setIsOpenRelatedProducts((prev) => !prev);
    setOpenViewPanel(false);
  };

  const handleInstruct = () => setInstruction((prev) => !prev);

  /*** ========> DATA FETCHED STATUS ========> */

  const viewedProductsDataStatus = useFetchedDataStatusHandler({
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: errorProducts,
    label: "Viewed products",
  });

  const relatedProductsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingRelatedProducts,
    isError: isErrorRelatedProducts,
    error: errorRelatedProducts,
    label: "Related Products",
  });

  return (
    <div className="lg:space-y-8 space-y-0.5">
      <DynamicPageTitle
        icon={<LucideIcon.Package size={25} />}
        pageTitle={pageTitle}
      />

      <div className="lg:flex grid items-center justify-self-start lg:space-y-0 space-y-2 space-x-10 w-full">
        <div className="flex justify-start lg:min-w-[14.70rem] min-w-full space-x-2">
          <Button
            onClick={handleViewPanelToggler}
            variant={openViewPanel ? "success" : "indigo"}
            className={`${
              openViewPanel ? "bg-green-800" : "bg-info-800 text-base-100"
            } flex items-center gap-2 lg:text-[16px] text-sm lg:min-w-[14.70rem] min-w-full`}
          >
            <motion.span
              animate={{ rotate: openViewPanel ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex items-center justify-center lg:h-7 lg:w-7 h-6 w-6 rounded-full bg-green-600 border-2 shadow"
            >
              {openViewPanel ? (
                <LucideIcon.ChevronsUp />
              ) : (
                <LucideIcon.ChevronsDown />
              )}
            </motion.span>

            <span className="lg:text-[16px] text-[11px]">
              {openViewPanel
                ? "Close Recently Viewed Products"
                : "View Recently Viewed Products"}
            </span>

            <span className="lg:w-8 lg:h-8 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center border-2 text-md shadow">
              {viewedProducts?.length}
            </span>

            <span>{openViewPanel && <ArrowDownAZ />}</span>
          </Button>
        </div>

        <div className="flex justify-start lg:min-w-[14.70rem] min-w-full space-x-4">
          <Button
            onClick={handleRelatedProductsToggler}
            variant={isOpenRelatedProducts ? "primary" : "purple"}
            className={`${
              isOpenRelatedProducts
                ? "bg-primary-800"
                : "bg-info-800 text-base-100"
            } flex items-center gap-2 lg:text-[16px] text-sm lg:min-w-[14.70rem] min-w-full`}
          >
            <motion.span
              animate={{ rotate: isOpenRelatedProducts ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex items-center justify-center lg:h-7 lg:w-7 h-6 w-6 rounded-full bg-green-600 border-2 shadow"
            >
              {isOpenRelatedProducts ? (
                <LucideIcon.ChevronsUp />
              ) : (
                <LucideIcon.ChevronsDown />
              )}
            </motion.span>

            <span className="lg:text-[16px] text-[11px]">
              {isOpenRelatedProducts
                ? "Close Related Products"
                : "View Related Products"}
            </span>

            <span className="lg:w-8 lg:h-8 w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center border-2 text-md shadow">
              {relatedProducts?.length}
            </span>

            <span>{isOpenRelatedProducts && <ArrowDownAZ />}</span>
          </Button>
        </div>
      </div>

      {/* --------> Recently viewed products section --------> */}
      {viewedProductsDataStatus.status !== "success" ? (
        viewedProductsDataStatus.content
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={containerVariants}
          className="lg:p-0 p-1"
        >
          <AnimatePresence>
            {openViewPanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <RecentlyViewedProducts
                  viewedProducts={viewedProducts}
                  viewedProductsDataStatus={viewedProductsDataStatus}
                  handleAddToCart={handleAddToCart}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* -------> Related category Products Section -------> */}
      {relatedProductsDataStatus.status !== "success" ? (
        relatedProductsDataStatus.content
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={containerVariants}
          className="lg:p-0 p-1"
        >
          <AnimatePresence>
            {isOpenRelatedProducts && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {relatedProducts && relatedProducts.length > 0 && (
                  <div className="">
                    <ClientRelatedProducts relatedProducts={relatedProducts} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="">
        <div className="bg-base-300 rounded-t-xl p-2 mb-2 shadow border border-base-content/5">
          <h2 className="lg:text-2xl text-lg font-extrabold flex items-center justify-center capitalize">
            <Package className="mr-2" /> Select product of choice
          </h2>
        </div>

        <motion.div
          className="grid lg:grid-cols-12 grid-cols-1 lg:gap-8 gap-2 justify-between"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          variants={containerVariants}
        >
          {/* ------> LEFT SIDE MAIN IMAGE ------> */}
          <div
            className="lg:col-span-4 col-span-12 rounded-lg border border-base-content/15 shadow sticky lg:top-20 pointer-events-auto max-h-max bg-base-100"
            variant={itemVariants}
          >
            <div className="">
              <div className="bg-base-300 p-2 border-b border-base-content/15">
                <h2 className="lg:text-xl text-lg font-bold flex items-center gap-2">
                  <Boxes size={20} /> Product & Variant Images
                </h2>
              </div>

              {/* Main image */}
              <div className="relative">
                <div className="w-full h-full flex items-center justify-center bg-base-100 rounded-xl p-4">
                  <AnimatePresence mode="wait"></AnimatePresence>
                  {mainImage ? (
                    <motion.img
                      key={selectedVariant?._id || mainImage} // triggers animation on change
                      initial="enter"
                      animate="center"
                      exit="exit"
                      variants={mainImgVariants}
                      src={buildUrl(mainImage)}
                      alt={productDetail?.name}
                      className="w-full object-contain cursor-pointer transition-transform duration-300 rounded-xl mx-auto"
                      style={{
                        transform: "scale(1)",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  ) : (
                    <motion.div
                      key="no-img"
                      className="w-full h-[320px] flex items-center justify-center text-sm text-muted"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      No image available
                    </motion.div>
                  )}
                </div>
              </div>

              {/* THUMBNAILS OFF ALL PRODUCT IMAGES */}
              <div className="lg:p-4 p-2">
                <div className="font-semi-bold mb-2">
                  {productDetail.images.length > 0 && (
                    <h3 className="font-semibold mb-2">Product Images:</h3>
                  )}
                </div>
                <div className="flex gap-3 flex-wrap">
                  {productDetail.images?.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImage(img)}
                      aria-label={`Thumbnail ${idx + 1}`}
                      className={`w-20 h-20 rounded-lg overflow-hidden border ${
                        mainImage === img
                          ? "border-black ring-2 ring-offset-1 ring-black"
                          : "border-base-content/10"
                      }`}
                    >
                      <p className="text-xs">{productDetail._id}</p>
                      <img
                        src={buildUrl(img)}
                        alt={`thumb-${idx}`}
                        className="w-full h-full object-contain cursor-pointer transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/*VARIANT IMAGES IF EXISTS */}
              <div className="lg:p-4 p-2">
                <div className="">
                  {selectedVariant?.images?.length > 0 && (
                    <h3 className="font-semibold mb-2">Variant Images:</h3>
                  )}
                </div>
                <div className="flex gap-3 flex-wrap">
                  {/* Show all variant images from variants of selected color, else selectedVariant only */}
                  {selectedVariant?.images?.length > 0 ? (
                    selectedVariant.images.map((img, idx) => (
                      <button
                        key={`v-${idx}`}
                        onClick={() => setMainImage(img)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border cursor-pointer ${
                          mainImage === img
                            ? "border-black ring-2 ring-offset-1 ring-black"
                            : "border-base-content/10"
                        }`}
                      >
                        <img
                          src={buildUrl(img)}
                          alt={`variant-thumb-${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))
                  ) : (
                    <div className="text-sm text-muted">No variant images</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ------> MIDDLE COLUMN DETAILS DATA ------> */}
          <motion.div
            className="lg:col-span-5 col-span-12 border border-base-content/15 shadow rounded-lg pointer-events-auto"
            variant={itemVariants}
          >
            <div className="bg-base-300 p-2 border-b border-base-content/15">
              <h2 className="lg:text-xl text-lg font-bold flex items-center gap-2">
                <Layers3 size={20} /> Your Product Details & Variants
              </h2>
            </div>

            <div className="lg:p-4 p-2 lg:space-y-5 space-y-3">
              <h2 className="lg:text-xl text-xl lg:font-extrabold font-bold font-sans">
                Product ➡️ {productDetail?.name}
              </h2>
              <h3 className="lg:text-xl text-xl lg:font-extrabold font-bold font-sans">
                Brand ➡️ {productDetail?.brand}
              </h3>
              <p className="text-justify">
                <strong>Description: </strong>
                {isExpanded
                  ? productDetail?.description
                  : textShortener(productDetail?.description, 165)}
                {productDetail?.description &&
                productDetail?.description.length >= 165 ? (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-indigo-500 link ml-1 text-sm font-semibold"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                ) : null}
              </p>
              <p className="font-bold">
                Price: $ {productDetail?.price.toFixed(2)}
              </p>

              {/* ----> VARIANT CONTROLS FOLLOW --> */}
              {/* Variant wise price display */}
              <p className="text-xl font-bold">
                Variant Price: $ {selectedVariant?.price.toFixed(2)}
              </p>
              {/* Stock display */}
              {selectedVariant?.stock && (
                <p
                  className={`font-semibold ${
                    selectedVariant?.stock > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedVariant.stock > 0
                    ? `Product: ${productDetail?.name} || Brand: ${productDetail?.brand} || In stock ➡️ ${selectedVariant?.stock}`
                    : "Out of stock!"}
                </p>
              )}

              {/* SELECTED VARIANTS DETAILS */}
              {selectedVariant && (
                <div className="flex flex-col border border-base-content/15 shadow hover:shadow-lg lg:p-2 p-2 rounded-md bg-base-100">
                  <div className="">
                    <h2 className="lg:text-xl text-xl font-extrabold flex items-center gap-2">
                      <ShoppingCart /> Selected Variant Details
                    </h2>
                  </div>
                  <div
                    className={`${
                      selectedVariant?.images?.length > 0
                        ? "flex items-center flex-wrap"
                        : "grid lg:grid-cols-12 grid-cols-1 justify-between gap-4"
                    }`}
                  >
                    {/*Variant Image */}
                    <div className="lg:col-span-2 col-span-12">
                      {selectedVariant?.images?.length > 0 && (
                        <div className="mt-2">
                          <div className="flex gap-3 flex-wrap">
                            {selectedVariant.images.map((img, idx) => (
                              <div
                                key={`sv-img-${idx}`}
                                className="w-20 h-20 rounded-lg overflow-hidden border border-base-content/10"
                              >
                                <img
                                  src={buildUrl(img)}
                                  alt={`selected-variant-img-${idx}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Variant Name */}
                    <div className="lg:col-span-10 col-span-12">
                      <div className="flex flex-col">
                        <div className="">
                          {productDetail && (
                            <div className="mt-2">
                              <h2 className="font-bold mb-1 text-lg">
                                Product ➡️ {productDetail?.name}
                              </h2>
                            </div>
                          )}
                        </div>

                        {/* Variant details */}
                        <div className="">
                          {selectedVariant && (
                            <p className="font-semibold">
                              {selectedVariant?.stock !== undefined
                                ? `Stock: ${selectedVariant?.stock}`
                                : ""}{" "}
                              ⏺️ Price: ${selectedVariant?.price.toFixed(2)} ⏺️
                              Color: {selectedVariant?.color} ⏺️ Size:{" "}
                              {selectedVariant?.size}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Variants display */}
              <div className="">
                {instruction && (
                  <div className="bg-black text-white p-3 rounded-lg mb-2 animate-pulse border-amber-500 border-l-8">
                    <p className="">
                      Click any color dot value to select product you prefer,
                      then add to cart. You can increase or decrease quantity
                      and can also delete your added product to cart. Thank you
                      for choosing our Nova Cart E-commerce site.
                      <br />
                      <span className="text-amber-500 font-bold">N.B. </span>
                      If you select product from Your Viewed List or Related
                      Products above you have to select a variant from the color
                      dots to add to cart or it will fail.
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold mb-1 flex items-center gap-2">
                    <Package /> Select Product Variant
                  </h2>
                  <button
                    onMouseOver={handleInstruct}
                    className="text-indigo-500 link ml-4"
                  >
                    Guidance
                  </button>
                </div>

                <div className="flex items-center lg:space-x-2 space-x-2 gap-1 mt- flex-wrap border border-base-content/15 rounded-lg shadow hover:shadow-lg px-2 py-4">
                  {/* Color display & Variant Selector */}
                  <h3 className="font-semibold hidden lg:block">Color ➡️</h3>
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded-full cursor-pointer border-4 bg-base-100 ${
                        selectedColor === color
                          ? "border border-cyan-400 p-1 ring-1 ring-offset-1 ring-offset-cyan-400"
                          : "border-base-100"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                      title={color}
                    />
                  ))}

                  {/* Size display */}
                  <div className="flex items-center gap-2 flex-wrap lg:pl-6 pl-3">
                    <h3 className="font-semibold hidden lg:block">Size ➡️</h3>
                    {sizes.map((size, index) => (
                      <button
                        key={index}
                        className={`px-3 py-1 border rounded-md cursor-pointer shadow ${
                          selectedSize === size
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="">
                <div className="mb-1">
                  <h2 className="lg:text-xl text-lg font-extrabold flex items-center gap-2">
                    <Diff />
                    Select Product Quantity
                  </h2>
                </div>
                <div className="flex items-center gap-4 border border-base-content/15 rounded-md shadow lg:py-4 lg:px-3 p-2 hover:shadow-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="btn btn-sm text-xl border border-base-content/15"
                  >
                    -
                  </button>
                  <span className="font-semibold text-xl border border-base-content/40 px-3 py-0.5 rounded-md shadow">
                    {quantity}{" "}
                  </span>
                  <button
                    className={
                      quantity >= (selectedVariant?.stock || 1)
                        ? "btn btn-sm text-xl opacity-20 cursor-not-allowed border-red-500"
                        : "btn btn-sm text-xl border border-base-content/15"
                    }
                    onClick={() =>
                      setQuantity((q) =>
                        Math.min(selectedVariant.stock || 1, q + 1)
                      )
                    }
                    disabled={quantity >= (selectedVariant?.stock || 1)}
                  >
                    +
                  </button>
                  <p className="text-xs font-bold">
                    {quantity >= (selectedVariant?.stock || 1) ? (
                      <span className="text-red-500 flex items-center gap-1">
                        <AlertTriangle size={18} /> Can not buy more than in
                        stock.
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 lg:text-sm text-xs">
                        <ShoppingCart size={18} />
                        Add more quantity
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* ------> CARTS LIST DATA DISPLAYED ------> */}

              <div className="">
                {cartsDataStatus.status !== "success" ? (
                  cartsDataStatus.content
                ) : (
                  <CartItemList
                    cart={cart}
                    handleIncreaseQuantity={handleIncreaseQuantity}
                    handleDecreaseQuantity={handleDecreaseQuantity}
                    deleteModalData={deleteModalData}
                    onDeleteRequest={handleRequestCartItemDelete}
                    onDelete={handleRemoveCartItem}
                    setDeleteModalData={setDeleteModalData}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 flex-wrap justify-between">
                <div
                  className={`${
                    loadingCartId === product?.data?._id
                      ? "cursor-not-allowed bg-purple-500 rounded-md"
                      : ""
                  }`}
                >
                  <Button
                    variant="indigo"
                    // icon={LucideIcon.ShoppingCart}
                    className="btn lg:btn-md btn-sm"
                    onClick={onAddToCart}
                    disabled={loadingCartId === product?.data?._id}
                    // disabled={selectedVariant?.stock <= 0}
                  >
                    {loadingCartId === product?.data?._id ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <LucideIcon.ShoppingCart size={20} />
                    )}

                    {loadingCartId ? "Processing..." : "Add to Cart"}
                  </Button>
                </div>

                <div
                  className={`${
                    loadingWishListId === product?.data?._id
                      ? "cursor-not-allowed bg-purple-500 rounded-md"
                      : ""
                  }`}
                >
                  <Button
                    variant="primary"
                    // icon={LucideIcon.Heart}
                    disabled={loadingWishListId === product?.data?._id}
                    className="btn lg:btn-md btn-sm"
                    onClick={onAddToWishList}
                  >
                    {loadingWishListId === product?.data?._id ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <LucideIcon.Heart size={17} />
                    )}
                    {loadingWishListId ? "Processing..." : "Add to Wishlist"}
                  </Button>
                </div>

                <Link to="/client-product-wishlist">
                  <Button
                    variant="success"
                    // icon={LucideIcon.Heart}
                    className="btn lg:btn-md btn-sm"
                  >
                    <LucideIcon.Heart size={17} /> Go to Wish List
                  </Button>
                </Link>
                <div className="lg:w-full">
                  <Link to="/" className="w-full">
                    <Button
                      variant="primary"
                      icon={LucideIcon.Home}
                      className="btn lg:btn-md btn-sm w-full"
                    >
                      Go Home
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Mobile Sticky Add to Cart */}
              <AnimatePresence>
                {showSticky && (
                  <motion.div
                    initial={{ y: 120, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 120, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 16 }}
                    className={`fixed left-0 right-0 bottom-0 z-40 lg:hidden transition-transform duration-300 ${
                      showSticky ? "translate-y-0" : "translate-y-full"
                    }`}
                  >
                    <div className="bg-white p-3 border-t border-base-content/10 flex items-center justify-between">
                      <div>
                        <div className="font-bold">
                          ${selectedVariant?.price ?? productDetail.price}
                        </div>
                        <div className="text-xs text-muted">
                          {productDetail.name}
                        </div>{" "}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="btn btn-sm"
                        >
                          -
                        </button>

                        <div className="px-3 py-1 border rounded">
                          {quantity}
                        </div>

                        <button
                          onClick={() => setQuantity((q) => q + 1)}
                          className="btn btn-sm"
                        >
                          +
                        </button>
                        <button
                          onClick={handleAddToCart}
                          disabled={selectedVariant?.stock <= 0}
                          className="bg-black text-white px-2 py-2 rounded flex items-center gap-1"
                          aria-label="Add to cart sticky"
                        >
                          <ShoppingCartIcon size={15} /> Add
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ------> RIGHT SIDE BAR -> CART SUMMARY PANELS ------>  */}
          <div className="lg:col-span-3 col-span-12 lg:order-none order-first">
            <div className="sticky top-20 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className=""
              >
                {cartsDataStatus.status !== "success" ? (
                  cartsDataStatus.content
                ) : (
                  <CartSummaryPanel
                    cart={cart}
                    handleGenerateCouponCode={onGenerateCouponCode}
                    coupons={coupons}
                  />
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
