import { useEffect, useState } from "react";

import { FaArrowUp } from "react-icons/fa";

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
    <div className="fixed lg:bottom-12 bottom-10 right-0 lg:mr-[120px] mr-1 z-50">
      {showButton && (
        <button
          className=""
          onClick={scrollToTop}
          style={{
            // position: "fixed",
            bottom: "40px",
            // right: "120px",
            backgroundColor: "#fff",
            opacity: "0.5",
            color: "#333",
            border: "2px solid #555 ",
            cursor: "pointer",
            padding: "10px",
            // zIndex: 50,
            borderRadius: "50%",
          }}
        >
          <FaArrowUp className="text-gray-800" />
        </button>
      )}
    </div>
  );
};

export default ScrollTopButton;
