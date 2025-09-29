import { SERVER } from "../server/utils/constants.js";
import adminAnalyticsRoutes from "./routes/admin/adminAnalyticsRoutes.js";
import adminOrderRoutes from "./routes/admin/adminOrderRoutes.js";
import adminReportsRoutes from "./routes/admin/adminReportsRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import adminUsersRoutes from "./routes/admin/adminUsersRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import clientAddressRoutes from "./routes/client/clientAddressRoutes.js";
import clientCartRoutes from "./routes/client/clientCartRoutes.js";
import clientCategoryRoutes from "./routes/client/clientCategoryRoutes.js";
import clientContactRoutes from "./routes/client/clientContactRoutes.js";
import clientCouponRoutes from "./routes/client/clientCouponRoutes.js";
import clientNewsletterRoutes from "./routes/client/clientNewsletterRoutes.js";
import clientOrderRoutes from "./routes/client/clientOrderRoutes.js";
import clientProductRoutes from "./routes/client/client.product.routes.js";
import clientProfileRoutes from "./routes/client/clientProfileRoutes.js";
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
import supAdminAuditLogRoutes from "./routes/superAdmin/supAdmAuditLogRoutes.js";
import supAdminReportsRoutes from "./routes/superAdmin/supAdmReportsRoutes.js";
import supAdminUsersRoutes from "./routes/superAdmin/supAdminUsersRoutes.js";
import superAdminOrderRoutes from "./routes/superAdmin/superAdminOrderRoutes.js";

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

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

// Auth & super-admin Mounting Routes
app.use("/api/auth", authRoutes);
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

// Admin related mounting routes
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/admin/products-report", adminReportsRoutes);

// Client related mounting routes
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

app.get("/", (req, res) => {
  res.send("Listening from Nova-cart!");
});

app.listen(port, () => {
  console.log(`Nova-cart Server is running on port ${port}`);
});
