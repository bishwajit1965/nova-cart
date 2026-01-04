import { EditIcon, PlusCircle, Save, X } from "lucide-react";
import { Input } from "../../common/components/ui/Input";
import Textarea from "../../common/components/ui/Textarea";
import Button from "../../common/components/ui/Button";

const SuperAdminProjectForm = ({
  formData,
  handleChange,
  handleAddTech,
  handleRemoveTech,
  handleFile,
  handleSubmit,
  onClose,
  editProject,
  errors,
  techStack,
  techInput,
  setTechInput,
}) => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  return (
    <div>
      <div className="lg:px-4 px-2">
        <h2 className="lg:text-2xl text-xl font-bold flex items-center gap-2">
          {editProject ? <EditIcon /> : <PlusCircle />}{" "}
          {editProject ? "Edit Project" : "Upload Project"}
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-h-96 overflow-y-auto p-4"
      >
        <Input
          type="text"
          name="owner"
          placeholder="Owner ID (optional)"
          value={formData.owner}
          onChange={(e) => handleChange("owner", e.target.value)}
          className="hidden"
        />

        <Input
          type="text"
          name="title"
          placeholder="Project title..."
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        {errors?.title && (
          <p className="text-red-600 text-xs">{errors?.title}</p>
        )}

        <Input
          type="text"
          name="subTitle"
          placeholder="Project sub-title..."
          value={formData.subTitle}
          onChange={(e) => handleChange("subTitle", e.target.value)}
        />
        {errors?.subTitle && (
          <p className="text-red-600 text-xs">{errors?.subTitle}</p>
        )}

        <Textarea
          name="description"
          placeholder="Project description..."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        {errors?.description && (
          <p className="text-red-600 text-xs">{errors?.description}</p>
        )}

        <Textarea
          name="summary"
          placeholder="Project summary..."
          value={formData.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
        />
        {errors?.summary && (
          <p className="text-red-600 text-xs">{errors?.summary}</p>
        )}

        <Input
          type="text"
          name="link"
          placeholder="Live project link..."
          value={formData.link}
          onChange={(e) => handleChange("link", e.target.value)}
        />
        {errors?.link && <p className="text-red-600 text-xs">{errors?.link}</p>}

        <Input
          type="text"
          name="type"
          placeholder="Project type..."
          value={formData.type}
          onChange={(e) => handleChange("type", e.target.value)}
        />
        {errors?.type && <p className="text-red-600 text-xs">{errors?.type}</p>}

        <Input
          type="text"
          name="year"
          placeholder="Project creation year..."
          value={formData.year}
          onChange={(e) => handleChange("year", e.target.value)}
        />
        {errors?.year && <p className="text-red-600 text-xs">{errors?.year}</p>}

        <Input
          type="text"
          name="githubUrl"
          placeholder="GitHub url..."
          value={formData.githubUrl}
          onChange={(e) => handleChange("githubUrl", e.target.value)}
        />
        {errors?.githubUrl && (
          <p className="text-red-600 text-xs">{errors?.githubUrl}</p>
        )}

        <div className="bg-base-100">
          <div className="lg:grid lg:grid-cols-12 grid-cols-1 gap-2 justify-self-auto">
            {(techStack || [])?.map((tech, i) => (
              <div key={i} className="lg:col-span-3 col-spn-12 flex gap-1">
                <span className="bg-blue-500 text-white py-1 px-2 rounded text-sm">
                  {tech}
                </span>
                <button
                  onClick={() => handleRemoveTech(i)}
                  className=" bg-red-500 px-2 text-while rounded"
                >
                  <span className="text-white">x</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <Input
          type="text"
          name="techStack"
          placeholder="Add tech and press Enter"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={handleAddTech}
          className="input"
        />
        {errors?.techStack && (
          <p className="text-red-600 text-xs">{errors?.techStack}</p>
        )}

        <h3>Project Image</h3>
        <Input
          type="file"
          accept="image/*"
          name="projectImage"
          onChange={handleFile}
          className="file-input pl-0"
        />
        {errors?.projectImage && (
          <p className="text-red-600 text-xs">{errors?.projectImage}</p>
        )}

        {/* Image Previews CURRENT & NEW */}
        <div className="flex items-center justify-between mt-2 w-full">
          {editProject && editProject?.projectImage && (
            <div className="">
              <label htmlFor="current-image">Current Image</label>
              <img
                src={`${apiURL}${editProject?.projectImage}`}
                alt={editProject?.name}
                className="w-full h-40 object-cover rounded"
              />
            </div>
          )}
          {formData?.projectImage instanceof File && (
            <div className="">
              <label htmlFor="current-image">New Image</label>
              <img
                src={formData?.projectImagePreview}
                className="w-full h-40 object-cover rounded mt-2"
              />
            </div>
          )}
        </div>
        {/* Visibility */}
        <label className="text-sm">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={(e) => handleChange("isPublic", e.target.checked)}
          />{" "}
          Publicly Visible
        </label>
        <div className="flex gap-2 mt-4">
          <Button
            type="submit"
            variant="indigo"
            className="flex items-center gap-2"
          >
            <Save size={20} /> Save
          </Button>
          <Button
            type="button"
            variant="warning"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <X size={20} /> Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SuperAdminProjectForm;
