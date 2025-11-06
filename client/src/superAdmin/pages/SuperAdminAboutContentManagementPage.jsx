import { useEffect, useState } from "react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import ConfirmDialog from "../../common/components/ui/ConfirmDialog";
import Modal from "../../common/components/ui/Modal";
import NoDataFound from "../../common/components/ui/NoDataFound";
import { PlusCircle } from "lucide-react";
import SuperAdminAboutContentForm from "../components/SuperAdminAboutContentForm";
import SuperAdminAboutContentTable from "../components/SuperAdminAboutContentTable";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import useValidator from "../../common/hooks/useValidator";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB limit

const SuperAdminAboutContentManagementPage = () => {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editAbout, setEditAbout] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [dbPreview, setDbPreview] = useState(null);
  const [localPreview, setLocalPreview] = useState(""); // new selected file preview
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState("");

  const [formData, setFormData] = useState({
    sectionKey: "",
    title: "",
    content: "",
    image: null,
    extraData: "",
  });

  console.log("Form data", formData);
  console.log("File", file);

  useEffect(() => {
    if (editAbout) {
      setFormData({
        sectionKey: editAbout?.sectionKey,
        title: editAbout?.title,
        content: editAbout?.content,
        image: null,
        extraData: editAbout?.extraData,
      });
      setDbPreview(editAbout.image || null);
    }
  }, [editAbout]);

  useEffect(() => {
    if (isModalOpen) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isModalOpen]);

  const sectionKey = formData?.sectionKey;
  const title = formData?.title;
  const content = formData?.content;
  const image = formData?.image;
  const extraData = formData?.extraData;

  // Validation
  const validationRules = {
    sectionKey: {
      required: { message: "Section key is required" },
    },
    title: {
      required: { message: "Title is required" },
    },
    content: {
      required: { message: "Content is required" },
    },
    extraData: {
      required: { message: "Extra data is required" },
    },
  };

  /*** -----> Validator integration -----> */
  const { errors, validate } = useValidator(validationRules, {
    sectionKey,
    title,
    content,
    image,
    extraData,
  });

  /*** ------> About Content data fetched ------> */
  const {
    data: aboutContents,
    isLoading: isLoadingAboutContent,
    isError: isErrorAboutContent,
    error: errorAboutContent,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_ABOUT_CONTENT.SUP_ADMIN_ABOUT_CONTENT_ENDPOINT}/about-content`,
    queryKey: API_PATHS.SUP_ADMIN_ABOUT_CONTENT.SUP_ADMIN_ABOUT_CONTENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** ------> Faq Mutation CREATE/UPDATE API Hook ------> */
  const aboutContentMutation = useApiMutation({
    method: editAbout ? "update" : "create",
    path: editAbout
      ? (payload) =>
          `${API_PATHS.SUP_ADMIN_ABOUT_CONTENT.SUP_ADMIN_ABOUT_CONTENT_ENDPOINT}/${payload.sectionKey}/edit`
      : `${API_PATHS.SUP_ADMIN_ABOUT_CONTENT.SUP_ADMIN_ABOUT_CONTENT_ENDPOINT}/add`,
    key: API_PATHS.SUP_ADMIN_ABOUT_CONTENT.SUP_ADMIN_ABOUT_CONTENT_KEY,
    onSuccess: () => {
      setFormData({
        sectionKey: "",
        title: "",
        content: "",
        image: null,
        extraData: "",
      });
      setLocalPreview("");
      setDbPreview(null);
      setFile(null);
      setFileInfo("");
      handleModalToggler();
      handleModalToggler();
      setEditAbout(null);
    },
    onError: (error) => {
      toast.error("Error in saving about content!", error);
      console.error(error);
    },
  });

  /*** ------> Content Mutation DELETE API Hook ------> */
  const deleteAboutContentMutation = useApiMutation({
    method: "delete",
    path: (id) =>
      `${API_PATHS.SUP_ADMIN_ABOUT_CONTENT.SUP_ADMIN_ABOUT_CONTENT_ENDPOINT}/${id}/delete-about-content`,
    key: API_PATHS.SUP_ADMIN_ABOUT_CONTENT.SUP_ADMIN_ABOUT_CONTENT_KEY,
  });

  /*** Use data fetch status Handler */
  const aboutContentDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingAboutContent,
    isError: isErrorAboutContent,
    error: errorAboutContent,
    label: "About Content",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files[0]) {
      const file = files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File is too large (${sizeMB} MB). Max allowed: 2MB`);
        setFile(null);
        setFileInfo("");
      } else {
        setFile(file);
        setFileInfo(`✅ File selected: ${file.name} (${sizeMB} MB)`);
      }
      setFormData({ ...formData, [name]: file });
      setLocalPreview(URL.createObjectURL(file)); // keeps DB preview untouched
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCancelCrud = () => {
    setEditAbout(null);
    setFormData({
      sectionKey: "",
      title: "",
      content: "",
      image: null,
      extraData: "",
    });
    setLocalPreview("");
    setDbPreview(null);
    setFile(null);
    setFileInfo("");
    handleModalToggler();
    handleModalToggler();
  };

  const handleSubmit = (e) => {
    try {
      setIsSaving(true);
      e.preventDefault();
      const fd = new FormData();
      fd.append("sectionKey", formData.sectionKey);
      fd.append("title", formData.title);
      fd.append("content", formData.content);
      fd.append("extraData", formData.extraData);
      if (formData.image instanceof File) {
        fd.append("image", formData.image);
      }
      if (!validate()) return;
      const payload = editAbout
        ? { sectionKey: editAbout.sectionKey, data: fd }
        : { data: fd };

      aboutContentMutation.mutate(payload);
    } catch (error) {
      console.error("Error in saving about data!", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (data) => {
    setEditAbout(data);
    handleModalToggler();
  };

  const handleDelete = async (id) => {
    deleteAboutContentMutation.mutateAsync(id);
    setConfirmDelete(null);
  };

  if (aboutContentDataStatus.status !== "success")
    return aboutContentDataStatus.content;

  /*** ------> Handle Modal toggler (open & close) ------> */
  const handleModalToggler = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="space-y-6">
      <div className="">
        <Button variant="indigo" onClick={handleModalToggler}>
          <PlusCircle />
          {isModalOpen ? "About Form is Open" : "Add About Content"}
        </Button>
      </div>
      {aboutContents.length > 0 ? (
        <SuperAdminAboutContentTable
          aboutContents={aboutContents}
          handleEdit={handleEdit}
          setConfirmDelete={setConfirmDelete}
        />
      ) : (
        <NoDataFound label="About Content" />
      )}

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleModalToggler}>
          <SuperAdminAboutContentForm
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            dbPreview={dbPreview}
            localPreview={localPreview}
            handleSubmit={handleSubmit}
            handleCancelCrud={handleCancelCrud}
            fileInfo={fileInfo}
            isSaving={isSaving}
            aboutContentMutation={aboutContentMutation}
            editAbout={editAbout}
            setFile={setFile}
            setLocalPreview={setLocalPreview}
            setFormData={setFormData}
          />
        </Modal>
      )}

      {/* Confirm delete dialogue box */}
      {confirmDelete && (
        <ConfirmDialog
          isOpen={confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete?._id)}
        />
      )}
    </div>
  );
};

export default SuperAdminAboutContentManagementPage;
