import { EditIcon, PlusCircle, Save, X } from "lucide-react";

import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import Textarea from "../../common/components/ui/Textarea";
import { LucideIcon } from "../../common/lib/LucideIcons";

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
  isSaving,
}) => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  console.log("profileImage:", formData.profileImage);
  console.log("preview:", formData.profileImagePreview);
  console.log("isFile?", formData.profileImage instanceof File);
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
        encType="multipart/form-data"
        className="space-y-2 lg:p-2 p-2 px-4 max-h-[80vh] overflow-y-auto"
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
          className="input input-sm"
        />
        {errors?.name && <p className="text-red-600 text-xs">{errors?.name}</p>}

        <Input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="input input-sm"
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
          className="input input-sm"
        />
        {errors?.email && (
          <p className="text-red-600 text-xs">{errors?.email}</p>
        )}

        <Input
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="input input-sm"
        />
        {errors?.phone && (
          <p className="text-red-600 text-xs">{errors?.phone}</p>
        )}

        <Input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="input input-sm"
        />
        {errors?.location && (
          <p className="text-red-600 text-xs">{errors?.location}</p>
        )}

        <div className="space-y-2">
          {/* Skills */}
          <div>
            <h3 className="font-bold">Skills</h3>
            {formData.skills.map((s, i) => (
              <div key={i} className="flex items-center gap-2 space-y-2">
                <Input
                  value={s}
                  onChange={(e) =>
                    handleArrayChange("skills", i, e.target.value)
                  }
                  placeholder="Skill"
                  className="input input-sm"
                />
                <Button
                  type="button"
                  size="xs"
                  variant="danger"
                  icon={LucideIcon.Trash2}
                  onClick={() => removeArrayItem("skills", i)}
                  className="mb-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("skills", "")}
              className="border border-emerald-500 rounded-md shadow-md py-1 px-2 bg-emerald-600 text-base-100 hover:bg-emerald-700 hover:text-base-200 text-sm"
            >
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
                    className="input input-sm mb-2"
                  />
                ))}
                <div className="flex justify-end mb-2">
                  <Button
                    onClick={() => removeArrayItem("education", i)}
                    type="button"
                    variant="danger"
                    icon={LucideIcon.Trash2}
                    size="xs"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("education", {})}
              className="border border-emerald-500 rounded-md shadow-md py-1 px-2 bg-emerald-600 text-base-100 hover:bg-emerald-700 hover:text-base-200 text-sm"
            >
              + Add Education
            </button>
          </div>

          {/* Experience */}
          <div className="">
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
                      className="input input-sm mb-2"
                    />
                  ),
                )}
                <div className="flex justify-end mb-2">
                  <Button
                    onClick={() => removeArrayItem("experience", i)}
                    type="button"
                    size="xs"
                    variant="danger"
                    icon={LucideIcon.Trash2}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("experience", {})}
              className="border border-emerald-500 rounded-md shadow-md py-1 px-2 bg-emerald-600 text-base-100 hover:bg-emerald-700 hover:text-base-200 text-sm"
            >
              + Add Experience
            </button>
          </div>

          {/* Projects */}
          <div className="">
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
                    className="mb-2 input input-sm"
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
                      e.target.value.split(",").map((s) => s.trim()),
                    )
                  }
                  className="mb-2 input input-sm"
                />
                <div className="flex justify-end mb-2">
                  <Button
                    type="button"
                    onClick={() => removeArrayItem("projects", i)}
                    size="xs"
                    variant="danger"
                    icon={LucideIcon.Trash2}
                    className="flex items-center gap-2"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("projects", {})}
              className="border border-emerald-500 rounded-md shadow-md py-1 px-2 bg-emerald-600 text-base-100 hover:bg-emerald-700 hover:text-base-200 text-sm"
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
                  className="input input-sm"
                />
                <Button
                  onClick={() => removeArrayItem("achievements", i)}
                  variant="danger"
                  icon={LucideIcon.Trash2}
                  size="xs"
                  className=""
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("achievements", "")}
              className="border border-emerald-500 rounded-md shadow-md py-1 px-2 bg-emerald-600 text-base-100 hover:bg-emerald-700 hover:text-base-200 text-sm"
            >
              + Add Achievement
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-bold">Social Links</h3>
          {Object.keys(formData.socialLinks).map((key) => (
            <Input
              key={key}
              value={formData.socialLinks[key]}
              placeholder={key}
              onChange={(e) => handleSocialChange(key, e.target.value)}
              className="mb-2 input input-sm"
            />
          ))}
        </div>

        {/* Profile Image */}
        <div>
          <h3 className="font-bold">Profile Image</h3>
          <Input
            type="file"
            accept="image/*"
            name="profileImage"
            onChange={(e) => handleFile(e, "image")}
            className="file-input file-input-sm pl-0"
          />

          <div className="flex items-center justify-between mt-2">
            {editPortfolio?.profileImage && (
              <div className="">
                <label htmlFor="current-image text-sm">Current Image</label>
                <img
                  src={`${apiURL}${editPortfolio?.profileImage}`}
                  alt={editPortfolio?.name}
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            )}

            {formData?.profileImagePreview && (
              <div className="">
                <label htmlFor="current-image text-sm">New Image</label>
                <img
                  src={formData?.profileImagePreview}
                  alt={formData?.name}
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>
        <div className="">
          <label htmlFor="demoVideo" className="font-bold">
            Demo Video
          </label>
          <Input
            type="file"
            name="demoVideo"
            accept="video/mp4,video/webm"
            onChange={(e) => handleFile(e, "video")}
            className="file-input file-input-sm pl-0"
          />
        </div>
        <div className="">
          {formData.demoVideoPreview && (
            <video controls width="100%">
              <source src={formData.demoVideoPreview} />
            </video>
          )}
        </div>
        {/* Visibility */}
        <label className="text-sm font-bold">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={(e) => handleChange("isPublic", e.target.checked)}
          />{" "}
          Publicly Visible
        </label>
        <div className="flex gap-4 mt-4">
          <Button
            type="submit"
            variant="indigo"
            disabled={isSaving}
            size="sm"
            icon={LucideIcon.Save}
            label={editPortfolio ? "Update" : "Save"}
            className="flex items-center gap-2"
          />

          <Button
            type="button"
            variant="warning"
            label="Cancel"
            size="sm"
            onClick={onClose}
            icon={LucideIcon.X}
            className="flex items-center gap-2"
          />
        </div>
      </form>
    </div>
  );
};

export default SuperAdminPortfolioForm;
