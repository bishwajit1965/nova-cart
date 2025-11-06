import { MiniIconButton } from "../../common/components/ui/MiniIconButton";
import NoDataFound from "../../common/components/ui/NoDataFound";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const SuperAdminPortfolioTable = ({ portfolios, onEdit, onPdf, onDelete }) => {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolios.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <NoDataFound />
                </td>
              </tr>
            ) : (
              portfolios.map((portfolio) => (
                <tr>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={`${apiURL}${portfolio?.profileImage}`}
                            alt={portfolio.name}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{portfolio?.name}</div>
                        <div className="text-sm opacity-50">United States</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {portfolio?.email}
                    <br />
                    <span className="badge badge-ghost badge-sm">
                      Desktop Support Technician
                    </span>
                  </td>
                  <td>{portfolio?.phone}</td>
                  <th className="space-x-2">
                    <MiniIconButton
                      onClick={() => onEdit(portfolio)}
                      variant="indigo"
                      icon="edit"
                      className="btn btn-ghost btn-xs"
                    />
                    <MiniIconButton
                      onClick={() => onPdf(portfolio._id)}
                      variant="indigo"
                      icon="file"
                      className="btn btn-xs"
                    />
                    <MiniIconButton
                      onClick={() => onDelete(portfolio)}
                      icon="delete"
                      variant="danger"
                      className="btn btn-xs"
                    />
                  </th>
                </tr>
              ))
            )}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>phone</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminPortfolioTable;
