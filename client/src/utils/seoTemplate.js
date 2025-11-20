export const SEO_TEMPLATES = {
  home: {
    title: "Nova-Cart | Modern E-Commerce Platform",
    description:
      "Shop easily and quickly with Nova-Cart — the ultimate online shopping experience.",
    keywords: "e-commerce, online shopping, nova-cart, products, deals",
    ogImage: "/assets/seo/home-og.png",
  },
  shop: {
    title: "Shop All Products | Nova-Cart",
    description: "Browse all products on Nova-Cart and find the best deals.",
    keywords: "shop, nova-cart, online shopping, products",
    ogImage: "/assets/seo/shop-og.jpg",
  },
  wishlist: {
    title: "Your Wishlist | Nova-Cart",
    description:
      "Keep track of your favorite products in your Nova-Cart Wishlist.",
    keywords: "wishlist, favorite products, nova-cart",
    ogImage: "/assets/seo/wishlist-og.jpg",
  },
  orders: {
    title: "Your Orders | Nova-Cart",
    description: "View your past and current orders on Nova-Cart.",
    keywords: "orders, purchase history, nova-cart",
    ogImage: "/assets/seo/orders-og.jpg",
  },
  categories: (category) => ({
    title: `${category.name} Products | Nova-Cart`,
    description: `Explore the best ${category.name} products on Nova-Cart.`,
    keywords: category.tags?.join(", ") || category.name,
    ogImage: category.image || "/assets/seo/categories-og.jpg",
  }),
  contact: {
    title: "Contact Us | Nova-Cart",
    description: "Get in touch with the Nova-Cart support team.",
    keywords: "contact, support, nova-cart",
    ogImage: "/assets/seo/contact-og.jpg",
  },
  about: {
    title: "About Nova-Cart",
    description: "Learn about Nova-Cart, our mission, and our team.",
    keywords: "about, company, nova-cart",
    ogImage: "/assets/seo/about-og.jpg",
  },
  portfolio: {
    title: "Nova-Cart Projects & Portfolio",
    description: "Explore Nova-Cart's completed projects and showcases.",
    keywords: "portfolio, projects, nova-cart",
    ogImage: "/assets/seo/portfolio-og.jpg",
  },
  devPortfolio: {
    title: "Developer Portfolio | Nova-Cart",
    description: "Showcase your development skills and projects on Nova-Cart.",
    keywords: "developer portfolio, projects, skills",
    ogImage: "/assets/seo/devportfolio-og.jpg",
  },
  plan: {
    title: "Your Plan | Nova-Cart",
    description: "Upgrade or manage your subscription plan on Nova-Cart.",
    keywords: "plans, subscription, upgrade, nova-cart",
    ogImage: "/assets/seo/plan-og.jpg",
  },
  checkout: {
    title: "Checkout | Nova-Cart",
    description: "Securely place your order on Nova-Cart.",
    keywords: "checkout, order, nova-cart",
    ogImage: "/assets/seo/checkout-og.jpg",
  },
  product: (product) => ({
    title: `${product.name} | Nova-Cart`,
    description: product.description,
    keywords: product.tags?.join(", "),
    ogImage: product.image,
    url: window.location.href,
  }),
  blog: (post) => ({
    title: `${post.title} | Nova-Cart Blog`,
    description: post.summary,
    keywords: post.tags.join(", "),
    ogImage: post.image,
    url: window.location.href,
  }),
};
