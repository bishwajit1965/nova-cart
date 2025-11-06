import { MiniIconButton } from "../../common/components/ui/MiniIconButton";

const SuperAdminAboutContentTable = ({
  aboutContents,
  handleEdit,
  setConfirmDelete,
}) => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return (
    <div>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead className="bg-base-300">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Content</th>
              <th>Extra Data</th>
              <th>Image</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {aboutContents.map((aboutContent, idx) => (
              <tr key={idx}>
                <th>{idx + 1}</th>
                <td>{aboutContent?.title}</td>
                <td>{aboutContent?.content}</td>
                <td>{aboutContent?.extraData}</td>
                <td>
                  <img
                    src={`${apiURL}/uploads/${aboutContent.image}`}
                    alt=""
                    className="w-28 h-16 object-cover rounded-full"
                  />
                </td>
                <td className="flex justify-end items-center space-x-2 py-10">
                  <MiniIconButton
                    onClick={() => handleEdit(aboutContent)}
                    icon="defaultEdit"
                    variant="indigo"
                  />
                  <MiniIconButton
                    onClick={() => setConfirmDelete(aboutContent)}
                    name="delete"
                    variant="danger"
                    icon="delete"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminAboutContentTable;
