import { Link, useLocation } from "react-router-dom";

import Button from "../../common/components/ui/Button";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { LucideIcon } from "../../common/lib/LucideIcons";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const order = location?.state?.order;
  const pageTitle = usePageTitle();
  if (!order?.items || order?.items?.length === 0) {
    return (
      <div className="text-center py-6 font-semibold">No order found.</div>
    );
  }

  console.log("Order confirmation page => order", order);

  const { items, totalAmount, orderId } = order;
  console.log("Items in order:", items);

  return (
    <>
      <DynamicPageTitle pageTitle={pageTitle} />
      <div className="lg:max-w-4xl w-full mx-auto lg:space-y-2">
        <div className="flex justify-center lg:space-x-4 w-full">
          <div className="lg:flex items-center lg:mb-8 mb-4 pb-4 border-b border-base-content/15 lg:pb-6 lg:space-y-2 space-y-2 lg:space-x-4 space-x-2">
            <div className="">
              <LucideIcon.CircleCheckBig className="lg:w-10 lg:h-10 w-10 h-10  text-green-500 lg:text-left mx-auto" />
            </div>
            <div className="lg:space-y-3 space-y-2">
              <h2 className="lg:text-3xl text-lg font-bold text-center text-green-600">
                🎉 Your order has been placed!
              </h2>
              <p className="text-center">
                Order ID:{" "}
                <span className="font-semibold">{orderId || "N/A"}</span>
              </p>
              <p className="text-center text-xs text-gray-500">
                A confirmation email has been sent to your registered address.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {items?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-base-content/15 w-full"
            >
              <div className="lg:w-1/4 w-1/4 pb-2">
                <img
                  src={item?.product?.image}
                  alt={item?.product?.name}
                  className="lg:w-2/5 w-12 object-cover"
                />
              </div>
              <div className="w-1/4">
                {item?.product?.name} x {item?.quantity}
              </div>
              <div className="w-1/4 text-right font-bold">
                ${item?.product?.price * item?.quantity}
              </div>
            </div>
          ))}
        </div>
        <div className="lg:space-y-10 space-y-2">
          <div className="flex justify-between font-bold text-lg lg:my-10">
            <span>Total</span>
            <span>${totalAmount}</span>
          </div>

          <div className="text-center lg:pt-12 pt-4 border-t border-base-content/15">
            <div className="lg:flex justify-center grid lg:space-x-4 space-x-2 lg:space-y-0 space-y-2">
              <Link to="/client-cart-management">
                <Button variant="global" className="lg:w-52 w-52">
                  <LucideIcon.ShoppingCart size={25} /> Continue Shopping
                </Button>
              </Link>
              <Link to="/client-specific-orders">
                <Button variant="global" className="lg:w-52 w-52">
                  <LucideIcon.List size={25} /> My Order Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
