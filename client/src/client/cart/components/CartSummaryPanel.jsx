import { LucideCircleArrowDown, ShoppingCart } from "lucide-react";

import Button from "../../../common/components/ui/Button";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import NoDataFound from "../../../common/components/ui/NoDataFound";

const CartSummaryPanel = ({ cart, handleGenerateCouponCode }) => {
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
    productsOnly.reduce((sum, i) => sum + i?.quantity, 0) +
    productWithVariants.reduce((sum, i) => sum + i.quantity, 0);

  const subTotal =
    productsOnly.reduce((sum, i) => sum + i?.product?.price * i?.quantity, 0) +
    productWithVariants.reduce((sum, i) => sum + i?.price * i?.quantity, 0);

  return (
    <div className="border border-base-content/15 bg-base-100 rounded-lg shadow">
      <div className="flex items-center space-x-2 border-b border-base-content/20 lg:p-2 p-2 bg-base-300 rounded-t-lg">
        <FaShoppingCart size={20} />
        <h2 className="lg:text-xl text-lg font-bold flex items-center gap-2">
          Cart Summary items{" "}
          <span className="w-7 h-7 rounded-full flex items-center justify-center bg-indigo-700 text-[16px] text-white shadow">
            {totalItems}
          </span>
        </h2>
      </div>
      <div className="lg:space-y-4 space-y-2 lg:px-4 lg:py-4 p-2">
        {!cart || cart.length === 0 ? <NoDataFound label="Cart item" /> : null}

        <div className="flex flex-col gap-2 text-sm text-base-content">
          <h3 className="font-bold text-sm flex items-center border-b pb-1 border-base-content/20 gap-1 text-base-content/80 mb-2">
            <LucideCircleArrowDown size={20} /> Product (s) without variants
          </h3>

          {productsOnly?.map((item) => (
            <div key={item?.product?._id} className="flex justify-between">
              <span className="font-medium">
                <span>🔯</span> {item?.product?.name} x {item.quantity}
              </span>
              <span className="font-semibold">
                ${(item?.product?.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <h3 className="font-bold text-sm flex items-center border-b pb-1 border-base-content/20 gap-1 text-base-content my-2">
            <LucideCircleArrowDown size={20} /> Product (s) with variants
          </h3>
          {/* Products with variants */}
          {productWithVariants?.map((item) => (
            <div
              key={`${item?.product?._id}-${item.variantId}`}
              className="flex justify-between"
            >
              <span className="text-sm flex items-center">
                <span className="">🔯</span>
                {item?.product?.name} ({item.color}, {item.size}) x{" "}
                {item.quantity}
              </span>
              <span className="font-semibold">
                ${(item?.price * item?.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total Items:</span>
          <span>{totalItems}</span>
        </div>
      </div>
      <div className="flex justify-between font-bold text-lg bg-base-300 p-2 border-t border-base-content/15">
        <span>Subtotal:</span>
        <span>${subTotal.toFixed(2)}</span>
      </div>

      <div className="w-full border-ts border-base-content/25">
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
