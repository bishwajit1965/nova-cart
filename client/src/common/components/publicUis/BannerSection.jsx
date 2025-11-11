import { useEffect, useState } from "react";

import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import { Layers } from "lucide-react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import { useApiQuery } from "../../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../utils/hooks/useFetchedDataStatusHandler";

const BannerSection = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [banners, setBanners] = useState([]);

  const {
    data: bannerData,
    isLoading: isLoadingBannerData,
    isError: isErrorBannerData,
    error: errorBannerData,
  } = useApiQuery({
    url: `${API_PATHS.CLIENT_FEATURED_PROMOTION_BANNER.CLIENT_FEATURED_PROMOTION_BANNER_ENDPOINT}`,
    queryKey:
      API_PATHS.CLIENT_FEATURED_PROMOTION_BANNER
        .CLIENT_FEATURED_PROMOTION_BANNER_KEY,
  });

  // console.log("Banners data", bannerData);
  // console.log("Banners", banners);

  useEffect(() => {
    if (bannerData) {
      // Filter only "banner" type slides
      setBanners(
        bannerData?.filter(
          (slide) => slide?.type === "banner" && slide?.isActive === true
        )
      );
    }
  }, [bannerData]);

  /** --------> Use Fetched Data Status Handler --------> */
  const slidesDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingBannerData,
    isError: isErrorBannerData,
    error: errorBannerData,
    label: "Slides Banner",
  });

  /** <-------- Use Fetched Data Status Handler <-------- */
  if (slidesDataStatus.status !== "success") return slidesDataStatus.content;

  if (bannerData.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto bg-base-200 lg:p-16 p-8 rounded-md shadow-md">
      <h2 className="lg:text-2xl text-xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <Layers /> Featured Promotions
      </h2>
      <Marquee pauseOnHover={true} speed={30} gradient={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  justify-between gap-5">
          {banners?.map((banner, idx) => (
            <motion.div
              key={banner._id || idx}
              className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <a
                href={banner.ctaLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.img
                  src={`${apiURL}/uploads/${banner.image}`}
                  alt={banner.title}
                  className="w-full h-60 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white p-4">
                  <h3 className="text-lg font-semibold">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-sm mt-1">{banner.subtitle}</p>
                  )}
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </Marquee>
    </section>
  );
};

export default BannerSection;
