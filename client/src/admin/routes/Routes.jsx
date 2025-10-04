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
import ClientProfilePage from "../../client/profile/pages/ClientProfilePage";
import ComingSoonPage from "../../common/pages/ComingSoonPage";
import ContactPage from "../../common/pages/ContactPage";
import ContentManagement from "../../superAdmin/pages/ContentManagement";
import ForgotPassword from "../../common/pages/ForgotPassword";
import LandingPage from "../../common/pages/LandingPage";
import Login from "../../common/pages/Login";
import MyOrders from "../../users/pages/MyOrders";
import NotFound from "../../common/pages/NotFound";
import OrderConfirmationPage from "../../client/cart/OrderConfirmationPage";
import PermissionManagement from "../../superAdmin/pages/PermissionManagement";
import Portfolio from "../../client/portfolio/Portfolio";
import ProductDetails from "../../client/products/ProductDetails";
import ProductOversight from "../../superAdmin/pages/ProductOversight";
import Profile from "../../users/pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import Register from "../../common/pages/Register";
import ReportsAnalyticsManagement from "../../superAdmin/pages/ReportsAnalyticsManagement";
import ResetPassword from "../../common/pages/ResetPassword";
import RoleManagement from "../../superAdmin/pages/RoleManagement";
import RootLayout from "../../common/layouts/RootLayout";
import SecurityAuditLogManagement from "../../superAdmin/pages/SecurityAuditLogManagement";
import SuperAdminDashboard from "../../superAdmin/pages/SuperAdminDashboard";
import SuperAdminLayout from "../../common/layouts/SuperAdminLayout";
import SuperAdminOrderDetailsPage from "../../superAdmin/pages/SuperAdminOrderDetailsPage";
import SuperAdminOrdersOverviewManagement from "../../superAdmin/pages/SuperAdminOrdersOverviewManagement";
import SuperAdminProductManagementPage from "../../superAdmin/pages/SuperAdminProductManagementPage";
import SuperAdminSubcategoryManagement from "../../superAdmin/pages/SuperAdminSubcategoryManagement";
import SuperAdminUsersManagementPage from "../../superAdmin/pages/SuperAdminUsersManagementPage";
import SystemSettingsManagement from "../../superAdmin/pages/SystemSettingsManagement";
import Terms from "../../common/pages/Terms";
import Unauthorized from "../../common/pages/UnauthorizedPage";
import UserDashboard from "../../users/pages/UserDashboard";
import UserLayout from "../../common/layouts/UserLayout";
import VendorManagement from "../../superAdmin/pages/VendorManagement";
import WishListItemPage from "../../client/cart/WishListItemPage";
import api from "../../common/lib/api";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  // Root Layout
  {
    path: "/",
    element: <RootLayout />,
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
          <ProtectedRoute allowedRoles={["super-admin", "admin", "user"]}>
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
        element: <ClientAddressBookPage />,
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
        element: <Portfolio />,
      },
      {
        path: "/faq",
        element: <ComingSoonPage />,
      },
      {
        path: "/shipping-returns",
        element: <ComingSoonPage />,
      },
      {
        path: "/privacy",
        element: <ComingSoonPage />,
      },
      {
        path: "/terms",
        element: <ComingSoonPage />,
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
        element: <Profile />,
      },
      {
        path: "user-management",
        element: <SuperAdminUsersManagementPage />,
      },
      {
        path: "vendor-management",
        element: <VendorManagement />,
      },
      {
        path: "product-oversight-management",
        element: <ProductOversight />,
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
        path: "content-management",
        element: <ContentManagement />,
      },
      {
        path: "system-settings-management",
        element: <SystemSettingsManagement />,
      },
      {
        path: "security-audit-log-management",
        element: <SecurityAuditLogManagement />,
      },
      {
        path: "category-management",
        element: <CategoryManagement />,
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
          <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
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
