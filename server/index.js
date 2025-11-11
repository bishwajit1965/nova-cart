import { SERVER } from "../server/utils/constants.js";
import adminAnalyticsRoutes from "./routes/admin/adminAnalyticsRoutes.js";
import adminOrderRoutes from "./routes/admin/adminOrderRoutes.js";
import adminReportsRoutes from "./routes/admin/adminReportsRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import adminUsersRoutes from "./routes/admin/adminUsersRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import { checkMaintenanceMode } from "./middlewares/maintenanceMode.js";
import clientAddressRoutes from "./routes/client/clientAddressRoutes.js";
import clientCartRoutes from "./routes/client/clientCartRoutes.js";
import clientCategoryRoutes from "./routes/client/clientCategoryRoutes.js";
import clientCheckoutRoutes from "./routes/client/clientCheckoutRoutes.js";
import clientContactRoutes from "./routes/client/clientContactRoutes.js";
import clientCouponRoutes from "./routes/client/clientCouponRoutes.js";
import clientNewsletterRoutes from "./routes/client/clientNewsletterRoutes.js";
import clientOrderRoutes from "./routes/client/clientOrderRoutes.js";
import clientPlanHistoryRoutes from "./routes/client/clientPlanHistoryRoutes.js";
import clientPlanSubscriptionRoutes from "./routes/client/clientPlanSubscriptionRoutes.js";
import clientProductRoutes from "./routes/client/client.product.routes.js";
import clientProfileRoutes from "./routes/client/clientProfileRoutes.js";
import clientStripeRoutes from "./routes/client/clientStripeRoutes.js";
import clientSubCategoryRoutes from "./routes/client/clientSubCategoryRoutes.js";
import clientTestimonialRoutes from "./routes/client/clientTestimonialRoutes.js";
import clientWishListRoutes from "./routes/client/clientWishListRoutes.js";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import permissionRoutes from "./routes/permissionRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import subCategoryRoutes from "./routes/superAdmin/subCategoryRoutes.js";
import supAdmAnalyticsRoutes from "./routes/superAdmin/supAdmAnalyticsRoutes.js";
import supAdmProductRoutes from "./routes/supAdmProductRoutes.js";
import supAdmSummaryRoutes from "./routes/superAdmin/supAdmSummaryRoutes.js";
import supAdminAboutContentRoutes from "./routes/superAdmin/supAdminAboutContentRoutes.js";
import supAdminAnnouncementRoutes from "./routes/superAdmin/supAdminAnnouncementRoutes.js";
import supAdminAuditLogRoutes from "./routes/superAdmin/supAdmAuditLogRoutes.js";
import supAdminBillingRoutes from "./routes/superAdmin/supAdminBillingRoutes.js";
import supAdminFaqRoutes from "./routes/superAdmin/supAdminFaqRoutes.js";
import supAdminFeatureRoutes from "./routes/superAdmin/supAdminFeatureRoutes.js";
import supAdminHeroSlideBannerRoutes from "./routes/superAdmin/supAdminHeroSlideRoutes.js";
import supAdminMonthlyRevenueRoutes from "./routes/superAdmin/supAdminMonthlyRevenueRoutes.js";
import supAdminPlanHistoryRoutes from "./routes/superAdmin/supAdminPlanHistoryRoutes.js";
import supAdminPlanRoutes from "./routes/superAdmin/supAdminPlanRoutes.js";
import supAdminPortfolioRoutes from "./routes/superAdmin/supAdminPortfolioRoutes.js";
import supAdminReportsRoutes from "./routes/superAdmin/supAdmReportsRoutes.js";
import supAdminRevenueAnalyticsRoutes from "./routes/superAdmin/supAdminRevenueAnalyticsRoutes.js";
import supAdminSystemSettingsRoutes from "./routes/superAdmin/supAdminSystemSettingsRoutes.js";
import supAdminUsersRoutes from "./routes/superAdmin/supAdminUsersRoutes.js";
import supAdminVendorsRoutes from "./routes/superAdmin/supAdminVendorsRoutes.js";
import superAdminOrderRoutes from "./routes/superAdmin/superAdminOrderRoutes.js";
import clientSupAdmPortfolioViewRoutes from "./routes/client/clientSupAdminPortfolioViewRoutes.js";
import supAdminProjectRoutes from "./routes/superAdmin/supAdminProjectRoutes.js";
import clientSupAdminProjectRoutes from "./routes/client/clientSupAdminProjectRoutes.js";
import clientHeroSlidesRoutes from "./routes/client/clientHeroSlidesRoutes.js";
import clientFeaturedPromotionBannerRoutes from "./routes/client/clientFeaturedPromotionBannerRoutes.js";
import clientFaqRoutes from "./routes/client/clientFaqRoutes.js";
import googleAuthRoutes from "./routes/googleAuth/googleAuthRoutes.js";
import facebookAuthRoutes from "./routes/facebookAuth/facebookAuthRoutes.js";
import clientAnnouncementRoutes from "./routes/client/clientAnnouncementRoutes.js";
import clientSystemSettingsRoutes from "./routes/client/clientSystemSettingsRoutes.js";

/**==========================================
 * Essential configurations section
 *===========================================*/
