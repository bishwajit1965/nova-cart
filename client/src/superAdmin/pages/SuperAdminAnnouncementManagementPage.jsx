import { Edit, Edit2, Megaphone, PlusCircleIcon, Trash2 } from "lucide-react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import Modal from "../../common/components/ui/Modal";
import SuperAdminAnnouncementForm from "../components/SuperAdminAnnouncementForm";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";
import ConfirmDialog from "../../common/components/ui/ConfirmDialog";

const SuperAdminAnnouncementManagementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const toggleForm = () => setIsFormOpen(!isFormOpen);

  const {
    data: announcementData,
    isLoading: isLoadingAnnouncementData,
    isError: isErrorAnnouncementData,
    error: errorAnnouncementData,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_ANNOUNCEMENT.SUP_ADMIN_ANNOUNCEMENT_ENDPOINT}/all/active`,
    queryKey: API_PATHS.SUP_ADMIN_ANNOUNCEMENT.SUP_ADMIN_ANNOUNCEMENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  useEffect(() => {
    if (announcementData) setAnnouncements(announcementData);
  }, [announcementData]);

  /** -------->Announcement create & update Mutations --------> */
  const announcementMutation = useApiMutation({
    method: editingAnnouncement ? "update" : "create",
    path: editingAnnouncement
      ? (payload) =>
          `${API_PATHS.SUP_ADMIN_ANNOUNCEMENT.SUP_ADMIN_ANNOUNCEMENT_ENDPOINT}/announcement-edit/${payload.id}`
      : `${API_PATHS.SUP_ADMIN_ANNOUNCEMENT.SUP_ADMIN_ANNOUNCEMENT_ENDPOINT}/announcement-create`,
    key: API_PATHS.SUP_ADMIN_ANNOUNCEMENT.SUP_ADMIN_ANNOUNCEMENT_KEY,
    onSuccess: () => {
      toggleForm();
    },
    onError: (err) => toast.error("Failed to save announcement!", err),
  });

  /** <-------- Announcement delete Mutations <-------- */
  const deleteAnnouncementMutation = useApiMutation({
    method: "delete",
    path: (id) =>
      `${API_PATHS.SUP_ADMIN_ANNOUNCEMENT.SUP_ADMIN_ANNOUNCEMENT_ENDPOINT}/announcement-delete/${id}`,
    key: API_PATHS.SUP_ADMIN_ANNOUNCEMENT.SUP_ADMIN_ANNOUNCEMENT_KEY,
  });

  /** -------->Create & update Handler --------> */
  const handleSubmit = async (formData) => {
    await announcementMutation.mutateAsync(formData);
  };

  const handleToggleConfirmDialogue = (announcement) => {
    setConfirmDelete(announcement);
  };

  /** <-------- Delete Handler <-------- */
  const handleDeleteAnnouncement = (id) => {
    deleteAnnouncementMutation.mutate(id, {
      onSuccess: () => {
        setConfirmDelete(null);
      },
    });
  };

  /** --------> Use Fetched Data Status Handler --------> */
  const announcementDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingAnnouncementData,
    isError: isErrorAnnouncementData,
    error: errorAnnouncementData,
    label: "Announcements",
  });

  /** <-------- Use Fetched Data Status Handler <-------- */
  if (announcementDataStatus.status !== "success")
    return announcementDataStatus.content;

  return (
    <div>
      <div className="lg:p-4 p-2 bg-base-200 rounded-lg shadow-lg lg:max-w-7xl mx-auto lg:space-y-4 space-y-2">
        <div className="lg:flex grid items-center gap-2">
          <Button
            variant="primary"
            onClick={() => {
              setEditingAnnouncement(null);
              toggleForm();
            }}
          >
            <PlusCircleIcon size={20} /> Add New Announcement
          </Button>
          <h2 className="lg:text-2xl text-lg font-bold flex items-center gap-2 ">
            <Megaphone size={20} />
            Announcement List
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {announcements?.length === 0 && <p>No announcements yet.</p>}

          {announcements?.map((a) => (
            <div
              key={a._id}
              className="border border-base-content/15 rounded-lg overflow-hidden shadow hover:shadow-lg transition p-4"
            >
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm mb-2">{a.message}</p>
              <p className="text-xs mb-2">
                Type: {a.type} | Active: {a.isActive ? "Yes" : "No"}
              </p>

              <div className="flex justify-between mt-2">
                <Button
                  variant="indigo"
                  onClick={() => {
                    setEditingAnnouncement(a);
                    setIsFormOpen(true);
                  }}
                  className="btn btn-sm"
                >
                  <Edit size={20} /> Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleToggleConfirmDialogue(a)}
                  className="btn btn-sm"
                >
                  <Trash2 size={20} /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {isFormOpen && (
          <Modal
            isOpen={toggleForm}
            onClose={toggleForm}
            title={`${
              editingAnnouncement ? "Edit Announcement" : "Create Announcement"
            }`}
          >
            <SuperAdminAnnouncementForm
              initialData={editingAnnouncement}
              onSubmit={handleSubmit}
              onClose={toggleForm}
              editingAnnouncement={editingAnnouncement}
            />
          </Modal>
        )}

        {/* Confirm delete dialogue box */}
        {confirmDelete && (
          <ConfirmDialog
            isOpen={confirmDelete}
            onClose={() => setConfirmDelete(null)}
            onConfirm={() => handleDeleteAnnouncement(confirmDelete._id)}
          />
        )}
      </div>
    </div>
  );
};

export default SuperAdminAnnouncementManagementPage;
