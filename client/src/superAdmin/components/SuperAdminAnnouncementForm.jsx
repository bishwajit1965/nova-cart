import { Loader, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import Textarea from "../../common/components/ui/Textarea";
import toast from "react-hot-toast";

const SuperAdminAnnouncementForm = ({
  initialData,
  onSubmit,
  onClose,
  editingAnnouncement,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    isActive: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        message: initialData.message || "",
        type: initialData.type || "info",
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = editingAnnouncement
        ? { id: editingAnnouncement._id, data: formData }
        : { data: formData };

      await onSubmit(payload, {
        onSuccess: () => {
          toast.success("Announcement saved successfully!");
          onClose();
        },
        onError: () => {
          toast.error("Failed to save announcement!");
        },
      });
    } catch {
      toast.error("Failed to save!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <Input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <Textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
      />
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full border rounded px-2 py-1"
      >
        <option value="info">Info</option>
        <option value="warning">Warning</option>
        <option value="success">Success</option>
      </select>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
        />
        Active
      </label>

      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onClose} variant="warning" className="btn btn-sm">
          <X size={20} /> Cancel
        </Button>
        <div
          className={`${
            isSaving
              ? "opacity-50 pointer-events-none bg-red-500 cursor-not-allowed"
              : ""
          }`}
        >
          <Button
            onClick={handleSave}
            variant="indigo"
            disabled={isSaving}
            className="btn btn-sm"
          >
            {isSaving ? (
              <Loader className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAnnouncementForm;
