import { quickLinks, supportLinks } from "../../../utils/footerLinks";

import { Loader, Mail } from "lucide-react";
import SocialMediaLinks from "../../utils/socialMediaLinks/SocialMediaLinks";
import toast from "react-hot-toast";
import useSystemSettings from "../../hooks/useSystemSettings";
import useValidator from "../../hooks/useValidator";
import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import { useApiMutation } from "../../../superAdmin/services/hooks/useApiMutation";
import { useState } from "react";
import { Input } from "../ui/Input";
import { LucideIcon } from "../../lib/LucideIcons";
import Button from "../ui/Button";

const PublicFooter = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const { systemSettings } = useSystemSettings();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  /*** ------> Newsletter Mutation ------> */
  const newsLetterMutation = useApiMutation({
    method: "create",
    path: API_PATHS.CLIENT_NEWSLETTER.NEWSLETTER_ENDPOINT,
    key: API_PATHS.CLIENT_NEWSLETTER.NEWSLETTER_KEY,
    onSuccess: (res) => {
      // toast.success(res.message || res.data?.message || "Subscribed!");
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

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const payload = { data: { email } };
    newsLetterMutation.mutate(payload);
  };

  return (
    <footer className="bg-base-200 text-base-content/70 pt-12 pb-6 border-t border-base-content/20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 gap-6">
        {/* Brand info */}
        <div className="">
          <div className="mb-4">
            <img
              src={`${apiURL}/uploads/${systemSettings?.logo}`}
              alt={systemSettings?.appName}
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="">
            <h3 className="text-2xl font-bold mb-2">
              {systemSettings?.appName}
            </h3>
          </div>
          <p className="text-sm">
            {systemSettings?.tagline || "Your Trusted E-commerce Platform"}
            Trusted by thousands of happy customers.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {quickLinks?.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:underline transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            {supportLinks?.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:underline transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Newsletter</h4>
          <p className="text-sm mb-3">
            Subscribe to get the latest deals and updates.
          </p>
          <form onSubmit={handleSubscribe} className="">
            <div className="flex items-center gap-2">
              <div className="">
                <Input
                  type="text"
                  name="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${
                    errors.email
                      ? "input-secondary bg-yellow-200 clear-both"
                      : ""
                  }rounded-md text-base-content/70 bg-base-100 placeholder:text-base-content/50 focus:outline-base-100 shadow-sm`}
                  icon={LucideIcon.MailPlus}
                />
              </div>
              <div className={errors.email ? "animate-spin bg-red-500" : ""}>
                <Button
                  type="submit"
                  disabled={newsLetterMutation.isPending}
                  variant={
                    errors.email ? "danger rounded-full text-white" : "indigo"
                  }
                  aria-label="Subscribe to Newsletter"
                  className={errors.email ? "animate-pulse rounded-full" : ""}
                >
                  {newsLetterMutation.isPending ? (
                    <Loader className="animate-spin text-white" />
                  ) : !newsLetterMutation.isPending ? (
                    <Mail />
                  ) : (
                    ""
                  )}
                </Button>
              </div>
            </div>
            {newsLetterMutation.isPending ? (
              <p className="text-success">Subscribing to newsletter....</p>
            ) : (
              ""
            )}
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-base-content/20 pt-6 px-4 text-sm flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <p>
          © {new Date().getFullYear()}{" "}
          {systemSettings?.footerText || "Nova Cart"}.
        </p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <SocialMediaLinks />
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
