import { Link, useLoaderData } from "react-router-dom";

import Button from "../../common/components/ui/Button";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { LucideIcon } from "../../common/lib/LucideIcons";
import toast from "react-hot-toast";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import { useState } from "react";

const ProductDetails = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const pageTitle = usePageTitle();
  const product = useLoaderData();

  console.log("Product", product);

  const productDetail = {
    image: product.data.image || null,
    images: product.data.images || [],
    name: product.data.name,
    description: product.data.description,
    price: product.data.price,
    stock: product.data.stock,
  };

  // Variant color set
  const colors = Array.from(new Set(product.data.variants.map((v) => v.color)));

  const [quantity, setQuantity] = useState(1);
  const [inWishList, setInWishList] = useState(false);
  const [mainImage, setMainImage] = useState(product?.data?.images[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedVariant, setSelectedVariant] = useState(
    product.data.variants.find((v) => v.color === colors[0])
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

  const handleAddToCart = () => {
    if (productDetail.stock <= 0) {
      toast.error("Out of stock!");
      return;
    }
    // 🚀 Replace with real cart logic
    toast.success(`${quantity} x ${productDetail.name} added to cart`);
  };

  const handleWishlist = () => {
    if (inWishList) {
      toast.success("Already added in wish list!");
    }
    setInWishList(true);
    toast.success("Added to wishlist ❤️");
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const variant = product.data.variants.find((v) => v.color === color);
    setSelectedVariant(variant);
    // Optional: update main image if variant images exist per color
  };

  return (
    <div className="">
      <DynamicPageTitle pageTitle={pageTitle} />

      <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-8 gap-2 justify-between lg:py-10">
        <div className="lg:col-span-6 col-span-2 lg:min-h-96 bg-base-300 rounded-md lg:p-4">
          {productDetail?.image ? (
            <img
              src={
                productDetail?.image
                  ? productDetail.image
                  : productDetail.images[0]
              }
              alt={productDetail?.name}
              className="lg:h-96 lg:w-[31rem] object-contain cursor-pointer transition-transform duration-300 rounded-xl mx-auto"
              style={{
                transform: "scale(1)",
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          ) : (
            productDetail?.images[0] && (
              <img
                src={`${apiURL}${
                  product.data.images[0].startsWith("/") ? "" : "/"
                }${mainImage}`}
                alt={product.name || ""}
                className="lg:h-96 lg:w-[31rem] object-contain cursor-pointer transition-transform duration-300 rounded-xl mx-auto"
                style={{
                  transform: "scale(1)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            )
          )}

          {/* Thumbnails of products */}
          <div className="flex gap-4 flex-wrap py-6">
            {productDetail.images
              ? productDetail.images
                  .filter((_, index) => index !== 0) // Exclude the first image
                  .map((image, index) => (
                    <img
                      key={index}
                      src={`${apiURL}${image}`}
                      className="w-20 h-20 rounded-lg shadow cursor-pointer"
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => setMainImage(image)}
                      // zoom-in effect on hover
                      style={{
                        transform: "scale(1)",
                        transition: "transform 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  ))
              : ""}
          </div>
        </div>
        <div className="lg:col-span-6 col-span-2 lg:space-y-4 space-y-2">
          <h2 className="lg:text-2xl text-xl lg:font-extrabold font-bold">
            Product: {productDetail.name}
          </h2>
          <p>{productDetail.description}</p>

          {/* Variant wise price display */}
          <p className="text-xl font-bold">
            Price: $ {selectedVariant?.price.toFixed(2)}
          </p>
          <p
            className={`font-semibold ${
              selectedVariant.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {selectedVariant.stock > 0
              ? `${selectedVariant.stock} in stock`
              : "Out of stock!"}
          </p>

          {/* Quantity selector */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="btn btn-sm text-xl"
            >
              {" "}
              -{" "}
            </button>
            <span className="font-semibold">{quantity} </span>
            <button
              className="btn btn-sm text-xl"
              onClick={() => setQuantity((q) => Math.max(1, q + 1))}
            >
              {" "}
              +{" "}
            </button>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              variant="primary"
              icon={LucideIcon.ShoppingCart}
              className="btn lg:btn-lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>

            <Button
              variant="indigo"
              icon={LucideIcon.Heart}
              className="btn lg:btn-lg"
              onClick={handleWishlist}
            >
              {inWishList ? "In Wishlist" : "Add to Wishlist"}
            </Button>
            <Link to="/">
              <Button
                variant="primary"
                icon={LucideIcon.Home}
                className="btn lg:btn-lg"
              >
                Home
              </Button>
            </Link>
          </div>
          {/* Variants display */}
          <div className="flex items-center space-x-2 gap-3 mt-4 flex-wrap">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                  selectedColor === color
                    ? "border-black border"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                title={color}
              />
            ))}

            <div className="flex gap-3">
              {sizes.map((size, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 border rounded-md cursor-pointer ${
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
      </div>
    </div>
  );
};

export default ProductDetails;
