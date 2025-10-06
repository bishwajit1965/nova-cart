const API_PATHS = {
  // SUPER_ADMIN RELATED API_PATHS
  AUDIT_LOGS: {
    ENDPOINT: "superAdmin/audit-logs",
    KEY: ["audit-logs"],
  },
  CATEGORIES: {
    ENDPOINT: "superAdmin/categories",
    KEY: ["categories"],
  },
  SUB_CATEGORIES: {
    SUB_CATEGORIES_ENDPOINT: "superAdmin/sub-categories",
    SUB_CATEGORIES_KEY: ["sub-categories"],
  },
  CARTS: {
    ENDPOINT: "superAdmin/carts",
    KEY: ["carts"],
  },
  PERMISSIONS: {
    ENDPOINT: "superAdmin/permissions",
    KEY: ["permissions"],
  },
  PRODUCTS: {
    ENDPOINT: "superAdmin/products",
    KEY: ["products"],
  },
  REPORTS: {
    ORDERS_SUMMARY: "superAdmin/reports/orders-summary",
    ORDERS_SUMMARY_KEY: ["orders-summary"],

    ORDERS_OVER_TIME: "superAdmin/reports/orders-over-time",
    ORDERS_OVER_TIME_KEY: ["orders-over-time"],

    USERS_SUMMARY: "superAdmin/reports/users-summary",
    USERS_SUMMARY_KEY: ["users-summary"],

    PRODUCTS_SUMMARY: "superAdmin/reports/products-summary",
    PRODUCTS_SUMMARY_KEY: ["products-summary"],
  },
  ORDERS: {
    ENDPOINT: "superAdmin/orders",
    KEY: ["orders"],
  },
  ROLES: {
    ENDPOINT: "superAdmin/roles",
    KEY: ["roles"],
  },

  /** ----> SUPER ADMIN DASH-BOARD ANALYTICS API PATHS ----> */
  DB_SUMMARY: {
    SUPERADMIN_SUMMARY_ENDPOINT: "superAdmin/summary",
    SUPERADMIN_SUMMARY_KEY: ["superadmin-summary"],
  },
  DB_ANALYTICS: {
    USERS_ANALYTICS_ENDPOINT: "superAdmin/analytics/users",
    USERS_ANALYTICS_KEY: ["users-analytics"],

    ORDERS_ANALYTICS_ENDPOINT: "superAdmin/analytics/orders",
    ORDERS_ANALYTICS_KEY: ["orders-analytics"],
  },
  SUPER_ADMIN_USERS: {
    SUPER_ADMIN_USERS_ENDPOINT: "superAdmin/users-moderation",
    SUPER_ADMIN_USERS_KEY: ["users-moderation"],
  },
  USERS: {
    ENDPOINT: "superAdmin/users",
    KEY: ["users"],
  },

  /***------> ADMIN RELATED API PATHS ------>*/
  ADMIN_ANALYTICS: {
    USERS_ANALYTICS_ENDPOINT: "admin/analytics",
    USERS_ANALYTICS_KEY: ["admin-users-analytics"],
  },

  ADMIN_ORDERS: {
    ADMIN_ORDERS_ENDPOINT: "admin/orders",
    ADMIN_ORDERS_KEY: ["admin-orders"],

    STATUS_SUMMARY: "admin/orders/status-summary",
    STATUS_SUMMARY_KEY: ["admin-orders", "status-summary"],

    REVENUE_SUMMARY: "admin/orders/revenue-summary",
    REVENUE_SUMMARY_KEY: ["admin-orders", "revenue-summary"],

    ORDERS_OVER_TIME: "admin/orders/orders-over-time",
    ORDERS_OVER_TIME_KEY: ["admin-orders", "orders-over-time"],
  },

  ADMIN_PRODUCT_REPORT: {
    PRODUCT_REPORT_ENDPOINT: "admin/products-report/top-products",
    PRODUCT_REPORT_KEY: ["admin-product-report"],

    ORDER_REPORT_ENDPOINT: "admin/products-report/recent-orders",
    ORDER_REPORT_KEY: ["admin-order-report"],

    REVENUE_OVER_TIME_ENDPOINT: "admin/products-report/revenue-over-time",
    REVENUE_OVER_TIME_KEY: ["admin-revenue-over-time"],

    EXPORT_ENDPOINT: "admin/products-report/export", // ✅ for exporting CSV/PDF
  },

  ADMIN_USERS: {
    ADMIN_USERS_ENDPOINT: "admin/users",
    ADMIN_USERS_KEY: ["admin-users"],

    STATUS_SUMMARY: "admin/users/user-status-summary",
    STATUS_SUMMARY_KEY: ["admin-users", "user-status-summary"],
  },

  /*** ------> CLIENT RELATED API_PATHS ------> */
  CLIENT_ADDRESS: {
    CLIENT_ADDRESS_ENDPOINT: "client/address",
    CLIENT_ADDRESS_KEY: ["address"],
  },
  CLIENT_CHECKOUT: {
    CLIENT_CHECKOUT_ENDPOINT: "client/checkout",
    CLIENT_CHECKOUT_KEY: ["checkout"],
  },
  CLIENT_CONTACT: {
    CLIENT_CONTACT_ENDPOINT: "client/contacts",
    CLIENT_CONTACT_KEY: ["contacts"],
  },
  CLIENT_COUPON: {
    CLIENT_COUPON_ENDPOINT: "client/coupons",
    CLIENT_COUPON_KEY: ["coupons"],
  },
  CLIENT_CATEGORIES: {
    CLIENT_CATEGORIES_ENDPOINT: "client/categories",
    CLIENT_CATEGORIES_KEY: ["categories"],

    NON_FEATURED: "client/categories/non-featured",
    NON_FEATURED_KEY: ["categories", "non-featured"],
  },
  CLIENT_SUB_CATEGORIES: {
    CLIENT_SUB_CATEGORIES_ENDPOINT: "client/sub-categories",
    CLIENT_SUB_CATEGORIES_KEY: ["sub-categories"],
  },
  CLIENT_PRODUCTS: {
    CLIENT_ENDPOINT: "client/products",
    CLIENT_KEY: ["products"],
  },
  CLIENT_BEST_SELLER_PRODUCTS: {
    CLIENT_BEST_SELLER_ENDPOINT: "client/products/best-sellers",
    CLIENT_BEST_SELLER_KEY: ["best-sellers"],
  },
  CLIENT_CARTS: {
    CLIENT_ENDPOINT: "client/carts",
    CLIENT_KEY: ["carts"],
  },
  CLIENT_WISH_LISTS: {
    CLIENT_WISH_LIST_ENDPOINT: "client/wishlists",
    CLIENT_KEY: ["wishlists"],
  },
  CLIENT_PROFILE_ME: {
    CLIENT_PROFILE_ME_ENDPOINT: "client/profile",
    CLIENT_PROFILE_KEY: ["profile"],
  },
  CLIENT_ORDERS: {
    CLIENT_ORDERS_ENDPOINT: "client/orders",
    CLIENT_KEY: ["orders"],
  },
  CLIENT_STRIPE: {
    CLIENT_STRIPE_ENDPOINT: "client/stripe",
    CLIENT_STRIPE_KEY: ["stripe"],
  },
  CLIENT_TESTIMONIAL: {
    CLIENT_TESTIMONIAL_ENDPOINT: "client/testimonials",
    CLIENT_KEY: ["testimonials"],
  },
  CLIENT_NEWSLETTER: {
    NEWSLETTER_ENDPOINT: "client/newsletter/subscribe",
    NEWSLETTER_KEY: ["newsletter-subscribe"],
  },

  // Extend this for other features.....
};

export default API_PATHS;
