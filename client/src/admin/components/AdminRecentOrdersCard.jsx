import { FaFileExcel, FaFilePdf } from "react-icons/fa";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import NoDataFound from "../../common/components/ui/NoDataFound";
import Pagination from "../../common/pagination/Pagination";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const AdminRecentOrdersCard = () => {
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    paymentMethod: "",
  });

  const queryString = new URLSearchParams(filters).toString();
  /*** ------> Admin Analytics fetcher QUERY ------> */
  // For filtering
  const queryKey = [
    API_PATHS.ADMIN_PRODUCT_REPORT.ORDER_REPORT_KEY,
    filters.status,
    filters.startDate,
    filters.endDate,
    filters.paymentMethod,
  ];
  const {
    data: recentOrders = [],
    isLoading: isLoadingRecentOrders,
    isError: isErrorRecentOrders,
    error: errorRecentOrders,
  } = useApiQuery({
    url: `${API_PATHS.ADMIN_PRODUCT_REPORT.ORDER_REPORT_ENDPOINT}?${queryString}`,
    queryKey,
    // queryKey: API_PATHS.ADMIN_PRODUCT_REPORT.ORDER_REPORT_KEY,
  });

  const [paginatedData, setPaginatedData] = useState(recentOrders || []);
  // To display total permissions in pagination
  const dataLength = recentOrders?.length;

  /*** ----> Data fetch status handler hooks ----> */
  const recentOrdersDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingRecentOrders,
    isError: isErrorRecentOrders,
    error: errorRecentOrders,
    label: "recent-orders",
  });

  // Export data
  const handleExport = (type) => {
    const url = `${baseURL}/${API_PATHS.ADMIN_PRODUCT_REPORT.EXPORT_ENDPOINT}/${type}?${queryString}`;
    window.open(url, "_blank"); // download file
  };

  return (
    <div className="lg:col-span-12 col-span-12 bg-base-100 rounded-2xl lg:p-4 p-2 border border-base-content/15 shadow lg:space-y-4 space-y-4 text-stone-500">
      <div className="">
        <h2 className="text-xl font-bold">🛒 Recent Orders</h2>
      </div>
      <div className="lg:flex grid lg:gap-4 gap-2 lg:mb-4 mb-2">
        <select
          className="border p-1 rounded"
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, startDate: e.target.value }))
          }
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, endDate: e.target.value }))
          }
        />

        <select
          className="border p-1 rounded"
          value={filters.paymentMethod}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, paymentMethod: e.target.value }))
          }
        >
          <option value="">All Payment</option>
          <option value="Bkash">Bkash</option>
          <option value="Card">Card</option>
        </select>

        <div className="space-x-4">
          <Button onClick={() => handleExport("csv")} className="btn btn-sm">
            <FaFileExcel /> Export CSV
          </Button>
          <Button onClick={() => handleExport("pdf")} className="btn btn-sm">
            <FaFilePdf /> Export PDF
          </Button>
        </div>
      </div>

      {recentOrdersDataStatus.status !== "success" ? (
        recentOrdersDataStatus.content
      ) : (
        <div className="lg:space-y-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="table table-md w-full">
              <thead>
                <tr className="bg-base-200">
                  <th className="border border-base-content/15 py-1">#</th>
                  <th className="border border-base-content/15 px-2 py-1">
                    Order ID
                  </th>
                  <th className="border border-base-content/15 px-2 py-1">
                    User
                  </th>
                  <th className="border border-base-content/15 px-2 py-1">
                    Status
                  </th>
                  <th className="border border-base-content/15 px-2 py-1">
                    Payment
                  </th>
                  <th className="border border-base-content/15 px-2 py-1">
                    Total
                  </th>
                  <th className="border border-base-content/15 px-2 py-1">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <NoDataFound label="Searched data" />
                    </td>
                  </tr>
                ) : (
                  paginatedData?.map((order, idx) => (
                    <tr key={order._id}>
                      <td className="border border-base-content/15 px-2 py-1">
                        {idx + 1}
                      </td>
                      <td className="border border-base-content/15 px-2 py-1">
                        {order._id}
                      </td>
                      <td className="border border-base-content/15 px-2 py-1">
                        {order.user?.name}
                      </td>
                      <td className="border border-base-content/15 px-2 py-1">
                        {order.status}
                      </td>
                      <td className="border border-base-content/15 px-2 py-1">
                        {order.paymentMethod}
                      </td>
                      <td className="border border-base-content/15 px-2 py-1">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="border border-base-content/15 px-2 py-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* pagination begins*/}
          <Pagination
            items={recentOrders}
            dataLength={dataLength}
            onPaginatedDataChange={setPaginatedData}
          />
        </div>
      )}
    </div>
  );
};

export default AdminRecentOrdersCard;
