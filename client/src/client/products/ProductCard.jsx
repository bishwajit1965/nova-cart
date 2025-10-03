import Button from "../../common/components/ui/Button";
import { Link } from "react-router-dom";
import { LucideIcon } from "../../common/lib/LucideIcons";
import StarRating from "../../common/components/ui/StartRating";
import textShortener from "../../utils/textShortener";

const ProductCard = ({ product }) => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const rating = [5, 4, 3, 4.5];
  return (
    <div className="lg:col-span-4 col-span-12 shadow rounded-xl lg:space-y-4 space-y-2 border border-base-content/10 bg-base-100">
      <div className="bg-base-300 rounded-t-xl pb-4">
        {product?.image ? (
          <img
            src={product?.image ? product.image : product.images[0]}
            alt={product?.name}
            className="h-36 object-contain rounded-t-xl w-full"
          />
        ) : (
          product.images[0] && (
            <img
              src={`${apiURL}${product.images[0].startsWith("/") ? "" : "/"}${
                product.images[0]
              }`}
              alt={product.name || ""}
              className="h-36 object-contain rounded-t-xl w-full"
            />
          )
        )}
      </div>

      <div className="lg:space-y-3 lg:p-4 p-2 space-y-2 bg-base-100/25">
        <h4 className="lg:text-xl font-bold">{product?.name}</h4>
        <p>{textShortener(product?.description, 85)}</p>
        <div className="flex items-center justify-between">
          <p className="lg:text-xl font-bold">$ {product?.price.toFixed(2)}</p>
          <div className="text-xl">{StarRating(rating)}</div>
        </div>
        <div className="lg:flex lg:space-x-4 space-x-2">
          <Link to={`/product-details/${product._id}`}>
            <Button icon={LucideIcon.Eye} variant="base" className=" ">
              View Details
            </Button>
          </Link>
          <Link to="/client-cart-management">
            <Button variant="base" icon={LucideIcon.ShoppingCart} className=" ">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
