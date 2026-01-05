import AboutUs from "../../common/pages/AboutUs";
import AdminDashboard from "../pages/AdminDashboard";
import AdminLayout from "../../common/layouts/AdminLayout";
import AdminOrderManagementPage from "../pages/AdminOrderManagementPage";
import AdminUserManagementPage from "../pages/AdminUserManagementPage";
import AuthLayout from "../../common/layouts/AuthLayout";
import CartManagementPage from "../../superAdmin/pages/CartManagementPage";
import CategoriesPage from "../../client/categories/CategoriesPage";
import CategoryManagement from "../../superAdmin/pages/CategoryManagement";
import CheckOutPage from "../../client/cart/CheckOutPage";
import ClientAddressBookPage from "../../client/addressBook/ClientAddressBookPage";
import ClientCartManagementPage from "../../client/cart/ClientCartManagementPage";
import ClientOrderDetailsPage from "../../client/cart/ClientOrderDetailsPage";
import ClientOrdersPage from "../../client/cart/ClientOrdersPage";
import ClientPlanSubscriptionPage from "../../client/subscription/ClientPlanSubscriptionPage";
import ClientProfilePage from "../../client/profile/pages/ClientProfilePage";
import ContactPage from "../../common/pages/ContactPage";

import FaqPage from "../../common/pages/FAQPage";
import ForgotPassword from "../../common/pages/ForgotPassword";
import LandingPage from "../../common/pages/LandingPage";
import Login from "../../common/pages/Login";
import MaintenanceWrapper from "../../common/pages/MaintenanceModeWrapper";
import MyOrders from "../../users/pages/MyOrders";
import NotFound from "../../common/pages/NotFound";
import OrderConfirmationPage from "../../client/cart/OrderConfirmationPage";
import PermissionManagement from "../../superAdmin/pages/PermissionManagement";
import Portfolio from "../../client/portfolio/Portfolio";
import PrivacyPolicyPage from "../../common/pages/PrivacyPolicyPage";
import ProductDetails from "../../client/products/ProductDetails";
import Profile from "../../users/pages/Profile";
import ProjectProgressTracker from "../../superAdmin/pages/ProjectProgressTracker";
import ProtectedRoute from "./ProtectedRoute";
import Register from "../../common/pages/Register";
import ReportsAnalyticsManagement from "../../superAdmin/pages/ReportsAnalyticsManagement";
import ResetPassword from "../../common/pages/ResetPassword";
import RoleManagement from "../../superAdmin/pages/RoleManagement";
import RootLayout from "../../common/layouts/RootLayout";
import SecurityAuditLogManagement from "../../superAdmin/pages/SecurityAuditLogManagement";
import ShippingReturnsPage from "../../common/pages/ShippingReturnsPage";
import SuperAdminAboutContentManagementPage from "../../superAdmin/pages/SuperAdminAboutContentManagementPage";
import SuperAdminAnnouncementManagementPage from "../../superAdmin/pages/SuperAdminAnnouncementManagementPage";
import SuperAdminDashboard from "../../superAdmin/pages/SuperAdminDashboard";
import SuperAdminDeveloperJourneyTracker from "../../superAdmin/pages/SuperAdminDeveloperJourneyTracker";
import SuperAdminFaqManagement from "../../superAdmin/pages/SuperAdminFaqManagement";
import SuperAdminFeatureManagementPage from "../../superAdmin/pages/SuperAdminFeatureManagementPage";
import SuperAdminHeroSlidePage from "../../superAdmin/pages/SuperAdminHeroSlidePage";
import SuperAdminLayout from "../../common/layouts/SuperAdminLayout";
import SuperAdminOrderDetailsPage from "../../superAdmin/pages/SuperAdminOrderDetailsPage";
import SuperAdminOrdersOverviewManagement from "../../superAdmin/pages/SuperAdminOrdersOverviewManagement";
import SuperAdminPlanHistoryManagement from "../../superAdmin/pages/SuperAdminPlanHistoryManagement";
import SuperAdminPlanManagementPage from "../../superAdmin/pages/SuperAdminPlanManagementPage";
import SuperAdminPortfolioManagementPage from "../../superAdmin/pages/SuperAdminPortfolioManagementPage";
import SuperAdminProductManagementPage from "../../superAdmin/pages/SuperAdminProductManagementPage";
import SuperAdminSettingsManagementPage from "../../superAdmin/pages/SuperAdminSystemSettingsManagementPage";
import SuperAdminSubcategoryManagement from "../../superAdmin/pages/SuperAdminSubcategoryManagement";
import SuperAdminUsersManagementPage from "../../superAdmin/pages/SuperAdminUsersManagementPage";
import SuperAdminVendorManagementPage from "../../superAdmin/pages/SuperAdminVendorManagementPage";
import Terms from "../../common/pages/Terms";
import TermsConditionsPage from "../../common/pages/TermsConditionsPage";
import Unauthorized from "../../common/pages/UnauthorizedPage";
import UserDashboard from "../../users/pages/UserDashboard";
import UserLayout from "../../common/layouts/UserLayout";
import WishListItemPage from "../../client/cart/WishListItemPage";
import api from "../../common/lib/api";
import { createBrowserRouter } from "react-router-dom";
import SuperAdminPublicPortfolioViewPage from "../../client/supAdmPortfolio/SuperAdminPublicPortfolioViewPage";
import SuperAdminProjectManagementPage from "../../superAdmin/pages/SuperAdminProjectManagementPage";
import SuperAdminTestimonialManagement from "../../superAdmin/pages/SuperAdminTestimonialManagement";

