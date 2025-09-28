// services/publicApi.js

export const getHeroSlides = async () => {
  // In real project, fetch from backend API
  return [
    {
      title: "New Arrivals",
      subtitle: "Discover the latest products in Nova-Cart.",
      image: "../coffeeMaker_1.jpg",
      ctaLink: "/products/new",
    },
    {
      title: "Trending Now",
      subtitle: "Check out what’s hot this week.",
      image: "../electronics_phone-1.jpg",
      ctaLink: "/products/trending",
    },
    {
      title: "Special Coupons",
      subtitle: "Save on your favorite products!",
      image: "../beauty_1.jpg",
      ctaLink: "/promotions",
    },
  ];
};

export const getActiveCoupons = async () => {
  // Mock active coupons
  return [
    {
      code: "CPN-NEW5",
      type: "percentage",
      value: 5,
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      code: "CPN-SAVE10",
      type: "fixed",
      value: 10,
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      code: "CPN-FALL15",
      type: "percentage",
      value: 15,
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  ];
};
