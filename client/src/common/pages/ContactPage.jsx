import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../components/ui/Button";
import DynamicPageTitle from "../utils/pageTitle/DynamicPageTitle";
import { Input } from "../components/ui/Input";
import { LucideIcon } from "../lib/LucideIcons";
import PageMeta from "../components/ui/PageMeta";
import Textarea from "../components/ui/Textarea";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import { useState } from "react";
import useValidator from "../hooks/useValidator";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const pageTitle = usePageTitle();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
    avatar: "",
  });

  /*** ------> Email validation ------> */
  const validationRules = {
    name: {
      required: { message: "Name is required" },
    },
    email: {
      required: { message: "Email is required" },
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email address",
      },
    },

    subject: {
      required: { message: "Subject is required" },
    },
    message: {
      required: { message: "Message is required" },
    },
    phone: {
      required: { message: "Phone is required" },
    },
    avatar: {
      required: { message: "Image url is required" },
      pattern: {
        value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i,
        message: "Enter a valid image URL",
      },
    },
  };

  /*** ------> Validator integration ------> */
  const { errors, validate } = useValidator(validationRules, {
    name: form.name,
    email: form.email,
    subject: form.subject,
    message: form.message,
    phone: form.phone,
    avatar: form.avatar,
  });

  /*** ------> Permission Mutation ------> */
  const contactMutation = useApiMutation({
    method: "create",
    path: API_PATHS.CLIENT_CONTACT.CLIENT_CONTACT_ENDPOINT,
    key: API_PATHS.CLIENT_CONTACT.CLIENT_CONTACT_KEY,
    onSuccess: () => {
      setLoading(false);
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        phone: "",
        avatar: "",
      });
    },
    onError: (error) => {
      toast.error("Error saving permission");
      console.error(error);
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;
    setLoading(true);
    console.log("Loading", loading.toString());
    const payload = { data: { ...form } };
    contactMutation.mutate(payload);
  };

  return (
    <section className="text-base-content">
      <PageMeta
        title="Contact Us || Nova-Cart"
        description="You can contact us for any need 24/7"
      />
      <DynamicPageTitle pageTitle={pageTitle} />
      <div className="max-w-7xl mx-auto lg:space-y-16 space-y-6">
        <div className="bg-base-200 shadow rounded-xl lg:space-y-8 space-y-4 lg:p-12 p-2">
          {/* Hero */}
          <div className="text-center">
            <h1 className="lg:text-3xl text-xl font-extrabold text-primary mb-2">
              Get in Touch
            </h1>
            <p className="text-lg text-base-content/70">
              We’d love to hear from you. Reach out with questions, feedback, or
              support requests.
            </p>
          </div>
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-base-100 shadow rounded-xl lg:p-6 p-2 text-center hover:shadow-2xl transition">
              <LucideIcon.MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold">Address</h4>
              <p className="text-sm text-base-content/70">
                123 Nova Street, Dhaka, BD
              </p>
            </div>
            <div className="bg-base-100 shadow rounded-xl lg:p-6 p-2 text-center hover:shadow-2xl transition">
              <LucideIcon.Phone className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold">Phone</h4>
              <p className="text-sm text-base-content/70">+880 1234 567 890</p>
            </div>
            <div className="bg-base-100 shadow rounded-xl lg:p-6 p-2 text-center hover:shadow-2xl transition">
              <LucideIcon.Mail className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold">Email</h4>
              <p className="text-sm text-base-content/70">
                support@nova-cart.com
              </p>
            </div>
            <div className="bg-base-100 shadow rounded-xl lg:p-6 p-2 text-center hover:shadow-2xl transition">
              <LucideIcon.Clock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold">Working Hours</h4>
              <p className="text-sm text-base-content/70">
                Sat–Thu: 9am – 6pm <br /> Fri: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-base-200 shadow rounded-xl lg:space-y-8 space-y-4 lg:p-12 p-2">
          <div className="lg:max-w-3xl mx-auto">
            <h2 className="lg:text-3xl text-xl font-extrabold lg:mb-8 mb-4 text-center text-primary">
              Contact Form
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid lg:grid-cols-12 grid-cols-1 lg:gap-6 gap-3 bg-base-100 lg:p-8 p-2 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="lg:col-span-6 colspan-12 space-y-4">
                <Input
                  name="name"
                  placeholder="Your Name..."
                  value={form.name}
                  onChange={handleChange}
                  className=""
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                )}
                <Input
                  name="email"
                  placeholder="Your Email..."
                  value={form.email}
                  onChange={handleChange}
                  className=""
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div className="lg:col-span-6 colspan-12 space-y-4">
                <Input
                  name="subject"
                  placeholder="Subject..."
                  value={form.subject}
                  onChange={handleChange}
                  className=""
                />
                {errors.subject && (
                  <p className="text-red-600 text-xs mt-1">{errors.subject}</p>
                )}
                <Input
                  name="phone"
                  placeholder="Phone..."
                  value={form.phone}
                  onChange={handleChange}
                  className=""
                />
                {errors.phone && (
                  <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div className="lg:col-span-12 colspan-12">
                <Input
                  name="avatar"
                  placeholder="Avatar url..."
                  value={form.avatar}
                  onChange={handleChange}
                  className=" "
                />
                {errors.avatar && (
                  <p className="text-red-600 text-xs mt-1">{errors.avatar}</p>
                )}
              </div>
              <div className="lg:col-span-12 colspan-12">
                <Textarea
                  name="message"
                  placeholder="Your Message..."
                  value={form.message}
                  onChange={handleChange}
                  rows="5"
                  className=" md:col-span-2 p-3 border rounded-lg focus:outline-none focus:ring border-base-content/15 focus:ring-primary/40"
                />
                {errors.message && (
                  <p className="text-red-600 text-xs mt-1">{errors.message}</p>
                )}
              </div>
              <div className="lg:col-span-12 flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  className="btn bg-primary flex items-center space-x-2"
                >
                  {loading ? (
                    <LucideIcon.Loader2 className="animate-spin" />
                  ) : (
                    <LucideIcon.Send />
                  )}
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="rounded-xl overflow-hidden shadow">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.843593556825!2d90.4005!3d23.7509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf54d8b8a8f9%3A0x9ef9b7706f90e5f!2sDhaka!5e0!3m2!1sen!2sbd!4v1633000000000!5m2!1sen!2sbd"
            className="w-full h-96 border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        {/* Quick Links */}
        <div className="text-center lg:space-y-8 space-y-4 lg:py-8 py-4">
          <p className="text-base-content/70">
            Looking for help?{" "}
            <a
              href="/faq"
              className="text-primary font-semibold hover:underline"
            >
              Check our FAQ
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
