import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema(
  {
    // Branding & Appearance -5
    appName: { type: String, default: "Nova Cart" },
    tagline: { type: String, default: "Your Smart E-Commerce Platform" },
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    footerText: {
      type: String,
      default: "© 2025 Nova Cart. All rights reserved.",
    },
    themeColor: { type: String, default: "#2563eb" },

    // Contact & Support - 2
    supportEmail: { type: String, default: "support@novacart.com" },
    contactNumber: { type: String, default: "+88 01712885625" },

    // Localization & Currency - 2
    currency: { type: String, default: "USD" },
    locale: { type: String, default: "en-US" },

    // Payments / Feature Toggles - 2
    paymentGateways: {
      stripe: { type: Boolean, default: true },
      bkash: { type: Boolean, default: false },
    },
    // Social Links - 1
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      gitHub: { type: String, default: "" },
      linkedIn: { type: String, default: "" },
    },

    // System Behavior - 2
    maintenanceMode: { type: Boolean, default: false },
    taxRate: { type: Number, default: 0 },

    // SEO / Meta - 1
    metaDescription: {
      type: String,
      default: "Nova Cart - The next generation e-commerce solution.",
    },
  },
  { timestamps: true }
);

const SystemSettings = mongoose.model("SystemSettings", systemSettingsSchema);
export default SystemSettings;
