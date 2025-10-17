import Card, {
  CardContent,
  CardHeader,
  CardTitle,
} from "../../common/components/ui/Card";
import { useMemo, useState } from "react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import PageMeta from "../../common/components/ui/PageMeta";
import { RefreshCcw } from "lucide-react";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";

const SuperAdminPlanHistoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  /*** ------> Plan Histories data fetched ------> */
  const {
    data: planHistories,
    isLoadingPlanHistories,
    isErrorPlanHistories,
    errorPlanHistories,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_PLAN_HISTORY.SUP_ADMIN_PLAN_HISTORY_ENDPOINT}/analytics`,
    queryKey: API_PATHS.SUP_ADMIN_PLAN_HISTORY.SUP_ADMIN_PLAN_HISTORY_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  console.log("Plan histories", planHistories);

  /*** ------> Sort & filter method ------> */
  const filteredAndSortedHistories = useMemo(() => {
    if (!planHistories || !Array.isArray(planHistories)) return [];

    let filtered = [...planHistories];

    // 🔍 Search filter (user name, plan name, action)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => {
        const userName = item?.userId?.name?.toLowerCase() || "";
        const planName = item?.planId?.name?.toLowerCase() || "";
        const action = item?.action?.toLowerCase() || "";
        return (
          userName.includes(term) ||
          planName.includes(term) ||
          action.includes(term)
        );
      });
    }

    // 🎛️ Action filter
    if (filterAction && filterAction !== "All") {
      const actionFilter = filterAction.toLowerCase();
      filtered = filtered.filter(
        (item) => (item?.action || "").toLowerCase() === actionFilter
      );
    }

    // ⬆️⬇️ Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "Newest":
          return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
        case "Oldest":
          return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
        case "HighPrice":
          return (b?.price || 0) - (a?.price || 0);
        case "LowPrice":
          return (a?.price || 0) - (b?.price || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [planHistories, searchTerm, filterAction, sortBy]);

  /*** ------> Data fetched status hook------> */
  const planHistoriesDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingPlanHistories,
    isError: isErrorPlanHistories,
    error: errorPlanHistories,
    label: "Features",
  });

  return (
    <div className="">
      <PageMeta
        title="Plan History Management || Nova-Cart"
        description="You can manage plans data in detail."
      />

      {planHistoriesDataStatus.status !== "success" ? (
        planHistoriesDataStatus.content
      ) : (
        <>
          <div className="grid lg:grid-cols-12 grid-cols-1 items-center justify-between lg:gap-8 gap-4 lg:mb-6 mb-4">
            <div className="lg:col-span-3 col-span-12">
              <input
                type="text"
                placeholder="Search by user or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
            <div className="lg:col-span-3 col-span-12">
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              >
                <option value="All">All Actions</option>
                <option value="subscribe">Subscribe</option>
                <option value="upgrade">Upgrade</option>
                <option value="downgrade">Downgrade</option>
                <option value="cancel">Cancel</option>
              </select>
            </div>
            <div className="lg:col-span-3 col-span-12">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="HighPrice">High → Low</option>
                <option value="LowPrice">Low → High</option>
              </select>
            </div>
            <div className="lg:col-span-3 col-span-12">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setFilterAction("All");
                  setSortBy("Newest");
                }}
                variant="danger"
                className="btn btn-md rounded-full transition w-full"
              >
                <RefreshCcw /> Reset All
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Plan History Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAndSortedHistories?.length === 0 ? (
                <p>No plan history records found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border border-base-content/15 text-base-content/70">
                    <thead className="hover:text-base-content/60 bg-base-300">
                      <tr>
                        <th className="py-2 px-3 text-left border">#</th>
                        <th className="py-2 px-3 text-left border">User</th>
                        <th className="py-2 px-3 text-left border">Plan</th>
                        <th className="py-2 px-3 text-left border">Email</th>
                        <th className="py-2 px-3 text-left border">Action</th>
                        <th className="py-2 px-3 text-left border">Price</th>
                        <th className="py-2 px-3 text-left border">Duration</th>
                        <th className="py-2 px-3 text-left border">Status</th>
                        <th className="py-2 px-3 text-left border">
                          Start Date
                        </th>
                        <th className="py-2 px-3 text-left border">End Date</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {filteredAndSortedHistories?.map((history, idx) => (
                        <tr
                          key={history._id}
                          className="border-b border-stone-500 hover:bg-base-200 hover:text-base-content/70 text-stone-500"
                        >
                          <td className="py-2 px-3 border">{idx + 1}</td>
                          <td className="py-2 px-3 border">
                            {history?.userId?.name || "Unknown"}
                          </td>
                          <td className="py-2 px-3 border">
                            {history?.planId?.name || "N/A"}
                          </td>
                          <td className="py-2 px-3 border">
                            {history?.userId?.email || "N/A"}
                          </td>
                          <td className="py-2 px-3 border capitalize">
                            {history.action}
                          </td>
                          <td className="py-2 px-3 border">
                            ${history.price?.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 border">
                            {history.duration || "—"}
                          </td>
                          <td className="py-2 px-3 border">
                            {history.isActive ? (
                              <span className="text-green-600 font-semibold">
                                Active
                              </span>
                            ) : (
                              <span className="text-red-500">Inactive</span>
                            )}
                          </td>
                          <td className="py-2 px-3 border">
                            {new Date(history.startedAt).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-3 border">
                            {history.endedAt
                              ? new Date(history.endedAt).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SuperAdminPlanHistoryManagement;
