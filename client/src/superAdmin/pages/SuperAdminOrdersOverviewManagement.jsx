import { Eye } from "lucide-react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Badge from "../../common/components/ui/Badge";
import Button from "../../common/components/ui/Button";
import { MiniIconButton } from "../../common/components/ui/MiniIconButton";
import Modal from "../../common/components/ui/Modal";
import NoDataFound from "../../common/components/ui/NoDataFound";
import Pagination from "../../common/pagination/Pagination";
import SearchBox from "../../common/components/ui/SearchBox";
import SelectFilter from "../../common/components/ui/SelectFilter";
import api from "../services/api/api";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";

const STATUSES = ["pending", "processing", "shipped", "delivered"];

const SuperAdminOrdersOverviewManagement = () => {
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // For search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // pending, processing, shipped, delivered, cancelled
  const [paymentFilter, setPaymentFilter] = useState(""); // unpaid, paid, failed
  const [filteredOrders, setFilteredOrders] = useState([]); // assuming `orders` is the fetched list

  /** --------> Fetch Orders Query --------> */
  const {
    data: orders,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
  } = useApiQuery({
    url: API_PATHS.ORDERS.ENDPOINT,
    queryKey: API_PATHS.ORDERS.KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const [paginatedData, setPaginatedData] = useState(orders || []);
  // To display total permissions in pagination
  const dataLength = orders?.length;

  console.log("Orders length", dataLength);

  /** --------> Filtering searched term --------> */
  useEffect(() => {
    // if API returns { data: [...] } adjust here
    const safeOrders = Array.isArray(orders) ? orders : orders?.data || [];

    let tempOrders = [...safeOrders];

    if (statusFilter) {
      tempOrders = tempOrders.filter((order) => order.status === statusFilter);
    }

    if (paymentFilter) {
      tempOrders = tempOrders.filter(
        (order) => order.paymentStatus === paymentFilter
      );
    }

    if (searchTerm) {
      tempOrders = tempOrders.filter((order) =>
        order.shippingAddress.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(tempOrders);
  }, [searchTerm, statusFilter, paymentFilter, orders]);

  /** --------> Open Modal --------> */
  const modalToggler = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  /** --------> Update Order Status -------- */
  const updateOrderMutation = useApiMutation({
    method: "update",
    path: (payload) => `${API_PATHS.ORDERS.ENDPOINT}/${payload.orderId}`,
    key: API_PATHS.ORDERS.KEY, // used by useQuery
    onSuccess: () => {},
    onError: (error) => {
      toast.error("Error updating order status");
      console.error(error);
    },
  });

  const handleStatusChange = (orderId, status) => {
    const payload = { orderId, data: { status } };
    updateOrderMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Status is updated!");
      },
      onError: () => {
        toast.error("Error in updating status!");
      },
    });
  };

  /** --------> Use Fetched Data Status Handler --------> */
  const ordersStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
    label: "orders-super-admin",
  });

  /** --------> Download order in PDF -------->*/
  const handleDownloadInvoice = async (orderId) => {
    try {
      setLoadingInvoice(true);
      const response = await api.get(`/superAdmin/orders/${orderId}/invoice`, {
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
      setLoadingInvoice(false);
    }
  };

  return (
    <>
      {/**------> Orders section data loader status ------> */}
      {ordersStatus.status !== "success" ? (
        ordersStatus.content
      ) : (
        <div className="">
          {/* -------> Search and filter ------> */}
          <div className="flex flex-wrap lg:gap-4 gap-2 mb-4 items-end justify-between">
            {/* Search */}
            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search orders, user, or ID..."
            />

            {/* Status Filter */}
            <SelectFilter
              label="Order Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "pending", label: "Pending" },
                { value: "processing", label: "Processing" },
                { value: "shipped", label: "Shipped" },
                { value: "delivered", label: "Delivered" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />

            {/* Payment Filter */}
            <SelectFilter
              label="Payment Status"
              value={paymentFilter}
              onChange={setPaymentFilter}
              options={[
                { value: "unpaid", label: "Unpaid" },
                { value: "paid", label: "Paid" },
                { value: "failed", label: "Failed" },
              ]}
            />
          </div>
          <div className="lg:space-y-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="table table-sm w-full">
                <thead className="bg-base-300">
                  <tr>
                    <th>OrderId</th>
                    <th>Customer</th>
                    <th>Total Amount</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Select Status</th>
                    <th>Created At</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-4 text-gray-500"
                      >
                        <NoDataFound label="No orders" />
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((order) => (
                      <tr key={order._id}>
                        {console.log(
                          "Order status=>",
                          order.orderId,
                          order.status
                        )}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                {order?.items.map((item) => (
                                  <img
                                    key={item._id}
                                    src={item?.image}
                                    alt={item?.name}
                                    className="h-12 w-12"
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{order?.orderId}</div>
                            </div>
                          </div>
                        </td>
                        <td>{order?.shippingAddress?.fullName ?? "N/A"}</td>
                        <td>${order.totalAmount.toFixed(2)}</td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`px-2 py-1 rounded text-white ${
                              order?.paymentStatus === "paid"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {order?.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className="px-2 py-1 rounded bg-blue-500 text-white">
                            {order?.status}
                          </span>
                        </td>
                        <td>
                          <select
                            value={order?.status}
                            onChange={(e) =>
                              handleStatusChange(order?.orderId, e.target.value)
                            }
                            className="p-2"
                          >
                            {STATUSES?.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2 text-center">
                          {new Date(order?.createdAt).toLocaleDateString()}
                        </td>
                        <th>
                          <span className="flex justify-end">
                            <div className="flex items-center space-x-2">
                              <MiniIconButton
                                icon="view"
                                variant="indigo"
                                onClick={() => modalToggler(order)}
                              >
                                <span className="flex items-start pl-0">
                                  <Eye
                                    size={18}
                                    className="text-start ml-0 pl-0"
                                  />
                                </span>
                                <span>View in Details</span>
                              </MiniIconButton>
                              <MiniIconButton
                                onClick={() =>
                                  handleDownloadInvoice(order?.orderId)
                                }
                                tooltip="Download PDF"
                                icon="download"
                                disabled={loadingInvoice}
                                variant="success"
                              ></MiniIconButton>
                            </div>
                          </span>
                        </th>
                      </tr>
                    ))
                  )}
                </tbody>

                <tfoot className="bg-base-300">
                  <tr>
                    <th>OrderId</th>
                    <th>Customer</th>
                    <th>Total Amount</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Select Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* pagination begins*/}
            <Pagination
              items={filteredOrders}
              dataLength={dataLength}
              onPaginatedDataChange={setPaginatedData}
            />

            {/** ------> Modal to display order details ------> */}
            {isModalOpen && (
              <Modal
                isOpen={isModalOpen}
                title="Super Admin Order Details View"
                onClose={() => setIsModalOpen(null)}
              >
                <div className="overflow-y-scroll lg:max-h-96 max-h-[22.5rem]">
                  {selectedOrder && (
                    <div className="space-y-2">
                      <p className="font-bold">
                        Order ID: {selectedOrder.orderId}
                      </p>
                      <p>
                        Status:
                        <Badge color="green">{selectedOrder.status}</Badge>
                      </p>
                      <p>Total: ${selectedOrder.totalAmount.toFixed(2)}</p>
                      <p>
                        Customer: {selectedOrder.shippingAddress.fullName} -{" "}
                        {selectedOrder.shippingAddress.phone}
                      </p>
                      <p>
                        Address: {selectedOrder.shippingAddress.addressLine1},{" "}
                        {selectedOrder.shippingAddress.addressLine2},{" "}
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.postalCode},{" "}
                        {selectedOrder.shippingAddress.state},{" "}
                        {selectedOrder.shippingAddress.country}
                      </p>
                      {/* ------> Item details ------> */}
                      <div className="mt-4 border-t border-base-content/15 pt-2">
                        <h3 className="font-semibold">Items</h3>
                        {selectedOrder.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex justify-between border-b border-base-content/15 py-1 text-sm w-full"
                          >
                            <div className="w-1/4">{item.name}</div>
                            <div className="w-1/4">Qty: {item.quantity}</div>
                            <div className="w-1/4">
                              ${item.price.toFixed(2)}
                            </div>
                            <div className="w-1/4">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* ------> Payment status ------> */}
                      <div className="border-b border-base-content/25 lg:pb-4 pb-2">
                        <h3 className="font-bold">Payment Details</h3>
                        <p>
                          Payment Method:{" "}
                          <Badge color="gray">
                            {selectedOrder.paymentMethod}
                          </Badge>{" "}
                        </p>
                        <p>
                          Payment Status:{" "}
                          <Badge color="gray">
                            {selectedOrder.paymentStatus}{" "}
                          </Badge>{" "}
                        </p>
                      </div>
                      {/* -----> Status Timeline -----> */}

                      <div>
                        <h3 className="font-bold">Status Update History</h3>
                        <ul>
                          {selectedOrder?.statusHistory.map((s, index) => (
                            <li key={s._id}>
                              {index + 1}. {s.status} —{" "}
                              {new Date(s.date).toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </Modal>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SuperAdminOrdersOverviewManagement;
