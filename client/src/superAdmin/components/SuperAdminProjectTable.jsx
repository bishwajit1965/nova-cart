import { Edit, Trash2 } from "lucide-react";
import Button from "../../common/components/ui/Button";
import NoDataFound from "../../common/components/ui/NoDataFound";

const SuperAdminProjectTable = ({ projects, onEdit, setConfirmDelete }) => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Tech Stack</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <NoDataFound label="Projects" />
                </td>
              </tr>
            ) : (
              projects?.map((project, idx) => (
                <tr key={project._id}>
                  <td>{idx + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={`${apiURL}${project.projectImage}`}
                            alt="Project Image"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{project?.subTitle}</div>
                        <div className="text-sm opacity-50">
                          {project?.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {project?.title}
                    <br />
                    <span className="badge badge-ghost badge-sm">
                      Desktop Support Technician
                    </span>
                  </td>
                  <td>{project?.description}</td>
                  <td>
                    {project.techStack.map((ts, i) => (
                      <span key={i}>
                        <span className="capitalize bg-base-300 px-2 py-1 rounded mr-4 flex flex-wrap my-2 shadow text-xs hover:bg-gray-600 hover:text-white">
                          {ts}
                        </span>
                      </span>
                    ))}
                  </td>
                  <th className="space-y-2">
                    <Button
                      onClick={() => onEdit(project)}
                      variant="indigo"
                      className="btn btn-sm w-20"
                    >
                      <Edit size={20} /> Edit
                    </Button>
                    <Button
                      onClick={() => setConfirmDelete(project)}
                      variant="danger"
                      className="btn w btn-sm w-20"
                    >
                      <Trash2 size={20} /> Delete
                    </Button>
                  </th>
                </tr>
              ))
            )}
          </tbody>

          <tfoot>
            <tr>
              <th></th>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Tech Stack</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminProjectTable;
