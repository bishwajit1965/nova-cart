import { ListOrdered, ShoppingCart } from "lucide-react";

import Button from "../../../common/components/ui/Button";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const CartSummaryPanel = ({ cart, handleGenerateCouponCode, coupons }) => {
  console.log("Cart summary", cart);

  // Group products by ID and sum quantities
  const summary = useMemo(() => {
    if (!cart) return [];
    return cart.reduce((acc, item) => {
      const existing = acc.find((i) => i.product._id === item.product._id);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);
  }, [cart]);

  // Calculate total items & subtotal
  const totalItems = summary.reduce((sum, item) => sum + item.quantity, 0);
  const subTotal = summary.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );
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

        <div className="flex flex-col gap-2">
          {summary.map((item) => (
            <div key={item.product._id} className="flex justify-between">
              <span className="font-medium">
                {item.product.name} x {item.quantity}
              </span>
              <span className="font-semibold">
                ${(item.product.price * item.quantity).toFixed(2)}
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
