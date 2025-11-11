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
          (slide) => slide?.type === "hero" && slide?.isActive === true
        )
      );
      // Filter only "banner" type slides
      setBannerSlidesData(
        bannerData?.filter(
          (slide) => slide?.type === "banner" && slide?.isActive === true
        )
      );
    }
  }, [bannerData]);

  console.log("BANNER DATA", bannerData);
  console.log("HERO SLIDES DATA", heroSlidesData);
  console.log("BANNER SLIDES DATA", bannerSlidesData);

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
      className="lg:p-8 p-4 bg-gradient-to-r from-blue-500 to-blue-200 rounded-md shadow-2xl"
    >
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-400 to-blue-200 lg:p-6 p-4 rounded-lg shadow-2xl">
        <Carousel {...settings}>
          {heroSlidesData?.map((slide, idx) => (
            <div
              key={idx}
              className="relative flex flex-col-reverse lg:flex-row items-center lg:gap-10 gap-4"
            >
              <motion.div
                className="grid lg:grid-cols-12 grid-cols-1 lg:gap-10 gap-4 items-center justify-between"
                variants={itemVariants}
              >
                {/* Test Messages & slider image -> Left */}
                <div className="lg:col-span-6 col-span-12 bg-gradient-to-r from-blue-500 to-blue-200 lg:p-6 p-4 rounded-lg relative group">
                  {/* Image */}
                  <div className="rounded-lg min-h-40 w-full shadow-lg">
                    <img
                      src={`${apiURL}/uploads/${slide.image}`}
                      alt={slide.title}
                      className="w-full min-h-40 object-cover rounded-lg mx-auto"
                    />
                  </div>

                  {/* Text overlay */}
                  <div className="flex-1 text-center lg:text-left text-base-content absolute inset-0 flex flex-col justify-center items-center lg:items-start rounded-lg mx-auto justify-self-center lg:space-y-4 space-y-2 opacity-0 group hover:opacity-100">
                    <div className="min-h-48 lg:bg-black/90 lg:p-6 p-4 rounded-md">
                      <div className="flex mx-auto lg:p-6 p-4 rounded-md text-gray-300">
                        <div className="">
                          <h2 className="lg:text-2xl text-lg md:text-4xl font-extrabold text-center w-72">
                            {slide.title}
                          </h2>
                          <p className="text-center text-sm w-64">
                            {slide.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="lg:flex grid flex-col sm:flex-row justify-center lg:justify-center lg:gap-4 gap-2 px-2">
                        <Link to={`${slide.ctaLink}`}>
                          <Button
                            variant="primary"
                            icon={LucideIcon[slide.secondaryLink]}
                            className="btn lg:btn-md btn-sm w-36 border-none"
                          >
                            {`${slide.ctaLabel}`}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text message & Banner slides -> Right */}
                <div className="lg:col-span-6 col-span-12 bg-gradient-to-r from-blue-200 to-blue-500 lg:p-6 p-4 rounded-lg relative group">
                  {bannerSlidesData[idx] && (
                    <div className="">
                      <div className="rounded-lg min-h-40 w-full shadow-lg">
                        <img
                          src={`${apiURL}/uploads/${bannerSlidesData[idx].image}`}
                          alt={bannerSlidesData[idx].title}
                          className="w-full min-h-40 object-cover rounded-lg"
                        />
                      </div>

                      {/* Text overlay */}
                      <div className="absolute flex-1 text-center lg:text-left text-base-content inset-0 flex flex-col justify-center items-center lg:items-start rounded-lg mx-auto justify-self-center lg:space-y-4 space-y-2">
                        <div className="min-h-48 group hover:opacity-100 bg-black/90 opacity-0 rounded-lg lg:p-6 p-4">
                          <div className="flex mx-auto lg:p-6 p-4 rounded-md text-gray-300">
                            <div className="">
                              <h2 className="lg:text-2xl text-lg md:text-4xl font-extrabold text-center w-72">
                                {bannerSlidesData[idx].title}
                              </h2>
                              <p className=" text-center text-sm w-64">
                                {bannerSlidesData[idx].subtitle}
                              </p>
                            </div>
                          </div>
                          <div className="lg:flex grid flex-col sm:flex-row justify-center lg:justify-center lg:gap-4 gap-2 px-2">
                            <Link to={`${bannerSlidesData[idx].ctaLink}`}>
                              <Button
                                variant="primary"
                                icon={
                                  LucideIcon[
                                    bannerSlidesData[idx].secondaryLink
                                  ]
                                }
                                className="btn lg:btn-md btn-sm w-36 border-none"
                              >
                                {`${bannerSlidesData[idx].ctaLabel}`}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
