import { Edit, Edit2, Loader, PlusCircleIcon, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import Textarea from "../../common/components/ui/Textarea";
import toast from "react-hot-toast";
import useValidator from "../../common/hooks/useValidator";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const SuperAdminHeroBannerForm = ({
  onClose,
  isFormOpen,
  onSubmit,
  initialData,
  editingSlideBanner,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: null,
    ctaLink: "",
    ctaLabel: "",
    secondaryLink: "",
    hoverText: "",
    type: "hero", // hero or banner
  });
  const [dbPreview, setDbPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [localPreview, setLocalPreview] = useState(""); // new selected file preview

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        image: null,
        ctaLink: initialData.ctaLink || "",
        ctaLabel: initialData.ctaLabel || "",
        secondaryLink: initialData.secondaryLink || "",
        hoverText: initialData.hoverText || "",
        type: initialData.type || "hero",
      });
      setDbPreview(initialData.image || null);
    }
  }, [initialData]);

  // Initial data state
  const title = formData.title;
  const subtitle = formData.subtitle;
  const ctaLink = formData.ctaLink;
  const ctaLabel = formData.ctaLabel;
  const secondaryLink = formData.secondaryLink;
  const hoverText = formData.hoverText;
  const type = formData.type;

  // Validation
  const validationRules = {
    title: {
      required: { message: "Title is required" },
    },
    subtitle: {
      required: { message: "Sub title is required" },
    },
    ctaLink: {
      required: { message: "Category link is required" },
    },
    ctaLabel: {
      required: { message: "Category label is required" },
    },
    secondaryLink: {
      required: { message: "Secondary link is required" },
    },
    hoverText: {
      required: { message: "Hover text is required" },
    },
    type: {
      required: { message: "Type is required" }, // <-- Add this line
    },
  };

  /*** -----> Validator integration -----> */
  const { errors, validate } = useValidator(validationRules, {
    title,
    subtitle,
    ctaLink,
    ctaLabel,
    secondaryLink,
    hoverText,
    type,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files[0]) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setLocalPreview(URL.createObjectURL(file)); // keeps DB preview untouched
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!validate()) return;
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("subtitle", formData.subtitle);
      fd.append("ctaLink", formData.ctaLink);
      fd.append("ctaLabel", formData.ctaLabel);
      fd.append("secondaryLink", formData.secondaryLink);
      fd.append("hoverText", formData.hoverText);
      fd.append("type", formData.type);
      if (formData.image instanceof File) {
        fd.append("image", formData.image);
      }
      const payload = editingSlideBanner
        ? { id: editingSlideBanner?._id, data: fd }
        : { data: fd };
      await onSubmit(payload, {
        onSuccess: () => {
          setDbPreview(null);
        },
        onError: () => {
          toast.error("Failed to save slide!");
        },
      });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save slide!");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isFormOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-base-200 rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-2 text-base-content/70 flex items-center gap-2">
          {initialData ? <Edit size={20} /> : <PlusCircleIcon size={20} />}{" "}
          {initialData ? "Edit Slide" : "Add New Slide"}
        </h2>
        <div className="space-y-3">
          <div className="relative">
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className={`${
                errors.title ? "input-error bg-yellow-100" : ""
              } input-sm`}
            />
            {errors.title && (
              <p className="text-red-600 absolute bottom-1 right-4">
                <span className="text-xs">{errors.title}</span>
              </p>
            )}
          </div>
          <div className="">
            <Textarea
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Subtitle"
            />
            {errors.subtitle && (
              <p className="text-red-600">
                <span className="text-xs">{errors.subtitle}</span>
              </p>
            )}
          </div>
          <div className="grid lg:grid-cols-12 grid-cols-1 justify-between gap-4">
            <div className="lg:col-span-6 col-span-12">
              <Input
                name="ctaLabel"
                value={formData.ctaLabel}
                onChange={handleChange}
                placeholder="CTA Label (optional)"
                className="input-sm"
              />
              {errors.ctaLabel && (
                <p className="text-red-600">
                  <span className="text-xs">{errors.ctaLabel}</span>
                </p>
              )}
            </div>

            <div className="lg:col-span-6 col-span-12">
              <Input
                name="ctaLink"
                value={formData.ctaLink}
                onChange={handleChange}
                placeholder="CTA Link (optional)"
                className="input-sm"
              />
              {errors.ctaLink && (
                <p className="text-red-600">
                  <span className="text-xs">{errors.ctaLink}</span>
                </p>
              )}
            </div>
          </div>
          <div className="grid lg:grid-cols-12 grid-cols-1 justify-between gap-4">
            <div className="lg:col-span-6 col-span-12">
              <Input
                name="secondaryLink"
                value={formData.secondaryLink}
                onChange={handleChange}
                placeholder="CTA Link (optional secondary)"
                className="input-sm"
              />
              {errors.secondaryLink && (
                <p className="text-red-600">
                  <span className="text-xs">{errors.secondaryLink}</span>
                </p>
              )}
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Input
                name="hoverText"
                value={formData.hoverText}
                onChange={handleChange}
                placeholder="Hover text..."
                className="input-sm"
              />
              {errors.hoverText && (
                <p className="text-red-600 text-xs">
                  <span className="text-xs">{errors.hoverText}</span>
                </p>
              )}
            </div>
          </div>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          >
            <option value="hero">Hero</option>
            <option value="banner">Banner</option>
          </select>
          <div>
            <label className="block font-semibold mb-1">Image</label>
            <Input
              type="file"
              name="image"
              onChange={handleChange}
              className="file-input w-full input-sm pl-0"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Existing image from DB (preview) */}
              {dbPreview && (
                <div className="flex justify-self-start shadow-sm">
                  <div className="">
                    <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                    <img
                      src={`${apiURL}/uploads/${dbPreview}`}
                      alt="Existing"
                      className="h-20 w-full object-contain rounded flex flex-start"
                    />
                  </div>
                </div>
              )}

              {/* Selected new image */}
              {localPreview && (
                <div className="flex justify-self-end shadow-sm">
                  <div className="">
                    <p className="text-sm text-gray-500 mb-1">New Selection:</p>
                    <img
                      src={localPreview}
                      alt="New Preview"
                      className="w-full h-20 object-contain rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=" mt-4 flex justify-end gap-2">
          <div className="">
            <Button variant="warning" onClick={onClose} className="btn btn-sm">
              <X size={20} /> Cancel
            </Button>
          </div>

          <div
            className={`${
              isSaving ? "cursor-not-allowed bg-red-300 rounded-md" : ""
            }  `}
          >
            <Button
              onClick={handleSave}
              variant="indigo"
              disabled={isSaving}
              className="btn btn-sm"
            >
              {isSaving ? (
                <>
                  <Loader size={20} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={20} className="mr-1" /> Save
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminHeroBannerForm;
