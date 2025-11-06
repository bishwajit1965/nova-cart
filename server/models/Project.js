import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: { type: String, required: true },
    subTitle: String,
    projectImage: String,
    summary: String,
    description: String,
    link: String,
    githubUrl: String,
    type: String,
    year: String,

    // ✅ tech stack is important!
    techStack: [String],

    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
