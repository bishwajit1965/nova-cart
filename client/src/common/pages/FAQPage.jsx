import DynamicPageTitle from "../utils/pageTitle/DynamicPageTitle";
import PageMeta from "../components/ui/PageMeta";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";

// src/pages/FaqPage.jsx
const FaqPage = () => {
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
          Read these Questions and Answers
        </h1>

        <div className="space-y-6">
          <h2 className="font-semibold">1. How do I place an order?</h2>
          <p className="text-gray-600">
            Simply browse our collection, add your favorite items to the cart,
            and checkout. You’ll get an email confirmation as soon as your order
            is placed.
          </p>

          <h2 className="font-semibold">4. Can I return a product?</h2>
          <p className="text-gray-600">
            Of course! Returns are accepted within 14 days, as long as items are
            unused and in their original packaging.
          </p>

          <div>
            <h2 className="font-semibold">
              2. What payment methods do you accept?
            </h2>
            <p className="text-gray-600">
              We accept major credit/debit cards, PayPal, and secure payment
              gateways.
            </p>
          </div>

          <div>
            <h2 className="font-semibold">3. How long does delivery take?</h2>
            <p className="text-gray-600">
              Delivery times vary depending on your location. Standard shipping
              usually takes 3–7 business days.
            </p>
          </div>

          <div>
            <h2 className="font-semibold">4. Can I return a product?</h2>
            <p className="text-gray-600">
              Yes! Items can be returned within 14 days of delivery as long as
              they are unused, unworn, and in original packaging.
            </p>
          </div>

          <div>
            <h2 className="font-semibold">5. Do I need an account to shop?</h2>
            <p className="text-gray-600">
              You can checkout as a guest, but creating an account allows you to
              track orders and save your details for faster checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FaqPage;
