import { Loader, TicketSlash } from "lucide-react";

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
  coupons,
  loader,
}) => {
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    if (coupons?.length > 0 && coupons[0]?.code) {
      setCoupon(coupons[0]?.code);
    }
  }, [coupons]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    // Prefer variant price stored in cart; fallback to product price
    const price = item.price ?? item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const finalTotal = subtotal - discountAmount;

  return (
    <div className="bg-base-1000 lg:space-y-6 rounded-lg sticky top-19 space-y-4">
      <div className="bg-base-200 p-4 rounded-t-lg border-base-content/15 flex items-center border">
        <LucideIcon.ShoppingCart className="w-6 h-6 mr-2" />
        <h2 className="lg:text-2xl text-lg font-bold">Checkout Summary</h2>
      </div>
      <div className="">
        <h2 className="lg:text-xl text-xl -mb-4 mt- mb- font-bold">
          Apply Coupon for Discount
        </h2>
      </div>
      <div className="lg:space-y-4 border border-base-content/15 rounded-lg p-4 shadow hover:shadow-lg">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="input input-bordered w-full text-base-content animate-pulse text-xl font-bold rounded-b-none rounded-t-lg"
        />
        {couponCode && (
          <div className="flex justify-between mb-2 text-green-600 font-medium">
            <span>Coupon ({couponCode}):</span>
            <span> - ${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <Button
          type="submit"
          variant="primary"
          className="w-full rounded-b-lg rounded-t-none border-b-none border-r-none border-r-none border-none hover:text-gray-300"
          onClick={applyCouponHandler}
          disabled={isApplyingCoupon || !couponCode}
        >
          {isApplyingCoupon ? (
            <Loader className="animate-spin" />
          ) : (
            <TicketSlash />
          )}
          {isApplyingCoupon ? "Applying..." : "Apply Coupon"}
        </Button>
      </div>

      <div className="shadow hover:shadow-lg rounded-lg">
        <div className="">
          <h2 className="lg:text-xl text-xl mt-6 mb-2 font-bold">
            Place Order & Checkout
          </h2>
        </div>

        <div className="lg:px-4 px-2 space-y-4 rounded-lg border border-base-content/15 py-4">
          <p className="lg:text-xl font-bold">Total Items: $ {totalItems}</p>
          <p className="lg:text-lg font-bold">
            Subtotal: $ {subtotal.toFixed(2)}
          </p>
          {appliedCoupon && (
            <p className="text-green-600 font-semibold">
              Coupon {appliedCoupon}: - $ {discountAmount.toFixed(2)}
            </p>
          )}
          <p className="lg:text-xl font-bold">
            Total: $ {finalTotal.toFixed(2)}
          </p>

          <div className="">
            <Button
              onClick={handleOrderConfirmation}
              disabled={loader}
              variant="success"
              className="w-full rounded-b-lg rounded-t-none border-b-none border-r-none border-r-none border-none hover:text-gray-300"
            >
              {loader && <Loader className="animate-spin" />}
              <LucideIcon.CreditCard size={25} className="" /> Proceed to
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutSummaryPanel;
