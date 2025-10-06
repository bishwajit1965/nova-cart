import DynamicPageTitle from "../utils/pageTitle/DynamicPageTitle";
import PageMeta from "../components/ui/PageMeta";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";

const PrivacyPolicyPage = () => {
  const pageTitle = usePageTitle();

  return (
    <div className="max-w-7xl mx-auto">
      <PageMeta
        title="FAQ Us || Nova-Cart"
        description="You can know answers of Frequently asked questions"
      />
      <DynamicPageTitle pageTitle={pageTitle} />

      <div className="lg:max-w-3xl mx-auto lg:p-6 p-2">
        <h1 className="lg:text-3xl text-xl font-bold mb-6">Privacy Policy</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Personal info (name, email, shipping address)</li>
            <li>Payment details (processed securely by third parties)</li>
            <li>Browsing activity (cookies and analytics)</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>To process and deliver your orders</li>
            <li>To improve our website and services</li>
            <li>To send promotional offers (if you opt-in)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Request access to, correction, or deletion of your data</li>
            <li>Opt-out of marketing emails anytime</li>
          </ul>
          <p className="mt-4 text-gray-600">
            We never sell your information. Third-party providers only receive
            the minimum necessary details.
          </p>
        </section>
      </div>
    </div>
  );
};
export default PrivacyPolicyPage;
