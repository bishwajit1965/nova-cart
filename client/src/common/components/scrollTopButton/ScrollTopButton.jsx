import { ArrowBigUp, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { FaArrowAltCircleUp } from "react-icons/fa";

const ScrollTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  // This function will be called when the button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", //Smooth scroll effect
    });
  };

  // Checks if the user has scrolled down
  const checkScrollPosition = () => {
    if (window.scrollY > 800) {
      setShowButton(true); // Show the button if scrolled more thn 1080px
    } else {
      setShowButton(false); // Hide the button if scrolled less than 1080px
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollPosition);
    // Clean up the event listener
    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  return (
    <div>
      {showButton && (
        <button
          className="btn btn-circle lg:bg-base-200 bg-base-300 shadow-md border fixed lg:bottom-60 bottom-20 right-34 border-gray-400 lg:opacity-50 opacity-100 hover:bg-base-300"
          onClick={scrollToTop}
          // style={{
          //   position: "fixed",
          //   bottom: "265px",
          //   right: "140px",
          //   backgroundColor: "#007BFF",
          //   color: "white",
          //   border: "none",
          //   cursor: "pointer",
          //   zIndex: 50,
          //   // opacity: 0.2,
          // }}
        >
          <ArrowUp />
        </button>
      )}
    </div>
  );
};

export default ScrollTopButton;
