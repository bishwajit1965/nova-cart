const API_PATHS = {
  // SUPER_ADMIN RELATED API_PATHS
  AUDIT_LOGS: {
    ENDPOINT: "superAdmin/audit-logs",
    KEY: ["audit-logs"],
  },
  SUP_ADMIN_BILLING: {
    SUP_ADMIN_BILLING_ENDPOINT: "superAdmin/billing",
    SUP_ADMIN_BILLING_KEY: ["billing"],
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

  /** SUPER ADMIN PORTFOLIO MANAGEMENT API PATHS */
  SUP_ADMIN_PORTFOLIO: {
    SUP_ADMIN_PORTFOLIO_ENDPOINT: "superAdmin/portfolio",
    SUP_ADMIN_PORTFOLIO_KEY: ["portfolio"],
  },

  /** SUPER ADMIN PROJECT MANAGEMENT API PATHS */
  SUP_ADMIN_PROJECT: {
    SUP_ADMIN_PROJECT_ENDPOINT: "superAdmin/project",
    SUP_ADMIN_PROJECT_KEY: ["project"],
  },

  /** SUPER ADMIN ABOUT CONTENT MANAGEMENT API PATHS */
  SUP_ADMIN_ABOUT_CONTENT: {
    SUP_ADMIN_ABOUT_CONTENT_ENDPOINT: "superAdmin/about-content",
    SUP_ADMIN_ABOUT_CONTENT_KEY: ["about-content"],
  },

  /** SUPER ADMIN CONTENT MANAGEMENT API PATHS */
  SUP_ADMIN_FAQ: {
    SUP_ADMIN_FAQ_ENDPOINT: "superAdmin/faqs",
    SUP_ADMIN_FAQ_KEY: ["faqs"],
  },

  /** SUPER ADMIN ANNOUNCEMENT API PATHS */
  SUP_ADMIN_ANNOUNCEMENT: {
    SUP_ADMIN_ANNOUNCEMENT_ENDPOINT: "superAdmin/announcements",
    SUP_ADMIN_ANNOUNCEMENT_KEY: ["announcements"],
  },

  /** SUPER ADMIN HERO SLIDES BANNER API PATHS */
  SUP_ADMIN_HERO_SLIDES_BANNER: {
    SUP_ADMIN_HERO_SLIDES_BANNER_ENDPOINT: "superAdmin/slides-banner",
    SUP_ADMIN_HERO_SLIDES_BANNER_KEY: ["slides-banner"],
  },

  /** SUPER ADMIN VENDOR MANAGEMENT API PATHS */
  SUP_ADMIN_VENDOR: {
    SUP_ADMIN_VENDOR_ENDPOINT: "superAdmin/vendors",
    SUP_ADMIN_VENDOR_KEY: ["vendor-management"],
  },

  /** SUPER ADMIN PLAN HISTORY ANALYTICS API PATHS */
  SUP_ADMIN_PLAN_HISTORY: {
    SUP_ADMIN_PLAN_HISTORY_ENDPOINT: "superAdmin/plan-histories",
    SUP_ADMIN_PLAN_HISTORY_KEY: ["plan-history"],
  },

  /** SUPER ADMIN WEEKLY BILLING ANALYTICS API PATHS */
  SUP_ADMIN_WEEKLY_BILLING: {
    SUP_ADMIN_BILLING_ENDPOINT: "superAdmin/revenue-analytics/weekly",
    SUP_ADMIN_BILLING_KEY: ["revenue-analytics-weekly"],
  },

  /** SUPER ADMIN MONTHLY REVENUE ANALYTICS API PATHS */
  SUP_ADMIN_MONTHLY_BILLING: {
    SUP_ADMIN_BILLING_ENDPOINT: "superAdmin/revenue-analytics/monthly",
    SUP_ADMIN_BILLING_KEY: ["revenue-analytics-monthly"],
  },

  /** SUPER ADMIN SYSTEM SETTINGS API PATHS */
  SUP_ADMIN_SYSTEM_SETTINGS: {
    SUP_ADMIN_SYSTEM_SETTINGS_PROFILE_ENDPOINT:
      "superAdmin/system-settings/profile",
    SUP_ADMIN_SYSTEM_SETTINGS_PROFILE_KEY: ["system-settings-profile"],

    SUP_ADMIN_SYSTEM_SETTINGS_PASSWORD_ENDPOINT:
      "superAdmin/system-settings/password",
    SUP_ADMIN_SYSTEM_SETTINGS_PASSWORD_KEY: ["system-settings-password"],

    SUP_ADMIN_SYSTEM_SETTINGS_PREFERENCES_ENDPOINT:
      "superAdmin/system-settings/preference",
    SUP_ADMIN_SYSTEM_SETTINGS_PREFERENCES_KEY: ["system-settings-preferences"],
  },

  /*** -----> SUPER ADMIN PLAN & FEATURE RELATED API PATHS -----> */
  SUP_ADMIN_PLANS: {
    SUP_ADMIN_PLANS_ENDPOINT: "superAdmin/plans",
    SUP_ADMIN_PLANS_KEY: ["plans"],
  },
  SUP_ADMIN_FEATURE: {
    SUP_ADMIN_FEATURE_ENDPOINT: "superAdmin/features",
    SUP_ADMIN_FEATURE_KEY: ["features"],
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
  CLIENT_USER: {
    CLIENT_USER_ENDPOINT: "client/plan-subscription",
    CLIENT_USER_KEY: ["plan-subscription"],

    CLIENT_USER_PLAN_ENDPOINT: "client/plan-subscription",
    CLIENT_USER_PLAN_KEY: ["plan-subscription", "user-plan"],

    CLIENT_PLANS_ENDPOINT: "client/plan-subscription",
    CLIENT_PLANS_KEY: ["plan-subscription", "upgrade-downgrade"],
  },
  CLIENT_PAN_HISTORY: {
    CLIENT_PLAN_HISTORY_ENDPOINT: "client/plan-history",
    CLIENT_HISTORY_KEY: "plan-history",
  },

  /** CLIENT SUPER ADMIN PORTFOLIO VIEW + DOWNLOAD(PDF) API PATHS */
  CLIENT_SUP_ADM_PORTFOLIO: {
    CLIENT_SUP_ADM_PORTFOLIO_ENDPOINT: "client/portfolio",
    CLIENT_SUP_ADM_PORTFOLIO_KEY: ["portfolio"],
  },

  /** CLIENT SUPER ADMIN PROJECT VIEW API PATHS */
  CLIENT_SUP_ADM_PROJECT: {
    CLIENT_SUP_ADM_PROJECT_ENDPOINT: "client/project",
    CLIENT_SUP_ADM_PROJECT_KEY: ["project"],
  },

  /** CLIENT HERO SLIDES BANNER API PATHS */
  CLIENT_HERO_SLIDES_BANNER: {
    CLIENT_HERO_SLIDES_BANNER_ENDPOINT: "client/client-slides-banner",
    CLIENT_HERO_SLIDES_BANNER_KEY: ["client-slides-banner"],
  },

  /** CLIENT FEATURED PROMOTION BANNER API PATHS */
  CLIENT_FEATURED_PROMOTION_BANNER: {
    CLIENT_FEATURED_PROMOTION_BANNER_ENDPOINT:
      "client/client-featured-promotion-banner",
    CLIENT_FEATURED_PROMOTION_BANNER_KEY: ["client-featured-promotion-banner"],
  },

  /** CLIENT FAQ SECTION API PATHS */
  CLIENT_FAQ: {
    CLIENT_FAQ_ENDPOINT: "client/faqs",
    CLIENT_FAQ_KEY: ["faqs"],
  },

  /** CLIENT SYSTEM SETTINGS API PATHS */
  CLIENT_SYSTEM_SETTINGS: {
    CLIENT_SYSTEM_SETTINGS_PREFERENCES_ENDPOINT:
      "client/client-system-settings/preference",
    CLIENT_SYSTEM_SETTINGS_PREFERENCES_KEY: ["system-settings-preferences"],
  },

  /** CLIENT ANNOUNCEMENT API PATHS */
  CLIENT_ANNOUNCEMENT: {
    CLIENT_ANNOUNCEMENT_ENDPOINT: "client/client-announcements",
    CLIENT_ANNOUNCEMENT_KEY: ["client-announcements"],
  },

  // Extend this for other features.....
};

export default API_PATHS;
