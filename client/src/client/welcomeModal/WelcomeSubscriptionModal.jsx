import { AnimatePresence, motion } from "framer-motion";
import { Rocket, X } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "../../common/components/ui/Button";
import { Input } from "../../common/components/ui/Input";
import SocialMediaLinks from "../../common/utils/socialMediaLinks/SocialMediaLinks";
import toast from "react-hot-toast";

const WelcomeSubscriptionModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const subscribedEmail = localStorage.getItem("subscribedEmail");
    const dismissed = localStorage.getItem("newsletterDismissed");

    if (!subscribedEmail && !dismissed) {
      // Show after small delay for better UX
      const timer = setTimeout(() => setShowModal(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);
  const handleClose = () => {
    localStorage.setItem("newsletterDismissed", "true");
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }
    // Save in localStorage (you can also POST to backend here)
    localStorage.setItem("subscribedEmail", email);
    toast.success("🎉 Thanks for subscribing! Enjoy your 5% discount!");
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-base-100 rounded-2xl shadow-xl max-w-md w-full p-6 relative text-center text-base-content/70"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold mb-2 text-base-content/70">
                Subscribe & Save 💌
              </h2>
              <p className="text-gray-600000 mb-4">
                Subscribe to our newsletter and get{" "}
                <span className="font-semibold text-green-600">5% off</span> on
                your next purchase!
              </p>

              <div className="justify-center">
                <form action="" onSubmit={handleSubmit} className="flex gap-2 ">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="border border-base-content/15 rounded-lg px-3 py-2 w-2/3 focus:outline-none focus:ring focus:ring-green-400 shadow-sm"
                  />
                  <Button variant="indigo" className=" ">
                    <Rocket /> Subscribe
                  </Button>
                </form>
              </div>
              <div className="mt-3">
                <SocialMediaLinks />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WelcomeSubscriptionModal;
