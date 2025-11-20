import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  containerVariants,
  itemVariants,
} from "../../../client/service/animations";

import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import { motion } from "framer-motion";
import { useApiQuery } from "../../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../utils/hooks/useFetchedDataStatusHandler";

// const testimonials = [
//   {
//     name: "Sarah Ahmed",
//     feedback:
//       "Nova-Cart made online shopping so easy! I received my order within 2 days and the quality is top-notch.",
//     avatar: "https://i.pravatar.cc/100?img=1",
//   },
//   {
//     name: "Imran Hossain",
//     feedback:
//       "I love the wide selection of products and their customer service is outstanding. Highly recommend!",
//     avatar: "https://i.pravatar.cc/100?img=2",
//   },
//   {
//     name: "Priya Roy",
//     feedback:
//       "Super smooth checkout and fast delivery. I'll definitely shop again. Nova-Cart is my go-to platform now!",
//     avatar: "https://i.pravatar.cc/100?img=3",
//   },
//   {
//     name: "Tanvir Alam",
//     feedback:
//       "Affordable prices, great deals, and the checkout process was so smooth. Nova-Cart nailed it!",
//     avatar: "https://i.pravatar.cc/100?img=4",
//   },
// ];

const TestimonialsSection = () => {
  const {
    data: testimonials = [],
    isLoading: isLoadingTestimonials,
    isError: isErrorTestimonials,
    error: errorTestimonials,
  } = useApiQuery({
    url: API_PATHS.CLIENT_TESTIMONIAL.CLIENT_TESTIMONIAL_ENDPOINT,
    queryKey: API_PATHS.CLIENT_TESTIMONIAL.CLIENT_KEY,
    // select: (res) => res.data, //NOT NEEDED HERE AS HOOK DOES IT
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /** --------> Use Fetched Data Status Handler --------> */
  const testimonialsStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingTestimonials,
    isError: isErrorTestimonials,
    error: errorTestimonials,
    label: "permissions",
  });
  return (
    <motion.section
      className="lg:py-16 py-6 bg-base-200 text-base-content rounded-md shadow border border-base-content/15"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
    >
      <motion.div
        className="max-w-5xl mx-auto lg:px-4 px-2 text-center relative z-0 lg:my-8 my-4"
        variants={itemVariants}
      >
        <motion.h2
          className="lg:text-3xl text-xl font-extrabold lg:mb-8 mb-4 text-base-content/70"
          variants={itemVariants}
        >
          💬 What Our Customers Say
        </motion.h2>
        {testimonialsStatus.status !== "success" ? (
          testimonialsStatus.content
        ) : (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000 }}
            loop={true}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="bg-base-100 lg:p-8 p-2 rounded-2xl shadow-md max-w-xl mx-auto text-center lg:space-y-2 space-y-1"
                  variants={itemVariants}
                >
                  <motion.img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mx-auto"
                    variants={itemVariants}
                  />
                  <motion.p
                    className="italic text-base-content"
                    variants={itemVariants}
                  >
                    "{testimonial.feedback}"
                  </motion.p>
                  <motion.h4
                    className="font-semibold text-lg"
                    variants={itemVariants}
                  >
                    {testimonial.name}
                  </motion.h4>
                  <motion.div
                    className="flex justify-center lg:mb-0 mb-6"
                    variants={itemVariants}
                  >
                    {Array(5)
                      .fill(0)
                      .map((_, idx) => (
                        <span
                          key={idx}
                          className={
                            idx < testimonial.rating
                              ? "text-yellow-400 text-2xl"
                              : "text-gray-300 text-2xl"
                          }
                        >
                          ★
                        </span>
                      ))}
                  </motion.div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </motion.div>
    </motion.section>
  );
};

export default TestimonialsSection;
