import { quickLinks, supportLinks } from "../../../utils/footerLinks";

import { Mail } from "lucide-react";
import SocialMediaLinks from "../../utils/socialMediaLinks/SocialMediaLinks";
import toast from "react-hot-toast";

const PublicFooter = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();

    if (!email) {
      return toast.error("Please enter a valid email.");
    }

    toast.success("Subscribed successfully!");
    e.target.reset();
  };

  return (
    <footer className="bg-base-200 text-base-content/70 pt-12 pb-6 border-t border-base-content/20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand info */}
        <div>
          <h3 className="text-2xl font-bold mb-2">Nova-Cart</h3>
          <p className="text-sm">
            Your one-stop shop for quality products at the best prices. Trusted
            by thousands of happy customers.
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
          <form onSubmit={handleSubscribe} className="flex items-center gap-2">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              className="input input-bordered w-full"
            />
            <button
              type="submit"
              aria-label="Subscribe to Newsletter"
              className="btn btn-primary"
            >
              <Mail className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-base-content/20 pt-6 px-4 text-sm flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <p>© {new Date().getFullYear()} Nova-Cart. All rights reserved.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <SocialMediaLinks />
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
