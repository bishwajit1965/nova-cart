import { useState } from "react";
import { useAuth } from "../../common/hooks/useAuth";
import { useApiMutation } from "../services/hooks/useApiMutation";
import API_PATHS from "../services/apiPaths/apiPaths";
import { useEffect } from "react";
import Button from "../../common/components/ui/Button";
import { PlusCircle } from "lucide-react";
import SuperAdminProjectForm from "../components/SuperAdminProjectForm";
import Modal from "../../common/components/ui/Modal";
import useValidator from "../../common/hooks/useValidator";
import toast from "react-hot-toast";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import SuperAdminProjectTable from "../components/SuperAdminProjectTable";
import NoDataFound from "../../common/components/ui/NoDataFound";
import ConfirmDialog from "../../common/components/ui/ConfirmDialog";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const SuperAdminProjectManagementPage = () => {
  const { user } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState("");

  const [formData, setFormData] = useState({
    owner: "",
    title: "",
    subTitle: "",
    description: "",
    summary: "",
    projectImage: null,
    projectImagePreview: "",
    link: "",
    techStack: [],
    githubUrl: "",
    type: "",
    year: "",
    isPublic: true,
    createdAt: "",
  });

  console.log("Tech stack", techStack);
  console.log("Edit project", editProject);
  // Prefill form when editing
  useEffect(() => {
    if (!editProject) return;

    setFormData({
      owner: editProject.owner || "",
      title: editProject.title || "",
      subTitle: editProject.subTitle || "",
      description: editProject.description || "",
      summary: editProject.summary || "",
      projectImage: editProject.projectImage || null,
      projectImagePreview: editProject.projectImage || "",
      link: editProject.link || "",
      githubUrl: editProject.githubUrl || "",
      type: editProject.type || "",
      year: editProject.year || "",
      techStack:
        editProject.techStack?.map((p) => ({
          ...p,
          techStack: p.techStack || [],
        })) || [],
      isPublic: editProject.isPublic ?? true,
      createdAt: editProject.createdAt || "",
    });
    // ✅ refill actual working techStack
    setTechStack(editProject.techStack || []);
    setTechInput("");
  }, [editProject]);

  const handleChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  /*** ------> Handle add tech stack ------> */
  const handleAddTech = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = techInput.trim();
      if (!val) return;

      setTechStack((prev) => {
        if (prev.includes(val)) return prev; // no duplicates
        const next = [...prev, val];
        // also sync into formData.techStack
        setFormData((fprev) => ({ ...fprev, techStack: next }));
        return next;
      });

      setTechInput("");
    }
  };

  /*** ------> Handle remove tech stack ------> */
  const handleRemoveTech = (index) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  /*** ------> File input handler ------> */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File is too large (${sizeMB} MB). Max allowed: 2MB`);
      return;
    }

    // Revoke previous object URL to avoid memory leak
    if (formData.projectImagePreview && formData.profileImage)
      URL.revokeObjectURL(formData.projectImagePreview);

    setFormData((prev) => ({
      ...prev,
      projectImage: file,
      projectImagePreview: URL.createObjectURL(file),
    }));
  };

  /*** ------> Projects Content data fetched ------> */
  const {
    data: projects,
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
    error: errorProjects,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_PROJECT.SUP_ADMIN_PROJECT_ENDPOINT}/get-projects`,
    queryKey: API_PATHS.SUP_ADMIN_PROJECT.SUP_ADMIN_PROJECT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** -----Portfolios Mutation API Hook ----- */
  const projectMutation = useApiMutation({
    method: editProject ? "update" : "create",
    path: editProject
      ? (payload) =>
          `${API_PATHS.SUP_ADMIN_PROJECT.SUP_ADMIN_PROJECT_ENDPOINT}/${payload.id}/edit-project`
      : `${API_PATHS.SUP_ADMIN_PROJECT.SUP_ADMIN_PROJECT_ENDPOINT}/add-project`,
    key: API_PATHS.SUP_ADMIN_PROJECT.SUP_ADMIN_PROJECT_KEY,
    onSuccess: () => {
      setFormData({
        owner: "",
        title: "",
        subTitle: "",
        description: "",
        summary: "",
        projectImage: null,
        projectImagePreview: "",
        link: "",
        techStack: [],
        githubUrl: "",
        type: "",
        year: "",
        isPublic: true,
        createdAt: "",
      });
      setEditProject(null);
      setIsModalVisible(false);
    },
    onError: (err) => {
      toast.error("Error saving portfolio!");
      console.error(err);
    },
  });

  /*** ------> Content Mutation DELETE API Hook ------> */
  const deleteProjectMutation = useApiMutation({
    method: "delete",
    path: (id) =>
      `${API_PATHS.SUP_ADMIN_PROJECT.SUP_ADMIN_PROJECT_ENDPOINT}/${id}/delete-project`,
    key: API_PATHS.SUP_ADMIN_PROJECT.SUP_ADMIN_PROJECT_KEY,
  });

  /*** ------> Modal Toggler handler ------> */
  const toggleModal = () => setIsModalVisible((prev) => !prev);

  /*** ------> Hand close form & clear state ------> */
  const handleCloseFormModal = () => {
    toggleModal();
    setEditProject(null);
    setFormData({
      owner: "",
      title: "",
      subTitle: "",
      description: "",
      summary: "",
      projectImage: null,
      projectImagePreview: "",
      link: "",
      techStack: [],
      githubUrl: "",
      type: "",
      year: "",
      isPublic: true,
      createdAt: "",
    });
  };

  /*** -----> Validation rules -----> */
  const validationRules = {
    title: { required: { message: "Title is required" } },
    subTitle: { required: { message: "Sub title is required" } },
    description: { required: { message: "Description is required" } },
    summary: { required: { message: "Summary is required" } },
    link: { required: { message: "Link is required" } },
    githubUrl: { required: { message: "Github URL is required" } },
    type: { required: { message: "Type is required" } },
    year: { required: { message: "Year is required" } },
    techStack: {
      required: { message: "At least one tech stack item is required" },
      minLength: { value: 1, message: "Add at least 1 tech tag" },
    },
  };

  const { errors, validate } = useValidator(validationRules, {
    title: formData.title,
    subTitle: formData.subTitle,
    description: formData.description,
    summary: formData.summary,
    link: formData.link,
    githubUrl: formData.githubUrl,
    type: formData.type,
    year: formData.year,
    techStack: formData.techStack,
    projectImage: formData.projectImage,
  });

  /*** -----> Handlers -----> */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      if (!validate()) return;

      const fd = new FormData();

      // ✅ Ensure correct owner
      fd.append("owner", user?._id || formData.owner || "");
      fd.append("techStack", JSON.stringify(techStack));

      // ✅ append file only if File
      if (formData.projectImage instanceof File) {
        fd.append("projectImage", formData.projectImage);
      }

      // ✅ now append everything else safely
      Object.entries(formData).forEach(([key, val]) => {
        if (
          [
            "owner",
            "projectImage",
            "projectImagePreview",
            "techStack",
          ].includes(key)
        )
          return;

        if (["techStack"].includes(key)) {
          fd.append(key, JSON.stringify(val));
        } else {
          fd.append(key, val);
        }
      });

      const payload = editProject
        ? { id: editProject._id, data: fd }
        : { data: fd };

      projectMutation.mutateAsync(payload);
    } catch (error) {
      console.error("Error uploading portfolio!", error);
    } finally {
      setIsSaving(false);
    }
  };

  /*** ------> Project update handler ------> */
  const handleEdit = (data) => {
    setEditProject(data);
    toggleModal();
  };

  /*** ------> Project delete handler ------> */
  const handleDelete = async (id) => {
    deleteProjectMutation.mutateAsync(id);
    setConfirmDelete(null);
  };

  /*** Use data fetch status Handler */
  const projectsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
    error: errorProjects,
    label: "Projects",
  });

  if (projectsDataStatus.status !== "success")
    return projectsDataStatus.content;

  return (
    <div className="lg:space-y-6 space-y-4">
      <Button onClick={toggleModal} variant="indigo">
        <PlusCircle size={20} /> Add Portfolio
      </Button>

      {/* Projects table */}
      {projects.length > 0 ? (
        <SuperAdminProjectTable
          projects={projects}
          onEdit={handleEdit}
          setConfirmDelete={setConfirmDelete}
        />
      ) : (
        <NoDataFound label="Projects" />
      )}

      {/* Portfolio form Modal */}
      {isModalVisible && (
        <Modal isOpen={isModalVisible} onClose={handleCloseFormModal}>
          <SuperAdminProjectForm
            formData={formData}
            handleChange={handleChange}
            handleFile={handleFile}
            handleSubmit={handleSubmit}
            onClose={handleCloseFormModal}
            handleAddTech={handleAddTech}
            handleRemoveTech={handleRemoveTech}
            errors={errors}
            editProject={editProject}
            techStack={techStack}
            setTechStack={setTechStack}
            techInput={techInput}
            setTechInput={setTechInput}
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

export default SuperAdminProjectManagementPage;
