import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({
  institute: String,
  degree: String,
  startYear: String,
  endYear: String,
  description: String,
});

const ExperienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  startDate: String,
  endDate: String,
  description: String,
});

const ProjectSchema = new mongoose.Schema({
  name: String,
  summary: String,
  description: String,
  link: String,
  techStack: [String],
  githubUrl: String,
  type: String,
  year: String,
});

const PortfolioSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  name: { type: String, required: true },
  title: String,
  bio: String,
  profileImage: String, // path or URL
  email: String,
  phone: String,
  location: String,
  skills: [String],
  education: [EducationSchema],
  experience: [ExperienceSchema],
  projects: [ProjectSchema],
  achievements: [String],
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    website: String,
  },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Portfolio", PortfolioSchema);
