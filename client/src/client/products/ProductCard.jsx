import Button from "../../common/components/ui/Button";
import { Link } from "react-router-dom";
import { LucideIcon } from "../../common/lib/LucideIcons";
import StarRating from "../../common/components/ui/StartRating";
import textShortener from "../../utils/textShortener";
import { useEffect, useState } from "react";
import { injectJsonLd } from "../../common/utils/injectJsonLd/injectJsonLd.js";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [productId, setProductId] = useState(null);
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const rating = [5, 4, 3, 4.5];

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
          <Link to="/client-cart-management">
            <Button icon={LucideIcon.ShoppingCart} variant="baseRounded">
              Add to Cart
            </Button>
          </Link>
          <Link to="/client-product-wishlist">
            <Button icon={LucideIcon.Heart} variant="defaultRounded">
              Wishlist
            </Button>
          </Link>
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

        <p className="text-sm text-gray-500 max-h-18 overflow-y-auto">
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
          <div className="text-sm">{StarRating(rating)}</div>
        </div>

        <div className="flex gap-2">
          <Link to={`/product-details/${product._id}`}>
            <Button icon={LucideIcon.Eye} variant="indigoRounded">
              View
            </Button>
          </Link>
          <Link to="/client-cart-management">
            <Button icon={LucideIcon.Rocket} variant="successRounded">
              Buy Now
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
