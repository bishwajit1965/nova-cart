import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import { Eye } from "lucide-react";
import Modal from "../../common/components/ui/Modal";
import NoDataFound from "../../common/components/ui/NoDataFound";
import Pagination from "../../common/pagination/Pagination";
import SearchBox from "../../common/components/ui/SearchBox";
import SelectFilter from "../../common/components/ui/SelectFilter";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useMemo } from "react";
import { useState } from "react";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const AdminOrderManagementPage = () => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  /*** ------> Orders fetcher QUERY ------> */
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
  } = useApiQuery({
    url: API_PATHS.ADMIN_ORDERS.ADMIN_ORDERS_ENDPOINT,
    queryKey: API_PATHS.ADMIN_ORDERS.ADMIN_ORDERS_KEY,
  });

  const [paginatedData, setPaginatedData] = useState(ordersData || []);
  // To display total permissions in pagination
  const dataLength = ordersData?.length;

  // normalize
  const orders = useMemo(() => {
    return Array.isArray(ordersData) ? ordersData : [];
  }, [ordersData]);

  /** ------> Update Order Status MUTATION ------> */
  const updateOrderMutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.ADMIN_ORDERS.ADMIN_ORDERS_ENDPOINT}/${payload.orderId}`,
    key: API_PATHS.ADMIN_ORDERS.ADMIN_ORDERS_KEY, // used by useQuery
    onSuccess: () => {},
    onError: (error) => {
      toast.error("Error updating order status");
      console.error(error);
    },
  });

  // Filter orders
  useEffect(() => {
    let temp = [...orders];
    if (statusFilter) temp = temp.filter((o) => o.status === statusFilter);
    if (searchTerm) {
      temp = temp.filter((o) =>
        o.shippingAddress?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    setFilteredOrders(temp);
  }, [orders, searchTerm, statusFilter]);

  // Open modal
  const modalToggler = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Update order status
  const handleStatusChange = (orderId, status) => {
    try {
      setLoading(true);
      const payload = { orderId, data: { status } };
      updateOrderMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Status is updated!");
        },
        onError: () => {
          toast.error("Error in updating status!");
        },
      });
    } catch (error) {
      console.error("error in status change", error);
    } finally {
      setLoading(false);
    }
  };

  /*** ------> Data fetch status handler hooks ------> */
  const ordersDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
    label: "orders",
  });

  return (
    <div>
      {/**---> Orders section data loader status ---> */}
      {ordersDataStatus.status !== "success" ? (
        ordersDataStatus.content
      ) : (
        <div className="p-4">
          <h1 className="lg:text-2xl text-xl font-bold mb-4">
            Admin Orders Management
          </h1>

          {/* Filters */}
          <div className="flex items-center flex-wrap gap-2 mb-4">
            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search orders or customer..."
            />
            <SelectFilter
              label="Order Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUSES.map((s) => ({ value: s, label: s }))}
            />
          </div>

          {/* Orders table */}
          {loading ? (
            <p>Loading orders...</p>
          ) : filteredOrders.length === 0 ? (
            <NoDataFound label="No orders found" />
          ) : (
            <div className="lg:space-y-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead className="bg-base-300">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Change Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData?.map((order) => (
                      <tr key={order._id}>
                        <td>{order.orderId}</td>
                        <td>{order.shippingAddress?.fullName ?? "N/A"}</td>
                        <td>${order.totalAmount.toFixed(2)}</td>
                        <td>{order.status}</td>
                        <td>
                          <select
                            value={order?.status}
                            onChange={(e) =>
                              handleStatusChange(order?.orderId, e.target.value)
                            }
                            className="p-2 border rounded"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div className="flex justify-end">
                            <Button
                              onClick={() => modalToggler(order)}
                              variant="default"
                              disabled={loading}
                            >
                              <Eye size={18} /> View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-base-300">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Change Status</th>
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
            </div>
          )}

          {/* Modal */}
          {isModalOpen && selectedOrder && (
            <Modal
              isOpen={isModalOpen}
              title="Order Details"
              onClose={() => setIsModalOpen(false)}
            >
              <div className="space-y-2">
                <p>
                  <strong>Order ID:</strong> {selectedOrder.orderId}
                </p>
                <p>
                  <strong>Status:</strong> {selectedOrder.status}
                </p>
                <p>
                  <strong>Total:</strong> $
                  {selectedOrder.totalAmount.toFixed(2)}
                </p>
                <p>
                  <strong>Customer:</strong>{" "}
                  {selectedOrder.shippingAddress?.fullName} -{" "}
                  {selectedOrder.shippingAddress?.phone}
                </p>
                <div className="mt-2 border-t border-base-content/15 pt-2 text-sm">
                  <h3 className="font-semibold">Items</h3>
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between py-1 border-b border-base-content/15"
                    >
                      <div className="w-1/4">{item.name}</div>
                      <div className="w-1/4">Qty: {item.quantity}</div>
                      <div className="w-1/4">${item.price.toFixed(2)}</div>
                      <div className="w-1/4">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagementPage;
