import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import Textarea from "../../common/components/ui/Textarea";
import toast from "react-hot-toast";

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
        ? { id: editingSlideBanner._id, data: fd }
        : { data: fd };

      await onSubmit(payload, {
        onSuccess: () => {
          setDbPreview(null);
          toast.success("Slide saved successfully123!");
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
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Slide" : "Add New Slide"}
        </h2>
        <div className="space-y-3">
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
          />
          <Textarea
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Subtitle"
          />
          <div className="grid lg:grid-cols-12 grid-cols-1 justify-between gap-4">
            <div className="lg:col-span-6 col-span-12">
              <Input
                name="ctaLabel"
                value={formData.ctaLabel}
                onChange={handleChange}
                placeholder="CTA Label (optional)"
              />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Input
                name="ctaLink"
                value={formData.ctaLink}
                onChange={handleChange}
                placeholder="CTA Link (optional)"
              />
            </div>
          </div>
          <div className="grid lg:grid-cols-12 grid-cols-1 justify-between gap-4">
            <div className="lg:col-span-6 col-span-12">
              <Input
                name="secondaryLink"
                value={formData.secondaryLink}
                onChange={handleChange}
                placeholder="CTA Link (optional)"
              />
            </div>
            <div className="lg:col-span-6 col-span-12">
              <Input
                name="hoverText"
                value={formData.hoverText}
                onChange={handleChange}
                placeholder="Hover text..."
              />
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
              className="file-input input-bordered w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {/* Existing image from DB (preview) */}
              {dbPreview && (
                <div className="flex justify-self-start shadow-sm">
                  <div className="">
                    <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                    <img
                      src={`${apiURL}/uploads/${dbPreview}`}
                      alt="Existing"
                      className="h-20 w-full object-contain rounded flex-start"
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

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="warning" onClick={onClose} className="btn btn-sm">
            <X /> Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="indigo"
            disabled={isSaving}
            className="btn btn-sm"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-1" /> Save
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminHeroBannerForm;
