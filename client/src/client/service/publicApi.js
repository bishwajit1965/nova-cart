// services/publicApi.js

// import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
// import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
// import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const getHeroSlides = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/slides`);
    if (!response.ok) throw new Error("Failed to fetch slides");

    const data = await response.json();

    // Separate slides by type and active status
    const heroSlides = data.filter(
      (slide) => slide.type === "hero" && slide.isActive === true
    );
    const bannerSlides = data.filter(
      (slide) => slide.type === "banner" && slide.isActive === true
    );

    return { heroSlides, bannerSlides };
  } catch (error) {
    console.error("Error fetching slides:", error);
    return { heroSlides: [], bannerSlides: [] };
  }
  // const {
  //   data: bannerData,
  //   isLoading: isLoadingBannerData,
  //   isError: isErrorBannerData,
  //   error: errorBannerData,
  // } = useApiQuery({
  //   url: `${API_PATHS.SUP_ADMIN_HERO_SLIDES_BANNER.SUP_ADMIN_HERO_SLIDES_BANNER_ENDPOINT}`,
  //   queryKey:
  //     API_PATHS.SUP_ADMIN_HERO_SLIDES_BANNER.SUP_ADMIN_HERO_SLIDES_BANNER_KEY,
  // });

  // /** --------> Use Fetched Data Status Handler --------> */
  // const slidesDataStatus = useFetchedDataStatusHandler({
  //   isLoading: isLoadingBannerData,
  //   isError: isErrorBannerData,
  //   error: errorBannerData,
  //   label: "Slides Banner",
  // });

  /** <-------- Use Fetched Data Status Handler <-------- */
  // if (slidesDataStatus.status !== "success") return slidesDataStatus.content;

  // // Separate slides by type and active status
  // const heroSlides = bannerData.filter(
  //   (slide) => slide?.type === "hero" && slide?.isActive === true
  // );
  // const bannerSlides = bannerData.filter(
  //   (slide) => slide?.type === "banner" && slide?.isActive === true
  // );

  // return { heroSlides, bannerSlides };
};

export default { getHeroSlides };
