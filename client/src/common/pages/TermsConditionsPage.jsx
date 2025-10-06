import DynamicPageTitle from "../utils/pageTitle/DynamicPageTitle";
import { Link } from "react-router-dom";
import { LucideIcon } from "../lib/LucideIcons";
import PageMeta from "../components/ui/PageMeta";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";

const TermsConditionsPage = () => {
  const pageTitle = usePageTitle();

  return (
    <div className="max-w-7xl mx-auto">
      <PageMeta
        title="FAQ Us || Nova-Cart"
        description="You can know answers of Frequently asked questions"
      />
      <DynamicPageTitle pageTitle={pageTitle} />
      <div className="lg:max-w-3xl mx-auto lg:p-6 p-2">
        <h1 className="lg:text-3xl text-xl font-bold mb-6">
          Read These Terms & Conditions Carefully
        </h1>

        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="font-semibold text-lg">1. Use of Site</h2>
            <p>
              You must be at least 18 years old or use the site under adult
              supervision.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg">2. Products & Pricing</h2>
            <p>
              We work hard to ensure accurate descriptions and pricing.
              Occasionally, mistakes happen — we’ll correct them promptly.
            </p>

            <h2 className="font-semibold text-lg">
              5. Limitation of Liability
            </h2>
            <p>
              While we strive for perfection, we’re not liable for indirect
              damages arising from using our services or products.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg">3. Orders & Payment</h2>
            <p>
              Placing an order constitutes an offer to purchase. Orders may be
              canceled if payment is declined or stock is unavailable.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg">4. Returns & Refunds</h2>
            <p>All returns are subject to our Shipping & Returns policy.</p>
          </section>

          <section>
            <h2 className="font-semibold text-lg">
              5. Limitation of Liability
            </h2>
            <p>
              We are not liable for indirect damages arising from the use of our
              services or products.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg">6. Governing Law</h2>
            <p>
              These terms are governed by the laws of your local jurisdiction.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
