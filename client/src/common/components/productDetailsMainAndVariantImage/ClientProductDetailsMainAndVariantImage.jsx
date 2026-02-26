import { AnimatePresence, motion } from "framer-motion";
import { Boxes } from "lucide-react";

import { itemVariants } from "../../../client/service/animations";

const ClientProductDetailsMainAndVariantImage = ({
  selectedVariant,
  mainImage,
  product,
}) => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  // Product details destructured
  const productDetail = {
    image: product.data.image || null,
    images: product.data.images || [],
    name: product.data.name,
    brand: product.data.brand,
    description: product.data.description,
    price: product.data.price,
    stock: product.data.stock,
    rating: product.data.rating,
    reviewsCount: product.data.reviewsCount,
    totalRatingSum: product.data.totalRatingSum,
  };

  /*** ------> Helper to build image URL safely ------> */
  const buildUrl = (src) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    // If it's already like '/uploads/xxx' or '/images/..' keep leading slash
    const cleaned = src.startsWith("/") ? src : `/${src}`;
    return `${apiURL}${cleaned}`;
  };

  // animations
  const mainImgVariants = {
    enter: { opacity: 0, scale: 0.98 },
    center: { opacity: 1, scale: 1, transition: { duration: 0.22 } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.18 } },
  };

  return (
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
      </div>
      {/* Main image */}
      <div className="relative">
        <div className="w-full h-full flex items-center justify-center bg-base-100 rounded-xl p-4">
          <AnimatePresence mode="wait">
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
          </AnimatePresence>
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
              <p className="text-xs">{productDetail?._id}</p>
              <img
                src={buildUrl(img)}
                alt={`thumb-${idx}`}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300"
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
  );
};

export default ClientProductDetailsMainAndVariantImage;
