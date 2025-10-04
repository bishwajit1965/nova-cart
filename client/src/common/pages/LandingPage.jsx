import BestSellersSection from "../components/publicUis/BestSellersSection";
import Button from "../components/ui/Button";
import FAQSection from "../components/publicUis/FAQSection";
import FeaturedCategoriesSection from "../components/publicUis/FeaturedCategoriesSection";
import HeroSection from "../components/publicUis/HeroSection";
import { MessageCircle } from "lucide-react";
import NewsLetterSection from "../components/publicUis/NewsLetterSection";
import PageMeta from "../components/ui/PageMeta";
import ProductsListSection from "../../client/products/ProductsListSection";
import PromoSection from "../components/publicUis/PromoSection";
import RandomProductsSection from "../../client/products/RandomProductsSection";
import ScrollProgressBar from "../components/scrollProgressBar/ScrollProgressBar";
import ScrollTopButton from "../components/scrollTopButton/ScrollTopButton";
import ShopByCategoriesSection from "../components/publicUis/ShopByCategoriesSection";
import TestimonialFormSection from "../components/publicUis/TestimonialFormSection";
import TestimonialsSection from "../components/publicUis/TestimonialsSection";
import WhyChooseUsSection from "../components/publicUis/WhyChooseUsSection";
import { containerVariants } from "../../client/service/animations";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const LandingPage = () => {
  const { user, isAuthenticated } = useAuth();
  console.log("USER DATA", user);
  console.log("USER Authenticated", isAuthenticated.toString());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const toggleForm = () => setIsFormOpen(!isFormOpen);
  return (
    <div className="lg:max-w-7xl mx-auto lg:space-y-16 space-y-6">
      {/* -----> Page Meta -----> */}
      <PageMeta
        title="Home Page || Nova-Cart"
        description="Have a look on all in details."
      />
      {/*Hero section*/}
      <HeroSection />

      {/* 🔥 Random Products Section (New) */}
      <RandomProductsSection />

      {/* Products List Section */}
      <ProductsListSection />

      {/*Why Choose Us Section*/}
      <WhyChooseUsSection />

      {/*Featured Categories Section*/}
      <FeaturedCategoriesSection />

      {/* Categories section */}
      <ShopByCategoriesSection />

      {/*Best Selling Products Section*/}
      <BestSellersSection />

      {/*Seasonal & Promotional Section*/}
      <PromoSection />

      {/*Customer Testimonial Section*/}
      <TestimonialsSection />

      {/* FAQ section */}
      <FAQSection />

      {/*News letter Subscription Section*/}
      <NewsLetterSection />

      {/* Testimonial Form Section */}
      {isFormOpen && <TestimonialFormSection />}

      <motion.div
        className="max-w-xl mx-auto text-center mb-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={containerVariants}
      >
        <Button
          variant=" rounded-full"
          onClick={toggleForm}
          className="bg-primary text-white btn-lg rounded-full px-4 py-2 shadow-lg hover:bg-primary/90"
        >
          <MessageCircle />{" "}
          {!isFormOpen ? "Share Your Experience" : "Close Form"}
        </Button>
      </motion.div>

      {/* Scroll to top button */}
      <ScrollTopButton />

      {/* Scroll progress bar */}
      <ScrollProgressBar />
    </div>
  );
};

export default LandingPage;
