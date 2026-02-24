import Button from "../../common/components/ui/Button";
import { LucideIcon } from "../../common/lib/LucideIcons";
import StarRating from "../../common/components/ui/StartRating";
import textShortener from "../../utils/textShortener";
import { useEffect, useState } from "react";
import { injectJsonLd } from "../../common/utils/injectJsonLd/injectJsonLd.js";
import { motion } from "framer-motion";
import useRecentlyViewed from "../../common/hooks/useRecentlyViewed.js";

const ProductCard = ({ product }) => {
  const { addRecentlyViewed } = useRecentlyViewed();
  const [isExpanded, setIsExpanded] = useState(false);
  const [productId, setProductId] = useState(null);
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  // const rating = [5, 4, 3, 4.5];

  console.log("Product=====>", product);

  // ✅ Inject JSON-LD for SEO
  useEffect(() => {
    if (!product) return;
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.images || [product.image],
      description: product.description,
      sku: product._id,
      brand: "Nova-Cart",
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: product.price,
        availability: "https://schema.org/InStock",
        url: `${window.location.origin}/product-details/${product._id}`,
      },
    });
  }, [product]);

  const handleView = () => {
    addRecentlyViewed({ productId: product._id });
    // optionally navigate
    window.location.href = `/product-details/${product._id}`;
  };

  /*** ------> Toggle read more and read less ------> */
  const handleToggleView = (product) => {
    setIsExpanded((prev) => !prev);
    setProductId(product._id);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="lg:col-span-4 col-span-12 bg-base-100 border border-base-content/10 rounded-xl shadow-lg overflow-hidden relative group"
    >
      {/* Image & Quick Actions Overlay */}
      <div className="relative">
        <img
          src={
            product?.image
              ? product.image
              : `${apiURL}${product.images[0].startsWith("/") ? "" : "/"}${
                  product.images[0]
                }`
          }
          alt={product.name}
          className="h-44 w-full object-contain bg-base-200 rounded-t-xl transition-transform duration-300 group-hover:scale-105"
        />

        {/* Quick Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-t-xl hover:bg-base-100">
          <Button
            href="/client-cart-management"
            icon={LucideIcon.ShoppingCart}
            size="xs"
            variant="base"
          >
            Add to Cart
          </Button>

          <Button
            href="/client-product-wishlist"
            icon={LucideIcon.Heart}
            size="xs"
            variant="default"
          >
            Wishlist
          </Button>
        </div>

        {/* Badge Example */}
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-indigo-500 text-white px-2 py-1 text-xs font-bold rounded">
            NEW
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h4 className="font-bold text-lg">{product.name}</h4>

        <p className="text-sm text-gray-500 max-h-24 overflow-y-auto">
          {isExpanded && productId === product._id
            ? product.description
            : textShortener(product.description, 112)}

          <button
            onClick={() => handleToggleView(product)}
            className="text-sm text-indigo-500 font-bold link ml-1"
          >
            {isExpanded && productId === product._id
              ? "Read Less"
              : "Read More"}
          </button>
        </p>

        <div className="flex items-center justify-between">
          <p className="font-bold text-lg">
            $
            {product.price.toLocaleString(undefined, {
              maximumFractionPoints: 2,
              minimumFractionPoints: 2,
            })}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`${product?.rating === 0 ? "text-base-content/25" : "text-base-content/70"} font-bold`}
            >
              Rating:
            </span>
            <span
              className={`${product?.rating === 0 ? "text-base-content/25" : "text-base-content/70"} font-bold`}
            >
              {product?.rating ?? 0}
            </span>
            <span>
              <StarRating rating={product?.rating ?? 0} />
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleView}
            icon={LucideIcon.Eye}
            size="xs"
            variant="indigo"
          >
            View Details
          </Button>

          <Button
            href="/client-cart-management"
            icon={LucideIcon.Rocket}
            size="xs"
            variant="success"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
