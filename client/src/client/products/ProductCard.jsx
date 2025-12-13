import Button from "../../common/components/ui/Button";
import { Link } from "react-router-dom";
import { LucideIcon } from "../../common/lib/LucideIcons";
import StarRating from "../../common/components/ui/StartRating";
import textShortener from "../../utils/textShortener";
import { useEffect } from "react";
import { injectJsonLd } from "../../common/utils/injectJsonLd/injectJsonLd.js";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
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
        <p className="text-sm text-base-content/70">
          {textShortener(product.description, 80)}
        </p>

        <div className="flex items-center justify-between">
          <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
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

// import Button from "../../common/components/ui/Button";
// import { Link } from "react-router-dom";
// import { LucideIcon } from "../../common/lib/LucideIcons";
// import StarRating from "../../common/components/ui/StartRating";
// import textShortener from "../../utils/textShortener";
// import { useEffect } from "react";
// import { injectJsonLd } from "../../common/utils/injectJsonLd/injectJsonLd.js";

// const ProductCard = ({ product }) => {
//   const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
//   const rating = [5, 4, 3, 4.5];

//   // ✅ Inject JSON-LD for SEO
//   useEffect(() => {
//     if (!product) return;

//     injectJsonLd({
//       "@context": "https://schema.org",
//       "@type": "Product",
//       name: product.name,
//       image: product.images || [product.image],
//       description: product.description,
//       sku: product._id,
//       brand: "Nova-Cart",
//       offers: {
//         "@type": "Offer",
//         priceCurrency: "USD",
//         price: product.price,
//         availability: "https://schema.org/InStock",
//         url: `${window.location.origin}/product-details/${product._id}`,
//       },
//     });
//   }, [product]);

//   return (
//     <div className="lg:col-span-4 col-span-12 shadow rounded-xl lg:space-y-4 space-y-2 border border-base-content/10 bg-base-100">
//       <div className="bg-base-300 rounded-t-xl pb-4">
//         {product?.image ? (
//           <img
//             src={product?.image ? product.image : product.images[0]}
//             alt={product?.name}
//             className="h-36 object-contain rounded-t-xl w-full"
//           />
//         ) : (
//           product.images[0] && (
//             <img
//               src={`${apiURL}${product.images[0].startsWith("/") ? "" : "/"}${
//                 product.images[0]
//               }`}
//               alt={product.name || ""}
//               className="h-36 object-contain rounded-t-xl w-full"
//             />
//           )
//         )}
//       </div>

//       <div className="lg:space-y-3 lg:p-4 p-2 space-y-2 bg-base-100/25">
//         <h4 className="lg:text-xl font-bold">{product?.name}</h4>
//         <p>{textShortener(product?.description, 85)}</p>
//         <div className="flex items-center justify-between">
//           <p className="lg:text-xl font-bold">$ {product?.price.toFixed(2)}</p>
//           <div className="text-xl">{StarRating(rating)}</div>
//         </div>
//         <div className="lg:flex lg:space-x-4 space-x-2">
//           <Link to={`/product-details/${product._id}`}>
//             <Button icon={LucideIcon.Eye} variant="base" className=" ">
//               View Details
//             </Button>
//           </Link>
//           <Link to="/client-cart-management">
//             <Button variant="base" icon={LucideIcon.ShoppingCart} className=" ">
//               Start Shopping
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
