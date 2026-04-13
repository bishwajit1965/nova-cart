import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  containerVariants,
  itemVariants,
} from "../../../client/service/animations";
import { useEffect, useState } from "react";

import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import Button from "../ui/Button";
import Carousel from "react-slick"; // Lightweight carousel library
import { Link } from "react-router-dom";
import { LucideIcon } from "../../lib/LucideIcons";
import { motion } from "framer-motion";
import { useApiQuery } from "../../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../utils/hooks/useFetchedDataStatusHandler";
import { Sparkles } from "lucide-react";
import SectionTitle from "../../utils/sectionTitle/SectionTitle";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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

const HeroSection = () => {
  const [heroSlidesData, setHeroSlidesData] = useState([]);
  const [bannerSlidesData, setBannerSlidesData] = useState([]);

  const {
    data: bannerData,
    isLoading: isLoadingBannerData,
    isError: isErrorBannerData,
    error: errorBannerData,
  } = useApiQuery({
    url: `${API_PATHS.CLIENT_HERO_SLIDES_BANNER.CLIENT_HERO_SLIDES_BANNER_ENDPOINT}`,
    queryKey: API_PATHS.CLIENT_HERO_SLIDES_BANNER.CLIENT_HERO_SLIDES_BANNER_KEY,
  });

  useEffect(() => {
    if (bannerData) {
      // Filter only "hero" type slides
      setHeroSlidesData(
        bannerData?.filter(
          (slide) => slide?.type === "hero" && slide?.isActive === true,
        ),
      );
      // Filter only "banner" type slides
      setBannerSlidesData(
        bannerData?.filter(
          (slide) => slide?.type === "banner" && slide?.isActive === true,
        ),
      );
    }
  }, [bannerData]);

  // /** --------> Use Fetched Data Status Handler --------> */
  const slidesDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingBannerData,
    isError: isErrorBannerData,
    error: errorBannerData,
    label: "Slides Banner",
  });

  /** <-------- Use Fetched Data Status Handler <-------- */
  if (slidesDataStatus.status !== "success") return slidesDataStatus.content;

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
      className="lg:py-16 py-8 bg-base-200 rounded-xl shadow-md overflow-x-hidden"
    >
      <div className="lg:max-w-7xl mx-auto lg:px-14 px-2">
        {/* Section Header */}
        <motion.div variants={itemVariants} className="lg:mb-8 mb-4">
          <SectionTitle
            title="Discover"
            decoratedText="What’s Trending"
            subTitle="Explore our latest collections, exclusive deals, and carefully curated selections to elevate your shopping experience."
            description="Handpicked collections, limited offers, and premium selections made just for you."
            icon={<Sparkles size={28} />}
          />
        </motion.div>

        {/* ================= HERO SLIDER ================= */}
        <Carousel {...settings}>
          {heroSlidesData?.map((slide, idx) => (
            <div key={idx}>
              <div className="relative h-[300px] lg:h-[500px] rounded-xl overflow-hidden shadow-md">
                {/* Image */}
                <img
                  src={`${apiURL}/uploads/${slide.image}`}
                  alt={slide.title}
                  className="w-full h-full object-cover rounded-xl"
                />

                {/* Overlay */}
                <div className="absolute overflow-hidden inset-0 bg-black/50 flex items-center">
                  <div className="max-w-2xl px-8 text-white">
                    <motion.h2
                      variants={itemVariants}
                      className="text-xl lg:text-5xl font-extrabold mb-4"
                    >
                      {slide.title}
                    </motion.h2>

                    <motion.p
                      variants={itemVariants}
                      className="text-base lg:text-lg opacity-90 mb-6"
                    >
                      {slide.subtitle}
                    </motion.p>

                    {slide.ctaLink && (
                      <Link to={slide.ctaLink} className="m-0">
                        <Button
                          variant="primary"
                          icon={LucideIcon[slide.secondaryLink]}
                          className="px-6 py-3"
                        >
                          {slide.ctaLabel}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        {/* ================= BANNER SECTION ================= */}
        {bannerSlidesData?.length > 0 && (
          <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mt-12">
            {bannerSlidesData.map((banner) => (
              <div
                key={banner._id}
                className="relative h-48 rounded-xl overflow-hidden shadow-md group"
              >
                <img
                  src={`${apiURL}/uploads/${banner.image}`}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-4">
                  <h3 className="text-lg font-semibold mb-2">{banner.title}</h3>
                  <p className="text-sm opacity-90 mb-3">{banner.subtitle}</p>

                  {banner.ctaLink && (
                    <Link to={banner.ctaLink}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={LucideIcon[banner.secondaryLink]}
                      >
                        {banner.ctaLabel}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default HeroSection;