dotenv.config(); // ✅ load .env first

// Connect to the database
connectDb();

const app = express();
const port = SERVER.PORT || 3000;
// const port = process.env.PORT || 3000;

// For image display
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

const allowedOrigins = [
  "http://localhost:5173", // Vite Frontend
  "http://localhost:3000", // If frontend sometimes runs through proxy
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

// Middlewares
app.use(cookieParser());
app.use(express.json());
// app.use(
//   cors({
//     origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.use(express.urlencoded({ extended: true }));

/**==========================================
 * Auth & super-admin related Mounting Routes
 *===========================================*/
app.use("/api/auth", authRoutes);
app.use("/api/auth/google", googleAuthRoutes);
app.use("/api/auth/facebook", facebookAuthRoutes);
app.use("/api/superAdmin/carts", cartRoutes);
app.use("/api/superAdmin/users", adminUserRoutes);
app.use("/api/superAdmin/categories", categoryRoutes);
app.use("/api/superAdmin/permissions", permissionRoutes);
app.use("/api/superAdmin/products", supAdmProductRoutes);
app.use("/api/superAdmin/roles", roleRoutes);
app.use("/api/superAdmin/orders", superAdminOrderRoutes);
app.use("/api/superAdmin/sub-categories", subCategoryRoutes);
app.use("/api/superAdmin/audit-logs", supAdminAuditLogRoutes);
app.use("/api/superAdmin/reports", supAdminReportsRoutes);
app.use("/api/superAdmin/summary", supAdmSummaryRoutes);
app.use("/api/superAdmin/analytics", supAdmAnalyticsRoutes);
app.use("/api/superAdmin/users-moderation", supAdminUsersRoutes);
app.use("/api/superAdmin/features", supAdminFeatureRoutes);
app.use("/api/superAdmin/plans", supAdminPlanRoutes);
app.use("/api/superAdmin/billing", supAdminBillingRoutes);
app.use(
  "/api/superAdmin/revenue-analytics/weekly",
  supAdminRevenueAnalyticsRoutes
);
app.use(
  "/api/superAdmin/revenue-analytics/monthly",
  supAdminMonthlyRevenueRoutes
);
app.use("/api/superAdmin/plan-histories", supAdminPlanHistoryRoutes);
app.use("/api/superAdmin/vendors", supAdminVendorsRoutes);
app.use("/api/superAdmin/system-settings", supAdminSystemSettingsRoutes);
app.use("/api/superAdmin/slides-banner", supAdminHeroSlideBannerRoutes);
app.use("/api/superAdmin/announcements", supAdminAnnouncementRoutes);
app.use("/api/superAdmin/faqs", supAdminFaqRoutes);
app.use("/api/superAdmin/about-content", supAdminAboutContentRoutes);
app.use("/api/superAdmin/portfolio", supAdminPortfolioRoutes);
app.use("/api/superAdmin/project", supAdminProjectRoutes);

/**==========================================
 * Admin related mounting routes
 *===========================================*/
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/admin/products-report", adminReportsRoutes);

/***=========================================
 * SITE MAINTENANCE MIDDLEWARE CHECK ✅
 * ========================================== */
app.use(checkMaintenanceMode);

/**==========================================
 * Client related mounting routes
 *===========================================*/
app.use("/api/client/products", clientProductRoutes);
app.use("/api/client/carts", clientCartRoutes);
app.use("/api/client/categories", clientCategoryRoutes);
app.use("/api/client/wishlists", clientWishListRoutes);
app.use("/api/client/orders", clientOrderRoutes);
app.use("/api/client/profile", clientProfileRoutes);
app.use("/api/client/address", clientAddressRoutes);
app.use("/api/client/sub-categories", clientSubCategoryRoutes);
app.use("/api/client/newsletter/subscribe", clientNewsletterRoutes);
app.use("/api/client/testimonials", clientTestimonialRoutes);
app.use("/api/client/contacts", clientContactRoutes);
app.use("/api/client/coupons", clientCouponRoutes);
app.use("/api/client/checkout", clientCheckoutRoutes);
app.use("/api/client/stripe", clientStripeRoutes);
app.use("/api/client/plan-subscription", clientPlanSubscriptionRoutes);
app.use("/api/client/plan-history", clientPlanHistoryRoutes);
app.use("/api/client/portfolio", clientSupAdmPortfolioViewRoutes);
app.use("/api/client/project", clientSupAdminProjectRoutes);
app.use("/api/client/client-slides-banner", clientHeroSlidesRoutes);
app.use(
  "/api/client/client-featured-promotion-banner",
  clientFeaturedPromotionBannerRoutes
);
app.use("/api/client/faqs", clientFaqRoutes);
app.use("/api/client/client-announcements", clientAnnouncementRoutes);
app.use(
  "/api/client/client-system-settings/preference",
  clientSystemSettingsRoutes
);

/**=========================================
 * Server active status message display
 *==========================================*/
app.get("/", (req, res) => {
  res.send("Listening from Nova-cart!");
});

/**=========================================
 * Server active port status message display
 *==========================================*/
app.listen(port, () => {
  console.log(`Nova-cart Server is running on port ${port}`);
});
