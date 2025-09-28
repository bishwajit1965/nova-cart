import {
  containerVariants,
  itemVariants,
} from "../../../client/service/animations";

import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import { Loader } from "lucide-react";
import { LucideIcon } from "../../lib/LucideIcons";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useApiMutation } from "../../../superAdmin/services/hooks/useApiMutation";
import { useState } from "react";
import useValidator from "../../hooks/useValidator";

const NewsLetterSection = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  /*** ------> Newsletter Mutation ------> */
  const newsLetterMutation = useApiMutation({
    method: "create",
    path: API_PATHS.CLIENT_NEWSLETTER.NEWSLETTER_ENDPOINT,
    key: API_PATHS.CLIENT_NEWSLETTER.NEWSLETTER_KEY,
    onSuccess: (res) => {
      toast.success(res.message || res.data?.message || "Subscribed!");
      setLoading(false);
      setEmail("");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(message);
      console.error(error);
      setLoading(false);
    },
  });

  /*** ------> Email validation ------> */
  const validationRules = {
    email: {
      required: { message: "Email is required" },
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email address",
      },
    },
  };

  /*** ------> Validator integration ------> */
  const { errors, validate } = useValidator(validationRules, {
    email,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const payload = { data: { email } };
    newsLetterMutation.mutate(payload);
  };

  return (
    <motion.section
      className="py-16 bg-primary text-white rounded-md shadow"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      variants={containerVariants}
    >
      <motion.div
        className="max-w-3xl mx-auto px-6 text-center"
        variants={itemVariants}
      >
        <motion.h2 className="text-3xl font-bold mb-4" variants={itemVariants}>
          📬 Subscribe to Our Newsletter
        </motion.h2>
        <motion.p className="mb-6 text-lg" variants={itemVariants}>
          Be the first to hear about new products, exclusive deals, and more.
        </motion.p>
        <motion.form
          onSubmit={handleSubmit}
          className="lg:flex flex-col lg:max-w-4xl w-full sm:flex-row items-center justify-center lg:gap-4 gap-2 mx-auto lg:space-y-0 space-y-4"
          variants={itemVariants}
        >
          <motion.div className="" variants={itemVariants}>
            <Input
              type="text"
              name="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-full text-base-content/70 bg-base-100 placeholder:text-base-content/50 focus:outline-base-100"
              icon={LucideIcon.MailPlus}
            />
          </motion.div>

          <motion.div className="" variants={itemVariants}>
            <Button
              type="submit"
              disabled={loading}
              variant="roundedFull"
              className="cursor-pointer rounded-full font-bold flex items-center bg-base-100 text-base-content/70 px-4 py-2 hover:bg-base-200 hover:text-base-content/90 transition focus:outline-base-100"
            >
              {loading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <LucideIcon.SaveIcon size={20} />
              )}

              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </motion.div>
        </motion.form>
        {errors.email && (
          <motion.div
            className="lg:max-w-sm mx-auto bg-base-100 text-base-content/70 rounded-full p-2 mt-4 text-xs"
            variants={itemVariants}
          >
            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
};

export default NewsLetterSection;
