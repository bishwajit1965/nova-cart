import Project from "../../models/Project.js";

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    if (!projects)
      return res
        .status(404)
        .json({ success: false, message: "No projects found!" });
    res.status(200).json({
      success: true,
      message: "Projects fetched successfully!",
      data: projects,
    });
  } catch (error) {
    console.error("Error in fetching developer projects!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export default { getAllProjects };
