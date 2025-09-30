import { ListOrdered, ShoppingCart } from "lucide-react";

import Button from "../../../common/components/ui/Button";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const CartSummaryPanel = ({ cart, handleGenerateCouponCode }) => {
  console.log("Cart summary", cart);
  const productsOnly = [];
  const productWithVariants = [];

  cart?.forEach((item) => {
    if (item.variantId) {
      productWithVariants.push(item);
    } else {
      productsOnly.push(item);
    }
  });

  const totalItems =
    productsOnly.reduce((sum, i) => sum + i.quantity, 0) +
    productWithVariants.reduce((sum, i) => sum + i.quantity, 0);

  const subTotal =
    productsOnly.reduce((sum, i) => sum + i.product.price * i.quantity, 0) +
    productWithVariants.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="">
      <div className="flex items-center space-x-2 border-b border-base-content/20 lg:p-5 p-2 bg-base-200">
        <ListOrdered size={25} />
        <h2 className="lg:text-2xl text-lg font-bold">Cart Summary</h2>
      </div>
      <div className="lg:space-y-4 space-y-2 lg:px-4 lg:py-6 p-2">
        {!cart || cart.length === 0 ? (
          <p className="text-center text-red-500">Your cart is empty</p>
        ) : null}

        <div className="flex flex-col gap-2 text-sm">
          {productsOnly?.map((item) => (
            <div key={item.product._id} className="flex justify-between">
              <span className="font-medium">
                {item.product.name} x {item.quantity}
              </span>
              <span className="font-semibold">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          {/* Products with variants */}
          {productWithVariants.map((item) => (
            <div
              key={`${item.product._id}-${item.variantId}`}
              className="flex justify-between"
            >
              <span className="font-medium">
                {item.product.name} ({item.color}, {item.size}) x{" "}
                {item.quantity}
              </span>
              <span className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total Items:</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Subtotal:</span>
          <span>${subTotal.toFixed(2)}</span>
        </div>
      </div>
      <div className="w-full border-t border-base-content/25">
        <Link to="/client-cart-checkout" className="w-full">
          <Button
            onClick={handleGenerateCouponCode}
            variant="indigo"
            className="w-full lg:text-xl rounded-t-none rounded-b-lg border-none"
          >
            <ShoppingCart /> Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CartSummaryPanel;
