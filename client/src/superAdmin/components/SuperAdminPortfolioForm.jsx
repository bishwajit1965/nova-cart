import { EditIcon, PlusCircle, Save, X } from "lucide-react";

import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import Textarea from "../../common/components/ui/Textarea";

const SuperAdminPortfolioForm = ({
  formData,
  handleChange,
  handleNestedChange,
  handleArrayChange,
  addArrayItem,
  removeArrayItem,
  handleFile,
  handleSocialChange,
  handleSubmit,
  onClose,
  editPortfolio,
  errors,
}) => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  return (
    <div className="bg-base-100 rounded shadow">
      <div className="lg:px-4 px-2">
        <h2 className="lg:text-2xl text-xl font-bold flex items-center gap-2">
          {editPortfolio ? <EditIcon /> : <PlusCircle />}{" "}
          {editPortfolio
            ? "Edit Developer Portfolio"
            : "Upload Developer Portfolio"}
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-2 lg:p-4 p-2 px-4 max-h-[80vh] overflow-y-auto"
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
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        {errors?.name && <p className="text-red-600 text-xs">{errors?.name}</p>}
        <Input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        {errors?.title && (
          <p className="text-red-600 text-xs">{errors?.title}</p>
        )}
        <Textarea
          name="bio"
          placeholder="Bio"
          value={formData.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
        />
        {errors?.bio && <p className="text-red-600 text-xs">{errors?.bio}</p>}
        <Input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        {errors?.email && (
          <p className="text-red-600 text-xs">{errors?.email}</p>
        )}
        <Input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        {errors?.phone && (
          <p className="text-red-600 text-xs">{errors?.phone}</p>
        )}
        <Input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
        {errors?.location && (
          <p className="text-red-600 text-xs">{errors?.location}</p>
        )}
        location
        {/* Skills */}
        <div>
          <h3 className="font-bold">Skills</h3>
          {formData.skills.map((s, i) => (
            <div key={i} className="flex items-center gap-2 space-y-2">
              <Input
                value={s}
                onChange={(e) => handleArrayChange("skills", i, e.target.value)}
                placeholder="Skill"
                className="mb-"
              />
              <Button
                type="button"
                variant="base"
                onClick={() => removeArrayItem("skills", i)}
                className="p-2 rounded mb-2 flex items-center bg-base-200 shadow-sm"
              >
                <X size={20} className="text-red-400" />
              </Button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("skills", "")}>
            + Add Skill
          </button>
        </div>
        {/* Education */}
        <div>
          <h3 className="font-bold">Education</h3>
          {formData.education.map((edu, i) => (
            <div key={i}>
              {[
                "institute",
                "degree",
                "startYear",
                "endYear",
                "description",
              ].map((key) => (
                <Input
                  key={key}
                  value={edu[key] || ""}
                  placeholder={key}
                  onChange={(e) =>
                    handleNestedChange("education", i, key, e.target.value)
                  }
                  className="mb-2"
                />
              ))}
              <button
                type="button"
                onClick={() => removeArrayItem("education", i)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("education", {})}>
            + Add Education
          </button>
        </div>
        {/* Experience */}
        <div>
          <h3 className="font-bold">Experience</h3>
          {formData.experience.map((exp, i) => (
            <div key={i}>
              {["company", "role", "startDate", "endDate", "description"].map(
                (key) => (
                  <Input
                    key={key}
                    value={exp[key] || ""}
                    placeholder={key}
                    onChange={(e) =>
                      handleNestedChange("experience", i, key, e.target.value)
                    }
                    className="mb-2"
                  />
                )
              )}
              <button
                type="button"
                onClick={() => removeArrayItem("experience", i)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("experience", {})}>
            + Add Experience
          </button>
        </div>
        {/* Projects */}
        <div>
          <h3 className="font-bold">Projects</h3>
          {formData.projects.map((proj, i) => (
            <div key={i}>
              {["name", "description", "link"].map((key) => (
                <Input
                  key={key}
                  value={proj[key] || ""}
                  placeholder={key}
                  onChange={(e) =>
                    handleNestedChange("projects", i, key, e.target.value)
                  }
                  className="mb-2"
                />
              ))}
              <Input
                value={(proj.techStack || []).join(",")}
                placeholder="Tech Stack"
                onChange={(e) =>
                  handleNestedChange(
                    "projects",
                    i,
                    "techStack",
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
                className="mb-2"
              />
              <button
                type="button"
                onClick={() => removeArrayItem("projects", i)}
                className="flex items-center gap-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("projects", {})}
            className="flex items-center gap-2"
          >
            + Add Project
          </button>
        </div>
        {/* Achievements */}
        <div>
          <h3 className="font-bold">Achievements</h3>
          {formData.achievements.map((ach, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <Input
                value={ach}
                placeholder="Achievement"
                onChange={(e) =>
                  handleArrayChange("achievements", i, e.target.value)
                }
              />
              <Button
                variant="base"
                onClick={() => removeArrayItem("achievements", i)}
                className=" p-2 rounded shadow-sm"
              >
                <X size={20} className="text-red-400" />
              </Button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("achievements", "")}
          >
            + Add Achievement
          </button>
        </div>
        {/* Social Links */}
        <div>
          <h3>Social Links</h3>
          {Object.keys(formData.socialLinks).map((key) => (
            <Input
              key={key}
              value={formData.socialLinks[key]}
              placeholder={key}
              onChange={(e) => handleSocialChange(key, e.target.value)}
              className="mb-2"
            />
          ))}
        </div>
        {/* Profile Image */}
        <div>
          <h3>Profile Image</h3>
          <Input
            type="file"
            accept="image/*"
            name="profileImage"
            onChange={handleFile}
            className="file-input pl-0"
          />

          {/* Image Previews CURRENT & NEW */}
          {formData.coverImagePreview && (
            <img
              src={formData.coverImagePreview}
              className="w-full h-40 object-cover rounded"
            />
          )}
          <div className="flex items-center justify-between mt-2">
            {editPortfolio?.profileImage && (
              <div className="">
                <label htmlFor="current-image">Current Image</label>
                <img
                  src={`${apiURL}${editPortfolio?.profileImage}`}
                  alt={editPortfolio?.name}
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            )}
            {formData?.profileImagePreview instanceof File && (
              <div className="">
                <label htmlFor="current-image">New Image</label>
                <img
                  src={formData?.profileImagePreview}
                  className="w-20 h-20 object-cover rounded mt-2"
                />
              </div>
            )}
          </div>
        </div>
        {/* Visibility */}
        <label>
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={(e) => handleChange("isPublic", e.target.checked)}
            // onChange={handleChange}
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

export default SuperAdminPortfolioForm;
