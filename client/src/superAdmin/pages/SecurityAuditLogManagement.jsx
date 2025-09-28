import API_PATHS from "../services/apiPaths/apiPaths";
import NoDataFound from "../../common/components/ui/NoDataFound";
import Pagination from "../../common/pagination/Pagination";
import SearchBox from "../../common/components/ui/SearchBox";
import SelectFilter from "../../common/components/ui/SelectFilter";
import { useApiQuery } from "../services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";

const ACTIONS = [
  "CREATE_PRODUCT",
  "UPDATE_PRODUCT",
  "DELETE_PRODUCT",
  "CREATE_USER",
  "UPDATE_USER",
  "DELETE_USER",
  "OTHER",
];

const SecurityAuditLogManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [filteredLogs, setFilteredLogs] = useState([]);

  /*** ------> Audit LOg fetcher QUERY ------> */
  const {
    data: auditLogs,
    isLoading: isAuditLogLoading,
    isError: isAuditLogError,
    error: errorAuditLog,
  } = useApiQuery({
    url: API_PATHS.AUDIT_LOGS.ENDPOINT,
    queryKey: API_PATHS.AUDIT_LOGS.KEY,
  });

  console.log("Audit logs", auditLogs);
  const [paginatedData, setPaginatedData] = useState(auditLogs || []);
  // To display total permissions in pagination
  const dataLength = auditLogs?.length;

  /*** ------> Data fetch status handlers ------> */
  const auditLogsDataStatus = useFetchedDataStatusHandler({
    isLoading: isAuditLogLoading,
    isError: isAuditLogError,
    error: errorAuditLog,
    label: "audit-logs",
  });

  /*** ------> Filter logs based on search and action ------> */
  useEffect(() => {
    let logs = Array.isArray(auditLogs) ? auditLogs : auditLogs?.data || [];

    if (actionFilter) {
      logs = logs.filter((log) => log.action === actionFilter);
    }

    if (searchTerm) {
      logs = logs.filter((log) =>
        log?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(logs);
  }, [auditLogs, searchTerm, actionFilter]);

  console.log("Audit logs", auditLogs);

  return (
    <div className="space-y-4">
      <div className="">
        <h1 className="lg:text-2xl text-base-content text-xl font-bold">
          Security & Audit Log Management
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by user..."
          className="max-w-md"
        />

        <SelectFilter
          label="Action"
          value={actionFilter}
          onChange={setActionFilter}
          options={[
            { value: "", label: "All Actions" },
            ...ACTIONS.map((a) => ({ value: a, label: a })),
          ]}
          className="max-w-md"
        />
      </div>

      {auditLogsDataStatus.status !== "success" ? (
        auditLogsDataStatus.content
      ) : (
        <div className="lg:space-y-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead className="bg-base-300">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th>Description</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      <NoDataFound label="Audit Log" />
                    </td>
                  </tr>
                ) : (
                  paginatedData?.map((log, index) => (
                    <tr key={log._id}>
                      <td>{index + 1}</td>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                      <td>
                        {log?.user?.name} <br />
                        {log?.user?.email}
                      </td>
                      <td>{log.action}</td>
                      <td>{log.entity}</td>
                      <td>{log.entityId}</td>
                      <td>{log.description}</td>
                      <td>{log.ipAddress}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-base-300">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th>Description</th>
                  <th>IP</th>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* pagination begins*/}
          <Pagination
            items={filteredLogs}
            dataLength={dataLength}
            onPaginatedDataChange={setPaginatedData}
          />
        </div>
      )}
    </div>
  );
};

export default SecurityAuditLogManagement;
