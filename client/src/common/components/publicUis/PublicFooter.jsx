import { Mail } from "lucide-react";
import SocialMediaLinks from "../../utils/socialMediaLinks/SocialMediaLinks";

const PublicFooter = () => {
  return (
    <footer className="bg-base-200 text-base-content/70 pt-12 pb-6 border-t border-base-content/20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand info */}
        <div className="text-base-content/70">
          <h3 className="text-2xl font-bold mb-2">Nova-Cart</h3>
          <p className="text-sm">
            Your one-stop shop for quality products at the best prices. Trusted
            by thousands of happy customers.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-base-content/70">
          <h4 className="font-semibold text-lg mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-base-content/70">
            <li>
              <a href="#">Shop</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="text-base-content/70">
          <h4 className="font-semibold text-lg mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#">FAQs</a>
            </li>
            <li>
              <a href="#">Shipping & Returns</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="text-base-content/70">
          <h4 className="font-semibold text-lg mb-3">Newsletter</h4>
          <p className="text-sm mb-3">
            Subscribe to get the latest deals and updates.
          </p>
          <form className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="input input-bordered w-full"
            />
            <button className="btn btn-primary">
              <Mail className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-base-content/20 pt-6 px-4 text-sm text-base-content/70 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <p>© {new Date().getFullYear()} nova-Cart. All rights reserved.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <SocialMediaLinks />
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
