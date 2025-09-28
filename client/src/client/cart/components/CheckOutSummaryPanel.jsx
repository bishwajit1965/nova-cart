import Button from "../../../common/components/ui/Button";
import { LucideIcon } from "../../../common/lib/LucideIcons";
import { useEffect } from "react";
import { useState } from "react";

const CheckOutSummaryPanel = ({
  items,
  handleOrderConfirmation,
  couponCode,
  setCouponCode,
  applyCouponHandler,
  isApplyingCoupon,
  appliedCoupon,
  discountAmount,
  orders,
  coupons,
}) => {
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    if (coupons?.length > 0 && coupons[0]?.code) {
      setCoupon(coupons[0]?.code);
    }
  }, [coupons]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const finalTotal = subtotal - discountAmount;

  return (
    <div className="bg-base-100 shadow lg:space-y-6 rounded-lg sticky top-19 space-y-4">
      <div className="bg-base-200 p-4 rounded-t flex items-center">
        <LucideIcon.ShoppingCart className="w-6 h-6 mr-2" />
        <h2 className="lg:text-2xl text-lg font-bold">Checkout Summary</h2>
      </div>
      <div className="my-4 px-2 space-y-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={coupon}
          onChange={(e) => setCouponCode(e.target.value)}
          className="input input-bordered w-full text-indigo-500 text-xl font-bold"
        />
        <button
          type="submit"
          className="btn btn-primary mt-2 w-full"
          onClick={applyCouponHandler}
          disabled={isApplyingCoupon || !coupon}
        >
          {isApplyingCoupon ? "Applying..." : "Apply Coupon"}
        </button>

        {coupon && (
          <div className="flex justify-between mb-2 text-green-600 font-medium">
            <span>Coupon ({coupon}):</span>
            <span> - ${discountAmount.toFixed(2)}</span>
          </div>
        )}
      </div>
      <div className="divider px-2"></div>

      <div className="lg:px-4 px-2 space-y-4">
        <p className="lg:text-xl font-bold">Total Items: {totalItems}</p>
        <p className="lg:text-lg font-bold">Subtotal: ${subtotal.toFixed(2)}</p>
        {appliedCoupon && (
          <p className="text-green-600 font-semibold">
            Coupon {appliedCoupon}: - ${discountAmount.toFixed(2)}
          </p>
        )}
        <p className="lg:text-xl font-bold">Total: ${finalTotal.toFixed(2)}</p>
      </div>

      <Button
        onClick={handleOrderConfirmation}
        variant="indigo"
        className="w-full rounded-b-lg rounded-t-none border-b-none border-r-none border-r-none lg:text-lg border-none"
      >
        <LucideIcon.CreditCard size={25} className="" /> Proceed to Payment
      </Button>
    </div>
  );
};

export default CheckOutSummaryPanel;
