import mongoose from "mongoose";

const appConfigSchema = new mongoose.Schema({
  appName: { type: String, required: true },
  logo: { type: String },
  contactEmail: {
    type: String,
  },
  currency: { type: String, default: "USD" },
});

const AppConfig = mongoose.model("AppConfig", appConfigSchema);

export default AppConfig;
