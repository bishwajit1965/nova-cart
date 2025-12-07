import { Link, useLoaderData } from "react-router-dom";
import { containerVariants, itemVariants } from "../service/animations";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { LucideIcon } from "../../common/lib/LucideIcons";
import { AnimatePresence, motion } from "framer-motion";
import textShortener from "../../utils/textShortener";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import { useState } from "react";
import { useEffect } from "react";
import { AlertTriangle, ShoppingCart } from "lucide-react";

const ProductDetails = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const pageTitle = usePageTitle();
  const product = useLoaderData();
  const productData = product?.data;
  const [cart, setCart] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // helper to build image URL safely
  const buildUrl = (src) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    // If it's already like '/uploads/xxx' or '/images/..' keep leading slash
    const cleaned = src.startsWith("/") ? src : `/${src}`;
    return `${apiURL}${cleaned}`;
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

  /*** ------> Add to wish-list ------> */
  const addToWishListMutation = useApiMutation({
    method: "create",
    path: `${API_PATHS.CLIENT_WISH_LISTS.CLIENT_WISH_LIST_ENDPOINT}`,
    key: API_PATHS.CLIENT_WISH_LISTS.CLIENT_KEY,
    onSuccess: (res) => {
      setWishList(res.data.items); // update cart with latest
      toast.success("Product added to cart");
    },
    onError: (err) => {
      toast.error("Failed to add product to cart");
      console.error(err);
    },
  });

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
  const [inWishList, setInWishList] = useState(false);
  const [mainImage, setMainImage] = useState(product?.data?.images[0]) || "";
  const [selectedColor, setSelectedColor] = useState(colors[0]) || "";
  const [selectedVariant, setSelectedVariant] = useState(
    product.data.variants.find((v) => v.color === colors[0] || null)
  );

  console.log("Selected variants", selectedVariant);

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

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock <= 0) {
      toast.error("Out of stock!");
      return;
    }
    const finalQuantity = Math.min(quantity, selectedVariant.stock);

    const cartItemPayload = {
      data: {
        productId: productData._id,
        name: productData.name,
        variantId: selectedVariant._id,
        color: selectedColor,
        size: selectedSize,
        price: selectedVariant.price,
        quantity: finalQuantity,
        image:
          (selectedVariant.images && selectedVariant.images[0]) ||
          productDetail.image ||
          productDetail.images[0] ||
          "",
        // image: selectedVariant.image || productDetail.image,
      },
    };

    addToCartMutation.mutate(cartItemPayload, {
      onSuccess: () => {
        toast.success(`${finalQuantity} x ${productData.name} added to cart`);
      },
      onError: () => {},
    });
  };

  const handleAddToWishlist = (productId) => {
    if (inWishList) {
      toast.success("Already added in wish list!");
      return;
    }
    addToWishListMutation.mutate(
      { data: { productId } },
      {
        onSuccess: (res) => {
          setWishList(res.data.items);
          setInWishList(true);
        },
        onError: (err) => {
          toast.error("Failed to add product to wishlist");
          console.error(err);
        },
      }
    );
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

  return (
    <div className="">
      <DynamicPageTitle pageTitle={pageTitle} />

      <motion.div
        className="grid lg:grid-cols-12 grid-cols-1 lg:gap-8 gap-2 justify-between lg:py-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={containerVariants}
      >
        {/* ------> LEFT SIDE MAIN IMAGE ------> */}
        <div
          className="lg:col-span-6 col-span-12 rounded-lg lg:p-4 p-2 border border-base-content/15 shadow"
          variant={itemVariants}
        >
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
          <div className="mt-4">
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

          <div className="mt-4">
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

        {/* ------> RIGHT SIDE DETAILS DATA ------> */}
        <motion.div
          className="lg:col-span-6 col-span-12 lg:space-y-6 space-y-2 border border-base-content/15 shadow lg:p-4 p-2 rounded-lg"
          variant={itemVariants}
        >
          <h2 className="lg:text-2xl text-xl lg:font-extrabold font-bold font-sans">
            Product ➡️ {productDetail?.name}
          </h2>
          <h3 className="lg:text-xl text-xl lg:font-extrabold font-bold font-sans">
            Brand ➡️ {productDetail?.brand}
          </h3>
          <p className="text-justify">
            <strong>Description: </strong>
            {isExpanded
              ? productDetail?.description
              : textShortener(productDetail?.description, 500)}
            {productDetail?.description &&
            productDetail?.description.length >= 500 ? (
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

          {/* VARIANT CONTROLS FOLLOW --> */}

          {/* Variant wise price display */}
          <p className="text-xl font-bold">
            Variant Price: $ {selectedVariant?.price.toFixed(2)}
          </p>

          {/* Stock display */}
          {selectedVariant?.stock && (
            <p
              className={`font-semibold ${
                selectedVariant?.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {selectedVariant.stock > 0
                ? `Product: ${productDetail?.name} || Brand: ${productDetail?.brand} || In stock ➡️ ${selectedVariant?.stock}`
                : "Out of stock!"}
            </p>
          )}

          {/* Quantity selector */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="btn btn-sm text-xl border border-base-content/15"
            >
              -
            </button>
            <span className="font-semibold text-xl border border-base-content/40 px-3 py-1 rounded-md shadow">
              {quantity}{" "}
            </span>
            <button
              className={
                quantity >= (selectedVariant?.stock || 1)
                  ? "btn btn-sm text-xl opacity-20 cursor-not-allowed border-red-500"
                  : "btn btn-sm text-xl border border-base-content/15"
              }
              onClick={() =>
                setQuantity((q) => Math.min(selectedVariant.stock || 1, q + 1))
              }
              disabled={quantity >= (selectedVariant?.stock || 1)}
            >
              +
            </button>
            <p className="text-xs font-bold">
              {quantity >= (selectedVariant?.stock || 1) ? (
                <span className="text-red-500 flex items-center gap-1">
                  <AlertTriangle size={18} /> Can not buy more than in stock.
                </span>
              ) : (
                <span className="flex items-center gap-1 lg:text-sm text-xs">
                  <ShoppingCart size={18} />
                  Add more quantity
                </span>
              )}
            </p>
          </div>

          {/* SELECTED VARIANTS DETAILS */}
          {selectedVariant && (
            <div className="flex flex-col border border-base-content/15 shadow hover:shadow-xl lg:p-4 p-2 rounded-md bg-base-100">
              <div className="">
                <h2 className="lg:text-2xl text-xl font-bold flex items-center gap-2">
                  <ShoppingCart /> Selected Variant Details
                </h2>
              </div>
              <div className="flex flex-row items-center flex-wrap mt-2">
                {/*Variant Image */}
                <div className="">
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
                <div className="flex flex-col lg:ml-6 ml-2">
                  <div className="">
                    {productDetail && (
                      <div className="mt-2">
                        <h2 className="font-semibold mb-1">
                          Product: {productDetail.name}
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
                        ⏺️ Price: ${selectedVariant?.price.toFixed(2)} ⏺️ Color:{" "}
                        {selectedVariant?.color} ⏺️ Size:{" "}
                        {selectedVariant?.size}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Variants display */}
          <div className="flex items-center lg:space-x-3 space-x-2 gap- mt-4 flex-wrap">
            {/* Color display & Variant Selector */}
            <h3 className="font-semibold hidden lg:block">Color ➡️</h3>
            {colors.map((color, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full cursor-pointer border-4 bg-base-100 ${
                  selectedColor === color
                    ? "border border-cyan-400 p-2 ring-2 ring-offset-2 ring-offset-cyan-400"
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

          {/* Action Buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              variant="primary"
              icon={LucideIcon.ShoppingCart}
              className="btn lg:btn-md btn-sm"
              onClick={handleAddToCart}
              disabled={selectedVariant?.stock <= 0}
            >
              Add to Cart
            </Button>

            <Button
              variant="indigo"
              icon={LucideIcon.Heart}
              className="btn lg:btn-md btn-sm"
              onClick={() => handleAddToWishlist(productData?._id)}
            >
              {inWishList ? "In Wishlist" : "Add to Wishlist"}
            </Button>
            <Link to="/">
              <Button
                variant="primary"
                icon={LucideIcon.Home}
                className="btn lg:btn-md btn-sm"
              >
                Go Home
              </Button>
            </Link>
          </div>

          {/* Mobile Sticky Add to Cart */}
          <div
            className={`fixed left-0 right-0 bottom-0 z-40 lg:hidden transition-transform duration-300 ${
              showSticky ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div className="bg-white p-3 border-t border-base-content/10 flex items-center justify-between">
              <div>
                <div className="font-bold">
                  ${selectedVariant?.price ?? productDetail.price}
                </div>
                <div className="text-xs text-muted">{productDetail.name}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="btn btn-sm"
                >
                  -
                </button>
                <div className="px-3 py-1 border rounded">{quantity}</div>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="btn btn-sm"
                >
                  +
                </button>
                <button
                  onClick={handleAddToCart}
                  className="bg-black text-white px-4 py-2 rounded"
                  aria-label="Add to cart sticky"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProductDetails;
