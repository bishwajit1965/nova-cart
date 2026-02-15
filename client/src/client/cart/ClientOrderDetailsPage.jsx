import {
  Clock,
  CreditCardIcon,
  FileDown,
  Loader,
  ShoppingCart,
} from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";

import Button from "../../common/components/ui/Button";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { LucideIcon } from "../../common/lib/LucideIcons";
import api from "../../common/lib/api";
import toast from "react-hot-toast";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import { useState } from "react";
import OrderTimeline from "./components/OrderTimeline";
import { FaRegAddressCard } from "react-icons/fa";

const ClientOrderDetailsPage = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [loading, setLoading] = useState(false);
  const loaderData = useLoaderData();
  const order = loaderData?.data?.data;
  const navigate = useNavigate();
  const pageTile = usePageTitle();

  const handleDownloadInvoice = async (orderId) => {
    try {
      setLoading(true);
      const response = await api.get(`/client/orders/${orderId}/invoice`, {
        responseType: "blob", // important for PDF
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  console.log("Order Data", order);
  const handleReorder = () => {
    // I can push items back to cart
    // e.g., navigate("/client-cart-management", { state: { items: order.items } });
    toast.success("Items added to your cart!");
    navigate("/client-cart-management", { state: { items: order.items } });
  };

  return (
    <div>
      <DynamicPageTitle pageTitle={`Client Order Details ${pageTile}`} />

      <div className="lg:max-w-7xl mx-auto lg:p-0 p-2 lg:space-y-6 space-y-2 space-t-4">
        <div className="border border-base-content/15 shadow lg:p-4 p-2 rounded-lg bg-base-200">
          <h2 className="lg:text-2xl text-lg font-bold lg:mb-4 mb-2 flex items-center gap-2">
            <ShoppingCart /> Order ID: {order?.orderId}
          </h2>
          <p>
            Status: <span className="text-blue-700">{order?.status}</span>
          </p>
          <p>Discount: ${order?.discountAmount}</p>
          <p>
            Total: $
            {order?.totalAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        {/* ----------> Shipping Address ----------> */}
        <div className="border border-base-content/15 shadow lg:p-4 p-2 rounded-lg bg-base-100">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            {" "}
            <FaRegAddressCard /> Shipping Address
          </h3>
          <p>{order?.shippingAddress?.fullName}</p>
          <p>{order?.shippingAddress?.phone}</p>
          <p>
            {order?.shippingAddress?.addressLine1},{" "}
            {order?.shippingAddress?.addressLine2}
          </p>
          <p>
            {order?.shippingAddress?.city}, {order?.shippingAddress?.postalCode}
          </p>
          <p>{order?.shippingAddress?.country}</p>
        </div>

        {/* ----------> Payment Info ----------> */}
        <div className="border border-base-content/15 shadow lg:p-4 p-2 rounded-lg bg-base-100">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <CreditCardIcon />
            Payment
          </h3>
          <p>Method: {order?.paymentMethod}</p>
          <p>Status: {order?.paymentStatus}</p>
        </div>

        {/* ----------> Items ----------> */}
        <div className="">
          {order?.items?.map((item) => {
            const variant = item?.product?.variants?.find(
              (v) => v._id === item?.variantId,
            );

            const price = variant?.price ?? item?.price ?? 0;
            return (
              <div
                key={item?._id}
                className="flex items-center flex-wrap justify-between border-b border-base-content/15 lg:py-2 py-2"
              >
                <img
                  src={`${apiURL}${item?.image || variant?.images?.[0] || item?.product?.images?.[0]}`}
                  alt={item?.name}
                  className="w-20 object-cover rounded"
                />
                <div className="flex items-center lg:space-x-2">
                  <span className="font-bold">{item?.name} ➡️</span>
                  <span>
                    Price: $
                    {price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>{" "}
                  <span> x </span> <p>Qty: {item?.quantity}</p>
                </div>
                <div className="">
                  $
                  {(price * item?.quantity).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            );
          })}
          <div className="lg:space-y-4 space-y-2">
            <div className="text-right border-b border-base-content/15 font-bold lg:py-2 py-2">
              Subtotal: $
              {order.items
                .reduce((sum, i) => {
                  const variant = i?.product?.variants?.find(
                    (v) => v._id === i?.variantId,
                  );
                  const price = variant?.price ?? i?.price ?? 0;
                  return sum + price * i.quantity;
                }, 0)
                .toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </div>
            <div className="text-right font-bold">
              Coupon Discount - $
              {order?.discountAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="flex items-center justify-end font-black space-x-4">
              <span className="lg:text-2xl text-lg"> Total payable:</span>{" "}
              <span className="bg-indigo-800 lg:p-2 p-1 rounded-md shadow text-white lg:text-2xl text-lg">
                $
                {(order?.totalAmount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* ---------> Order Status Timeline ---------> */}
        <div className="border border-base-content/15 shadow lg:p-4 p-2 rounded-lg bg-base-100 hover:shadow-md">
          <h3 className="font-semibold mb-2 flex items-center space-x-2">
            <Clock /> <span>Order Timeline</span>
          </h3>
          <OrderTimeline
            statusHistory={order.statusHistory}
            currentStatus={order.status} // e.g., "processing"
            order={order}
          />
        </div>

        {/*------> Order status ------> */}
        <div className="">
          {order?.statusHistory?.map((s, idx) => (
            <div
              key={idx}
              className="space-x-2 lg:flex lg:space-y-0 space-y-4 items-center"
            >
              <div className="flex items-center gap-2">
                <LucideIcon.CalendarClock />{" "}
                {new Date(s.date).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                ➡️{" "}
              </div>
              <div className="capitalize space-x-4">
                {s.status === "pending" ? (
                  <span className="bg-yellow-100 px-2 py-1 shadow rounded-md font-semibold text-green-600">
                    {s.status}
                  </span>
                ) : s.status === "processing" ? (
                  <span className="bg-green-100 px-2 py-1 shadow rounded-md font-semibold text-primary">
                    {s.status}
                  </span>
                ) : s.status === "cancelled" ? (
                  <span className="bg-red-100 px-2 py-1 shadow rounded-md font-semibold text-info">
                    {s.status}
                  </span>
                ) : s.status === "shipped" ? (
                  <span className="bg-blue-100 px-2 py-1 shadow rounded-md font-semibold text-purple-600">
                    {s.status}
                  </span>
                ) : s.status === "delivered" ? (
                  <span className="bg-purple-100 px-2 py-1 shadow rounded-md font-semibold text-green-600">
                    {s.status}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="px-2 py-1 rounded-md bg-purple-500 text-gray-100">
                Total: $
                {order?.totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          ))}
        </div>

        {/* --------> Action Buttons --------> */}
        <div className="lg:flex grid lg:justify-center justify-center lg:space-x-4 space-y-3 lg:space-y-0 lg:mt-12 mt-4 w-full">
          <Button
            variant="successOutline"
            onClick={() => handleDownloadInvoice(order?.orderId)}
            disabled={loading}
            className=""
          >
            {loading ? (
              <Loader className="animate-spin text-indigo-500" />
            ) : (
              <FileDown size={20} />
            )}
            {loading ? "Downloading..." : "Download Invoice"}
          </Button>
          <Button variant="primary" onClick={handleReorder} className="">
            <ShoppingCart size={20} />
            Like to Reorder ?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientOrderDetailsPage;
