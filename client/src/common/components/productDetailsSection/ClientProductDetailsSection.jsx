import { useState } from "react";
import textShortener from "../../../utils/textShortener";
import StarRating from "../ui/StartRating";

const ClientProductDetailsSection = ({ productDetail }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="lg:space-y-4 space-y-3 lg:mt-4 mt-2">
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
        productDetail?.description?.length >= 165 ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-indigo-500 link ml-1 text-sm font-semibold"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        ) : null}
      </p>

      <div className="flex flex-wrap items-center justify-between font-bold">
        <p className="">
          Product Price: ${productDetail?.price?.toFixed(2) ?? "0.00"}
        </p>
        <div className="flex items-center gap-1">
          <span
            className={`${productDetail?.rating === 0 ? "text-base-content/25" : "text-base-content/70"}`}
          >
            Rating:
          </span>
          <span
            className={`${productDetail?.rating === 0 ? "text-base-content/25" : "text-base-content/70"} font-bold w-6 h-6 rounded-full bg-emerald-500 text-xs flex items-center justify-center border-2 text-white shadow`}
          >
            {productDetail?.rating ?? 0}
          </span>
          <span>
            <StarRating rating={productDetail?.rating ?? 0} />
          </span>
          <span className="text-sm">{`(${productDetail?.reviewsCount || 0} reviews)`}</span>
        </div>
      </div>
    </div>
  );
};

export default ClientProductDetailsSection;
