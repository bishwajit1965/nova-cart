import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Card from "../../common/components/ui/Card";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";

const AdminTopProductsCard = () => {
  /*** ------> Admin Analytics fetcher QUERY ------> */
  const {
    data: topProducts = [],
    isLoading: isLoadingTopProducts,
    isError: isErrorTopProducts,
    error: errorTopProducts,
  } = useApiQuery({
    url: `${API_PATHS.ADMIN_PRODUCT_REPORT.PRODUCT_REPORT_ENDPOINT}`,
    queryKey: API_PATHS.ADMIN_PRODUCT_REPORT.PRODUCT_REPORT_KEY,
  });

  console.log("Top products===>", topProducts);

  /*** ----> Products fetch status handler hooks ----> */
  const ordersDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingTopProducts,
    isError: isErrorTopProducts,
    error: errorTopProducts,
    label: "products",
  });

  return (
    <div className="lg:col-span-6 col-span-12 border border-base-content/15 text-base-content rounded-2xl">
      <Card className="p-4">
        <h2 className="text-xl font-bold border-b border-base-content/15 pb-2 mb-4 text-stone-400">
          🏆 Top Products
        </h2>
        {ordersDataStatus.status !== "success" ? (
          ordersDataStatus.content
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts || []}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="totalOrdered"
                fill="#4F46E5"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};

export default AdminTopProductsCard;