const router = createBrowserRouter([
  // Root Layout
  {
    path: "/",
    element: (
      <MaintenanceWrapper>
        <RootLayout />
      </MaintenanceWrapper>
    ),

    children: [
      { index: true, element: <LandingPage /> },
      {
        path: "client-cart-management",
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin", "user"]}>
            <ClientCartManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/product-details/:id",
        element: <ProductDetails />,
        loader: async ({ params }) => {
          return fetch(
            `http://localhost:3000/api/client/products/${params.id}`
          );
        },
      },
      {
        path: "/client-cart-checkout",
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin", "user"]}>
            <CheckOutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/client-product-wishlist",
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin", "user"]}>
            <WishListItemPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-profile",
        element: <ClientProfilePage />,
      },
      {
        path: "/client-specific-orders",
        element: (
          <ProtectedRoute
            allowedRoles={["super-admin", "admin", "user"]}
            requiredFeatures={["order"]}
            deniedMessage="Your current plan does not allow client orders. Upgrade to continue."
          >
            <ClientOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/client-order-details/:orderId",
        loader: async ({ params }) => {
          return api.get(
            `http://localhost:3000/api/client/orders/${params.orderId}`
          );
        },
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin", "user"]}>
            <ClientOrderDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/client-order-confirmation",
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin", "user"]}>
            <OrderConfirmationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/client-address-book",
        element: (
          <ProtectedRoute
            allowedRoles={["user", "super-admin", "admin", "user"]}
          >
            <ClientAddressBookPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/product-categories",
        element: <CategoriesPage />,
      },
      {
        path: "/contact-us",
        element: <ContactPage />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/my-portfolio",
        element: (
          <ProtectedRoute allowedRoles={["user", "super-admin", "admin"]}>
            <Portfolio />
          </ProtectedRoute>
        ),
      },
      {
        path: "/frequently-asked-questions",
        element: <FaqPage />,
      },
      {
        path: "/shipping-and-returns",
        element: <ShippingReturnsPage />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsConditionsPage />,
      },
      {
        path: "/super-admin-portfolio",
        element: <SuperAdminPublicPortfolioViewPage />,
      },
      {
        path: "/client-plan-subscription",
        element: (
          <ProtectedRoute
            allowedRoles={["user", "super-admin", "admin", "user"]}
          >
            <ClientPlanSubscriptionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
    ],
  },

  // Login & register layout
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/terms",
        element: <Terms />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
    ],
  },

  // Super admin layout
  {
    path: "/super-admin",
    element: <SuperAdminLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute
            allowedRoles={["super-admin", "admin", "editor", "user"]}
          >
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-management",
        element: (
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <SuperAdminUsersManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "vendor-management",
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
            <SuperAdminVendorManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders-overview-management",
        element: (
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <SuperAdminOrdersOverviewManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "super-admin-order-details/:orderId",
        loader: async ({ params }) => {
          return api.get(
            `http://localhost:3000/api/superAdmin/orders/${params.orderId}`
          );
        },
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
            <SuperAdminOrderDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "reports-analytics-management",
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
            <ReportsAnalyticsManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "system-settings-management",
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
            <SuperAdminSettingsManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "security-audit-log-management",
        element: (
          <ProtectedRoute allowedRoles={["super-admin"]}>
            <SecurityAuditLogManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "category-management",
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
            <CategoryManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "sub-category-management",
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
            <SuperAdminSubcategoryManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "permission-management",
        element: <PermissionManagement />,
      },
      {
        path: "role-management",
        element: <RoleManagement />,
      },
      {
        path: "cart-management",
        element: <CartManagementPage />,
      },
      {
        path: "product-management",
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
            <SuperAdminProductManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "feature-management",
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
            <SuperAdminFeatureManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "plan-management",
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
            <SuperAdminPlanManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "plan-history-management",
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
            <SuperAdminPlanHistoryManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "project-progress-tracker",
        element: <ProjectProgressTracker />,
      },
      {
        path: "hero-banner-management",
        element: <SuperAdminHeroSlidePage />,
      },
      {
        path: "announcement-management",
        element: <SuperAdminAnnouncementManagementPage />,
      },
      {
        path: "developer-journey-tracker",
        element: <SuperAdminDeveloperJourneyTracker />,
      },
      {
        path: "faq-management",
        element: <SuperAdminFaqManagement />,
      },
      {
        path: "about-content-management",
        element: <SuperAdminAboutContentManagementPage />,
      },
      {
        path: "developer-portfolio-management",
        element: <SuperAdminPortfolioManagementPage />,
      },
      {
        path: "project-management",
        element: <SuperAdminProjectManagementPage />,
      },
      {
        path: "testimonials",
        element: <SuperAdminTestimonialManagement />,
      },
    ],
  },

  //Admin Layout
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "admin-orders-management",
        element: (
          <ProtectedRoute
            allowedRoles={["super-admin", "admin"]}
            requiredFeatures={["order"]}
          >
            <AdminOrderManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-users-management",
        element: (
          <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
            <AdminUserManagementPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  //   User layout
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <UserDashboard />,
      },
      {
        path: "orders",
        element: <MyOrders />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  //Not found fall back page
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
