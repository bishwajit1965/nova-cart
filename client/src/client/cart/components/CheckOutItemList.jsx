import { LucideIcon } from "../../../common/lib/LucideIcons";
import NoDataFound from "../../../common/components/ui/NoDataFound";

const CheckOutItemList = ({ items }) => {
  console.log("Items", items);
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const pageTitle = "Verify Checkout Items";
  return (
    <div className="lg:space-y-2 space-y-2">
      <div className="lg:p-4 bg-base-200 rounded-t-lg border border-base-content/15">
        <h2 className="lg:text-2xl text-xl font-bold flex items-center space-x-2">
          <LucideIcon.CircleCheckBig size={25} className="w- h-" />
          <span>{pageTitle}</span>
        </h2>
      </div>
      {items?.length === 0 ? (
        <NoDataFound />
      ) : (
        items?.map((item) => (
          <div
            key={item.product._id}
            className="flex items-center justify-between border border-base-content/15 w-full bg-base-200 rounded-lg"
          >
            <div className="lg:min-w-1/4 min-w-1/4 lg:p-3 p-2">
              {item.product.images && (
                <img
                  src={`${apiURL}${item?.product?.images}`}
                  alt={item?.product?.name}
                  className="lg:h-16 w-14 object-contain"
                />
              )}
            </div>
            <div className="lg:min-w-1/4 min-w-1/4 lg:p-4 p-2">
              <p className="lg:text-xl text-xs lg:font-bold">
                {item.product.name}
              </p>
            </div>
            <div className="lg:min-w-1/4 min-w-1/4 lg:p-4 p-2 text-center">
              <p>Qty: {item.quantity}</p>
            </div>
            <div className="lg:min-w-1/4 min-w-1/4 lg:p-4 p-2 text-right font-bold">
              <p>${(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CheckOutItemList;
