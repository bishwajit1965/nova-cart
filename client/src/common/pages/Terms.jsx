import { Link } from "react-router-dom";
import { LucideIcon } from "../lib/LucideIcons";

const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-sm leading-relaxed">
      <div className="flex items-center space-x-3 mb-6">
        <LucideIcon.FileText size={28} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-base-content">
          Terms & Conditions
        </h1>
      </div>

      <p className="text-base-content/80 mb-6">
        Welcome to{" "}
        <span className="font-semibold text-blue-600">Nova Dashboard LTS</span>.
        By accessing or using our platform, you agree to the following terms and
        conditions. Please read them carefully.
      </p>
      <p>Last updated: July 14, 2025</p>

      <p className="mt-4">
        By accessing and using our platform ("Nova Dashboard"), you agree to be
        bound by the following terms and conditions...
      </p>

      <div className="space-y-6 text-sm leading-6 text-base-content/80">
        <section>
          <h2 className="text-lg font-semibold text-base-content">
            1. Acceptance of Terms
          </h2>
          <p>
            By registering or using this platform, you acknowledge that you have
            read, understood, and agreed to these Terms of Service and our
            Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-base-content">
            2. Account Responsibility
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities under your account.
            Please notify us immediately of any unauthorized use.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-base-content">
            3. Acceptable Use
          </h2>
          <p>
            You agree not to use the platform for any unlawful or abusive
            purposes including but not limited to spamming, hacking, or
            impersonation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-base-content">
            4. Intellectual Property
          </h2>
          <p>
            All content, branding, and intellectual property on this site remain
            the property of Nova Dashboard LTS. Unauthorized use is strictly
            prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-base-content">
            5. Changes to Terms
          </h2>
          <p>
            We reserve the right to update these terms at any time. Continued
            use of the service after changes implies your acceptance of the new
            terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-base-content">
            6. Termination
          </h2>
          <p>
            We may suspend or terminate your account if we suspect you have
            violated these terms or engaged in conduct harmful to the platform
            or its users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-base-content">
            7. Contact
          </h2>
          <p>
            If you have any questions about these Terms & Conditions, feel free
            to{" "}
            <Link to="/contact" className="text-blue-600 underline">
              contact us
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
