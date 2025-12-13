import { Clock, ShoppingCart } from "lucide-react";
import { useLoaderData, useNavigate } from "react-router-dom";

import Button from "../../common/components/ui/Button";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { LucideIcon } from "../../common/lib/LucideIcons";
import api from "../../common/lib/api";
import toast from "react-hot-toast";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import { useState } from "react";
import OrderTimeline from "./components/OrderTimeline";
import { FaFilePdf } from "react-icons/fa";

const ClientOrderDetailsPage = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [loading, setLoading] = useState(true);
  const loaderData = useLoaderData();
  const order = loaderData?.data?.data;
  const navigate = useNavigate();
  console.log("Order =>", order);
  const pageTile = usePageTitle();

  const handleDownloadInvoice = async (orderId) => {
    try {
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
      alert("Failed to download invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = () => {
    // I can push items back to cart
    // e.g., navigate("/client-cart-management", { state: { items: order.items } });
    toast.success("Items added to your cart!");
    navigate("/client-cart-management", { state: { items: order.items } });
  };

  return (
    <div>
      <DynamicPageTitle pageTitle={`Client Order Details ${pageTile}`} />

      <div className="max-w-4xl mx-auto lg:p-4 lg:space-y-6 space-y-2 space-t-4">
        <div className="border border-base-content/15 shadow lg:p-4 p-2 rounded-lg bg-base-200">
          <h2 className="lg:text-2xl text-xl font-bold lg:mb-4 mb-2">
            Order ID: {order?.orderId}
          </h2>
          <p>
            Status: <span className="text-blue-700">{order?.status}</span>
          </p>
          <p>Total: ${order?.totalAmount.toFixed(2)}</p>
          <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        {/* ----------> Shipping Address ----------> */}
        <div className="border border-base-content/15 shadow lg:p-4 p-2 rounded-lg bg-base-100">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
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
          <h3 className="font-semibold mb-2">Payment</h3>
          <p>Method: {order?.paymentMethod}</p>
          <p>Status: {order?.paymentStatus}</p>
        </div>

        {/* ----------> Items ----------> */}
        <div className="space-y-4">
          {order?.items?.map((item) => (
            <div
              key={item?._id}
              className="flex items-center justify-between border-b border-base-content/15 pb-2"
            >
              <img
                src={`${apiURL}${item?.image}`}
                alt={item?.name}
                className="w-20 object-cover rounded"
              />
              <div>
                <p>{item?.name}</p>
                <p>Qty: {item?.quantity}</p>
                <p>Price: ${item?.price}</p>
              </div>
              <div>${(item?.price * item?.quantity).toFixed(2)}</div>
            </div>
          ))}
          <div className="flex justify-end text-xl font-black">
            Total: ${order?.totalAmount.toFixed(2)}
          </div>
        </div>

        {/* ---------> Order Status Timeline ---------> */}
        <div className="border border-base-content/15 shadow lg:p-4 p-2 rounded-lg bg-base-100">
          <h3 className="font-semibold mb-2 flex items-center space-x-2">
            <Clock /> <span>Order Timeline</span>
          </h3>
          <OrderTimeline
            statusHistory={order.statusHistory}
            currentStatus={order.status} // e.g., "processing"
            order={order}
          />
        </div>
        <div className="">
          <ul className="space-y-1">
            {order?.statusHistory?.map((s, idx) => (
              <li key={idx} className="space-x-2">
                {new Date(s.date).toLocaleString()} ➡️{" "}
                <span className="capitalize space-x-4">
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
                </span>
                <span className="px-2 py-1 rounded-md bg-purple-500 text-gray-100">
                  Total: ${order?.totalAmount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 lg:mt-12 mt-4">
          <Button
            variant="indigoRounded"
            onClick={() => handleDownloadInvoice(order.orderId)}
            className="btn lg:btn-lg btn-sm"
          >
            <FaFilePdf size={18} />
            Download Invoice
          </Button>
          <Button
            variant="defaultRounded"
            onClick={handleReorder}
            className="btn lg:btn-lg btn-sm"
          >
            <ShoppingCart />
            Like to Reorder ?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientOrderDetailsPage;
