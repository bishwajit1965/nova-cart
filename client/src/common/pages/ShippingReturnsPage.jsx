import DynamicPageTitle from "../utils/pageTitle/DynamicPageTitle";
import PageMeta from "../components/ui/PageMeta";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";

const ShippingReturnsPage = () => {
  const pageTitle = usePageTitle();

  return (
    <div className="max-w-7xl mx-auto">
      <PageMeta
        title="Shipping returns || Nova-Cart"
        description="You can know answers of Frequently asked questions"
      />
      <DynamicPageTitle pageTitle={pageTitle} />
      <div className="lg:max-w-3xl mx-auto lg:p-6 p-2">
        <h1 className="lg:text-3xl text-xl font-bold mb-6">
          Shipping & Returns Policies
        </h1>

        <section className="mb-8">
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Standard shipping: 3–7 business days, hassle-free.</li>
            <li>Express shipping: 1–3 business days for urgent orders.</li>
            <li>Free shipping on orders over $100!</li>
          </ul>
          <p className="mt-4 text-gray-600">
            Need to return an item? Contact our support team with your order
            details — we’ll guide you every step of the way.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Returns</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Products can be returned within 14 days of delivery.</li>
            <li>Items must be unused and in original packaging.</li>
            <li>
              Refunds will be issued within 7 business days after inspection.
            </li>
          </ul>
          <p className="mt-4 text-gray-600">
            For return requests, please contact our support team with your order
            details.
          </p>
        </section>
      </div>
    </div>
  );
};
export default ShippingReturnsPage;
