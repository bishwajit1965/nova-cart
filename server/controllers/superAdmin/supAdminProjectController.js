import Project from "../../models/Project.js";
import fs from "fs";
import path from "path";

export const createProject = async (req, res) => {
  try {
    console.log("🎯 Project create method is hit!");
    const payload = req.body;
    // 🧠 Smart parser to handle both JSON and FormData
    console.log("Payload", payload);
    const parseMaybeJSON = (value) => {
      try {
        return typeof value === "string" ? JSON.parse(value) : value;
      } catch {
        return value;
      }
    };

    // 🧩 Fix nested fields that may come as JSON strings
    payload.title = parseMaybeJSON(payload.title);
    payload.subTitle = parseMaybeJSON(payload.subTitle);
    payload.description = parseMaybeJSON(payload.description);
    payload.summary = parseMaybeJSON(payload.summary);
    payload.link = parseMaybeJSON(payload.link);
    payload.githubUrl = parseMaybeJSON(payload.githubUrl);
    payload.type = parseMaybeJSON(payload.type);
    payload.year = parseMaybeJSON(payload.year);
    payload.techStack = parseMaybeJSON(payload.techStack);

    if (
      payload.projectImage === "null" ||
      payload.projectImage === "" ||
      payload.projectImage === undefined
    ) {
      payload.projectImage = null;
    }

    // 🖼️ Handle profile image if file uploaded
    if (req.file) {
      payload.projectImage = `/uploads/${req.file.filename}`;
    }

    const project = new Project(payload);
    console.log("🎯Project", project);
    await project.save();

    res.status(201).json({
      success: true,
      message: "Project created successfully!",
      data: project,
    });
  } catch (error) {
    console.error("Error in creating project", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 🟢 Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params._id);
    if (!project)
      return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 🟡 Update a project
export const updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const parseMaybeJSON = (value) => {
      try {
        return typeof value === "string" ? JSON.parse(value) : value;
      } catch {
        return value;
      }
    };

    payload.education = parseMaybeJSON(payload.education);
    payload.experience = parseMaybeJSON(payload.experience);
    payload.projects = parseMaybeJSON(payload.projects);
    payload.skills = parseMaybeJSON(payload.skills);
    payload.achievements = parseMaybeJSON(payload.achievements);
    payload.socialLinks = parseMaybeJSON(payload.socialLinks);

    if (
      payload.profileImage === "null" ||
      payload.profileImage === "" ||
      payload.profileImage === undefined
    ) {
      payload.profileImage = null;
    }

    if (req.file) {
      payload.profileImage = `/uploads/${req.file.filename}`;
    }

    const updated = await Portfolio.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Portfolio updated successfully!",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update portfolio",
      error: error.message,
    });
  }
};
export const updateProject = async (req, res) => {
  console.log("🎯 Project update method is hit!");
  try {
    const { id } = req.params;
    const payload = req.body;
    console.log("🎯Edit project payload!", payload);
    // Fetch the existing project
    const project = await Project.findById(id);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // If a new file is uploaded
    if (req.file) {
      // Delete old image if exists
      if (project.projectImage) {
        const oldImagePath = path.join(
          process.cwd(),
          "uploads",
          path.basename(project.projectImage)
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });
      }
      payload.projectImage = `/uploads/${req.file.filename}`;
    }

    // Parse JSON/boolean fields
    if (payload.techStack && typeof payload.techStack === "string") {
      try {
        payload.techStack = JSON.parse(payload.techStack);
      } catch {}
    }
    if (payload.isPublic && typeof payload.isPublic === "string") {
      payload.isPublic = payload.isPublic === "true";
    }

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(id, payload, {
      new: true,
      // runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 🔴 Delete a project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
