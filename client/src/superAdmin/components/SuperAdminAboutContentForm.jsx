import { Loader, Save, X } from "lucide-react";

import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import Textarea from "../../common/components/ui/Textarea";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const SuperAdminAboutContentForm = ({
  formData,
  handleChange,
  errors,
  dbPreview,
  localPreview,
  handleSubmit,
  handleCancelCrud,
  fileInfo,
  isSaving,
  aboutContentMutation,
  editAbout,
  setLocalPreview,
  setFormData,
  setFile,
}) => {
  return (
    <div className="space-y-4">
      <div className="">
        <h2 className="lg:text-2xl text-xl font-bold">
          {editAbout ? "Edit About Section" : "Add About Section"}
        </h2>
      </div>

      <form className="space-y-4 max-h-[30rem] overflow-y-auto p-2">
        <Input
          type="text"
          name="sectionKey"
          value={formData.sectionKey}
          onChange={handleChange}
          placeholder="Section key..."
          className={
            errors.sectionKey
              ? "input-secondary bg-yellow-200 mb-0 space-y-0"
              : ""
          }
        />
        {errors?.sectionKey && (
          <p className="text-red-600 text-xs">{errors?.sectionKey}</p>
        )}
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title..."
          className={
            errors.title ? "input-secondary bg-yellow-200 mb-0 space-y-0" : ""
          }
        />
        {errors?.title && (
          <p className="text-red-600 text-xs">{errors?.title}</p>
        )}
        <Textarea
          type="text"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Content..."
          className={
            errors.content ? "input-secondary bg-yellow-200 mb-0 space-y-0" : ""
          }
        />
        {errors?.content && (
          <p className="text-red-600 text-xs">{errors?.content}</p>
        )}
        <Input
          type="file"
          name="image"
          key={Date.now()} // forces re-render for identical file reselect
          onChange={handleChange}
          className="file-input pl-0"
        />
        {/* {errors?.image && (
          <p className="text-red-600 text-xs">{errors?.image}</p>
        )} */}
        {fileInfo && <p className="text-sm text-gray-600">{fileInfo}</p>}
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
              <div className="relative">
                <p className="text-sm text-gray-500 mb-1 text-left">
                  New Selection:
                </p>
                <img
                  src={localPreview}
                  alt="New Preview"
                  className="w-full h-20 object-contain rounded"
                />
                <button
                  onClick={() => {
                    setLocalPreview("");
                    setFile(null);
                    setFormData((prev) => ({ ...prev, image: null }));
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1 text-xs"
                >
                  ✕
                </button>
                <button
                  onClick={() => {
                    setLocalPreview("");
                    setFile(null);
                    setFormData((prev) => ({ ...prev, image: null }));
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
        <Textarea
          type="text"
          name="extraData"
          value={formData.extraData}
          onChange={handleChange}
          placeholder="Extra data..."
          className={
            errors.extraData
              ? "input-secondary bg-yellow-200 mb-0 space-y-0"
              : ""
          }
        />
        {errors?.extraData && (
          <p className="text-red-600 text-xs">{errors?.extraData}</p>
        )}
        <div className="flex space-x-2">
          <div
            className={`${
              aboutContentMutation.isPending
                ? "cursor-not-allowed opacity-100 bg-red-400 rounded-md w-"
                : ""
            } flex space-x-2`}
          >
            <Button
              onClick={handleSubmit}
              variant="indigo"
              disabled={aboutContentMutation.isPending}
              className={`${
                aboutContentMutation.isPending ? "bg-red-400" : ""
              } btn btn-sm`}
            >
              {aboutContentMutation.isPending ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {aboutContentMutation.isPending ? "saving..." : "Save"}
            </Button>
          </div>
          <div className="">
            <Button
              variant="warning"
              onClick={handleCancelCrud}
              className="btn btn-sm"
            >
              <X size={20} /> Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SuperAdminAboutContentForm;
