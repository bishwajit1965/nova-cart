// SuperAdminPortfolioManagementPage.jsx

import { useEffect, useState } from "react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import ConfirmDialog from "../../common/components/ui/ConfirmDialog";
import Modal from "../../common/components/ui/Modal";
import { PlusCircle } from "lucide-react";
import SuperAdminPortfolioForm from "../components/SuperAdminPortfolioForm";
import SuperAdminPortfolioTable from "../components/SuperAdminPortfolioTable";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import { useAuth } from "../../common/hooks/useAuth";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import useValidator from "../../common/hooks/useValidator";
import { LucideIcon } from "../../common/lib/LucideIcons";

const SuperAdminPortfolioManagementPage = () => {
  const { user } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editPortfolio, setEditPortfolio] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    owner: "",
    name: "",
    title: "",
    bio: "",
    profileImage: null,
    profileImagePreview: "",
    demoVideo: null,
    demoVideoPreview: null,
    email: "",
    phone: "",
    location: "",
    skills: [""],
    education: [],
    experience: [],
    projects: [],
    achievements: [""],
    socialLinks: { github: "", linkedin: "", twitter: "", website: "" },
    isPublic: true,
    createdAt: "",
  });

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_VIDEO_SIZE = 300 * 1024 * 1024; // 300MB

  // Prefill form when editing
  useEffect(() => {
    if (!editPortfolio) return;
    setFormData({
      owner: editPortfolio.owner || "",
      name: editPortfolio.name || "",
      title: editPortfolio.title || "",
      bio: editPortfolio.bio || "",
      profileImagePreview: editPortfolio.profileImage || "",
      demoVideoPreview: editPortfolio.demoVideo || "",
      profileImage: editPortfolio.profileImage || null,
      demoVideo: editPortfolio.demoVideo || null,
      email: editPortfolio.email || "",
      phone: editPortfolio.phone || "",
      location: editPortfolio.location || "",
      skills: editPortfolio.skills?.length ? editPortfolio.skills : [""],
      education: editPortfolio.education || [],
      experience: editPortfolio.experience || [],
      projects:
        editPortfolio.projects?.map((p) => ({
          ...p,
          techStack: p.techStack || [],
        })) || [],
      achievements: editPortfolio.achievements?.length
        ? editPortfolio.achievements
        : [""],
      socialLinks: editPortfolio.socialLinks || {
        github: "",
        linkedin: "",
        twitter: "",
        website: "",
      },
      isPublic: editPortfolio.isPublic ?? true,
      createdAt: editPortfolio.createdAt || "",
    });
  }, [editPortfolio]);

  // Scroll to top when modal opens
  useEffect(() => {
    if (isModalVisible) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isModalVisible]);

  /*** ----- Handlers for form updates ----- */
  const handleChange = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleArrayChange = (field, index, value) => {
    const arr = [...formData[field]];
    arr[index] = value;
    setFormData((prev) => ({ ...prev, [field]: arr }));
  };

  const handleNestedChange = (field, index, key, value) => {
    const arr = [...formData[field]];
    arr[index] = { ...arr[index], [key]: value };
    setFormData((prev) => ({ ...prev, [field]: arr }));
  };

  const addArrayItem = (field, emptyValue) =>
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], emptyValue] }));

  const removeArrayItem = (field, index) =>
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));

  const handleFile = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

    if (type === "image" && file.size > MAX_IMAGE_SIZE) {
      toast.error(`Image too large (${sizeMB} MB). Max: 5MB`);
      return;
    }

    if (type === "video" && file.size > MAX_VIDEO_SIZE) {
      toast.error(`Video too large (${sizeMB} MB). Max: 300MB`);
      return;
    }

    const previewKey =
      type === "image" ? "profileImagePreview" : "demoVideoPreview";

    const fileKey = type === "image" ? "profileImage" : "demoVideo";

    // Revoke previous preview URL safely
    if (formData[previewKey]) {
      URL.revokeObjectURL(formData[previewKey]);
    }

    setFormData((prev) => ({
      ...prev,
      [fileKey]: file,
      [previewKey]: URL.createObjectURL(file),
    }));
  };

  const handleSocialChange = (key, value) =>
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value },
    }));

  /*** -----> Validation -----> */
  const validationRules = {
    name: { required: { message: "Name is required" } },
    title: { required: { message: "Title is required" } },
    bio: { required: { message: "Bio is required" } },
    email: {
      required: {
        message: "Email address is required",
      },
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },

    phone: {
      required: {
        message: "Phone number is required",
      },
      pattern: {
        value: /^[0-9+\-() ]{7,20}$/,
      },
    },
    location: { required: { message: "Location is required" } },
    skills: {
      required: { message: "Skills is required" },
      minLength: { value: 1, message: "At least 1 skill is required" },
    },
    education: {
      required: { message: "All education fields are required" },
      validate: (eduArr) =>
        eduArr.length > 0 &&
        eduArr.every(
          (edu) =>
            edu.institute &&
            edu.degree &&
            edu.startYear &&
            edu.endYear &&
            edu.description,
        ),
    },
    experience: {
      required: { message: "All experience fields are required" },
      validate: (expArr) =>
        expArr.length > 0 &&
        expArr.every(
          (exp) =>
            exp.company &&
            exp.role &&
            exp.startDate &&
            exp.endDate &&
            exp.description,
        ),
    },
    projects: {
      required: { message: "All project fields are required" },
      validate: (projArr) =>
        projArr.length > 0 &&
        projArr.every(
          (p) =>
            p.name &&
            p.description &&
            p.link &&
            Array.isArray(p.techStack) &&
            p.techStack.length > 0,
        ),
    },
    socialLinks: {
      website: {
        required: false,
        pattern: {
          value:
            /^(https?:\/\/)?([\w\d-]+\.){1,}([a-zA-Z]{2,})(\/[\w\d-]*)*\/?$/,
          message: "Invalid website URL",
        },
      },
    },
    isPublic: { required: true },
  };

  const { errors, validate } = useValidator(validationRules, formData);

  /*** -----Portfolios fetching API Hook ----- */
  const {
    data: portfolios,
    isLoading: isLoadingPortfolio,
    isError: isErrorPortfolio,
    error: errorPortfolio,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_PORTFOLIO.SUP_ADMIN_PORTFOLIO_ENDPOINT}/get-portfolios`,
    queryKey: API_PATHS.SUP_ADMIN_PORTFOLIO.SUP_ADMIN_PORTFOLIO_KEY,
  });

  /*** -----Portfolios Mutation API Hook ----- */
  const portfolioMutation = useApiMutation({
    method: editPortfolio ? "update" : "create",
    path: editPortfolio
      ? (payload) =>
          `${API_PATHS.SUP_ADMIN_PORTFOLIO.SUP_ADMIN_PORTFOLIO_ENDPOINT}/${payload.id}/edit`
      : `${API_PATHS.SUP_ADMIN_PORTFOLIO.SUP_ADMIN_PORTFOLIO_ENDPOINT}/add`,
    key: API_PATHS.SUP_ADMIN_PORTFOLIO.SUP_ADMIN_PORTFOLIO_KEY,
    onSuccess: () => {
      setFormData({
        owner: "",
        name: "",
        title: "",
        bio: "",
        profileImage: null,
        profileImagePreview: "",
        demoVideo: null,
        demoVideoPreview: null,
        email: "",
        phone: "",
        location: "",
        skills: [""],
        education: [],
        experience: [],
        projects: [],
        achievements: [""],
        socialLinks: { github: "", linkedin: "", twitter: "", website: "" },
        isPublic: true,
        createdAt: "",
      });

      setEditPortfolio(null);
      setIsModalVisible(false);
    },
    onError: (err) => {
      if (type === "image" && file.size > MAX_IMAGE_SIZE) {
        toast.error(
          `Image too large (${sizeMB} MB). Max allowed: ${(MAX_IMAGE_SIZE / (1024 * 1024)).toFixed(0)} MB`,
        );
        return;
      }

      if (type === "video" && file.size > MAX_VIDEO_SIZE) {
        toast.error(
          `Video too large (${sizeMB} MB). Max allowed: ${(MAX_VIDEO_SIZE / (1024 * 1024)).toFixed(0)} MB. Please compress if needed.`,
        );
        return;
      }
      toast.error("Error saving portfolio!");
      console.error(err);
    },
  });

  /*** ------> Portfolio Mutation CREATE/UPDATE API Hook ------> */
  const portfolioDeleteMutation = useApiMutation({
    method: "delete",
    path: (id) =>
      `${API_PATHS.SUP_ADMIN_PORTFOLIO.SUP_ADMIN_PORTFOLIO_ENDPOINT}/${id}/delete-portfolio`,
    key: API_PATHS.SUP_ADMIN_PORTFOLIO.SUP_ADMIN_PORTFOLIO_KEY,
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

      Object.entries(formData).forEach(([key, val]) => {
        if (key === "owner") return; // we already added it above
        if (
          (key === "profileImage" || key === "demoVideo") &&
          val instanceof File
        ) {
          fd.append(key, val);
        } else if (
          [
            "skills",
            "education",
            "experience",
            "projects",
            "achievements",
            "socialLinks",
          ].includes(key)
        ) {
          fd.append(key, JSON.stringify(val));
        } else if (
          key !== "profileImagePreview" &&
          key !== "demoVideoPreview"
        ) {
          fd.append(key, val);
        }
      });

      const payload = editPortfolio
        ? { id: editPortfolio._id, data: fd }
        : { data: fd };

      portfolioMutation.mutateAsync(payload);
    } catch (error) {
      console.error("Error uploading portfolio!", error);
    } finally {
      setIsSaving(false);
    }
  };

  /*** ------> Edit Portfolio ------>  */
  const handleEdit = (portfolio) => {
    setEditPortfolio(portfolio);
    toggleModal();
  };

  /*** ------> Delete Portfolio ------>  */
  const handleDelete = async (id) => {
    setConfirmDelete(id);
    portfolioDeleteMutation.mutateAsync(id, {
      onSuccess: () => {
        setConfirmDelete(null);
      },
      onError: (error) => {
        console.error("Error in portfolio delete!", error);
      },
    });
  };

  /*** ------> PDF generator handler ------> */
  const handlePDF = (id) => {
    const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    window.open(`${apiURL}/api/superAdmin/portfolio/${id}/pdf`, "_blank");
  };

  /*** ------> Modal Toggler handler ------> */
  const toggleModal = () => setIsModalVisible((prev) => !prev);

  /*** ------> Hand close form & clear state ------> */
  const handleCloseFormModal = () => {
    toggleModal();
    setEditPortfolio(null);
    setFormData({
      owner: "",
      name: "",
      title: "",
      bio: "",
      profileImage: null,
      profileImagePreview: "",
      demoVideo: null,
      demoVideoPreview: null,
      coverImage: null, // new
      coverImagePreview: "", // new
      email: "",
      phone: "",
      location: "",
      skills: [""],
      education: [],
      experience: [],
      projects: [],
      achievements: [""],
      socialLinks: { github: "", linkedin: "", twitter: "", website: "" },
      isPublic: true,
      createdAt: "",
    });
  };

  /*** ------> Portfolio data fetched status hook ------> */
  const portfolioDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingPortfolio,
    isError: isErrorPortfolio,
    error: errorPortfolio,
    label: "Portfolio",
  });

  if (portfolioDataStatus.status !== "success")
    return portfolioDataStatus.content;

  return (
    <div className="lg:space-y-6 space-y-4">
      <div className="">
        <h2 className="lg:text-2xl text-lg font-bold flex items-center gap-2 text-base-content/70">
          <LucideIcon.Briefcase /> Portfolio Management Data
        </h2>
      </div>
      <Button onClick={toggleModal} variant="indigo" size="sm">
        <PlusCircle size={20} /> Add Portfolio
      </Button>

      {/* Portfolio form Modal */}
      {isModalVisible && (
        <Modal isOpen={isModalVisible} onClose={handleCloseFormModal}>
          <SuperAdminPortfolioForm
            formData={formData}
            handleChange={handleChange}
            handleNestedChange={handleNestedChange}
            handleArrayChange={handleArrayChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            handleSocialChange={handleSocialChange}
            handleFile={handleFile}
            handleSubmit={handleSubmit}
            onClose={handleCloseFormModal}
            errors={errors}
            editPortfolio={editPortfolio}
            isSaving={isSaving}
          />
        </Modal>
      )}

      {/* Profile table */}
      {portfolios && (
        <SuperAdminPortfolioTable
          portfolios={portfolios}
          setEditPortfolio={setEditPortfolio}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onPdf={handlePDF}
        />
      )}

      {/* Confirmation Modal */}
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

export default SuperAdminPortfolioManagementPage;
