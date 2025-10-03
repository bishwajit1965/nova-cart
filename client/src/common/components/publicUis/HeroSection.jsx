import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  containerVariants,
  itemVariants,
} from "../../../client/service/animations";
import {
  getActiveCoupons,
  getHeroSlides,
} from "../../../client/service/publicApi";
import { useEffect, useState } from "react";

import Button from "../ui/Button";
import Carousel from "react-slick"; // Lightweight carousel library
import { Link } from "react-router-dom";
import { LucideIcon } from "../../lib/LucideIcons";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [slides, setSlides] = useState([]);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const heroSlides = await getHeroSlides(); // Returns array of { title, subtitle, image, ctaLink }
      const activeCoupons = await getActiveCoupons(); // Returns array of { code, type, value, expiry }
      setSlides(heroSlides);
      setCoupons(activeCoupons);
    }
    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: true,
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8, // total animation time
        ease: "easeInOut", // ease in and out
      }}
      className="lg:py-16 py-6 bg-gradient-to-r from-blue-500 to-blue-200 rounded-md shadow"
    >
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-400 to-blue-200 lg:p-12 p-4 rounded-lg">
        <Carousel {...settings}>
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="relative flex flex-col-reverse lg:flex-row items-center lg:gap-10 gap-6"
            >
              <motion.div
                className="grid lg:grid-cols-12 grid-cols-1 lg:gap-10 gap-4 items-center justify-between"
                variants={itemVariants}
              >
                {/* Test Messages -> Left */}
                <div className="lg:col-span-6 col-span-12 bg-gradient-to-r from-blue-500 to-blue-200 lg:p-12 p-6 rounded-lg shadow-xl">
                  {/* Text */}
                  <div className="flex-1 text-center lg:text-left text-base-content">
                    <h2 className="lg:text-3xl text-xl md:text-4xl font-extrabold mb-2">
                      {slide.title}
                    </h2>
                    <p className="text-base-content mb-4">{slide.subtitle}</p>

                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                      <Link to="/client-cart-management">
                        <Button
                          variant="indigo"
                          icon={LucideIcon.ShoppingCart}
                          className="btn lg:btn-lg btn-sm w-44 border-none"
                        >
                          Start Shopping
                        </Button>
                      </Link>
                      <Link to="/product-categories">
                        <Button
                          variant="primary"
                          icon={LucideIcon.ListCheck}
                          className="btn lg:btn-lg btn-sm w-44 border-none"
                        >
                          Explore Categories
                        </Button>
                      </Link>
                    </div>

                    {coupons.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
                        {coupons.slice(0, 3).map((c) => (
                          <span
                            key={c.code}
                            className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-md font-semibold text-sm shadow"
                          >
                            {c.type === "percentage"
                              ? `${c.value}% OFF`
                              : `$${c.value}`}{" "}
                            – Use code: {c.code}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Image -> Right */}
                <div className="lg:col-span-6 col-span-12 rounded-lg shadow-xl">
                  <img
                    src={slide?.image}
                    alt={slide.title}
                    className="w-ful object-contain rounded-lg mx-auto"
                  />
                </div>
              </motion.div>
            </div>
          ))}
        </Carousel>
      </div>
    </motion.section>
  );
};

export default HeroSection;
