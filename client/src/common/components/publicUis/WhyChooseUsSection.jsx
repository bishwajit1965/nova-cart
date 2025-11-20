import { motion } from "framer-motion";

const features = [
  {
    icon: "🚚",
    title: "Fast & Free Shipping",
    description: "Get your orders delivered quickly, without extra charges.",
  },
  {
    icon: "💳",
    title: "Secure Payment",
    description: "We use trusted gateways to protect your transactions.",
  },
  {
    icon: "📞",
    title: "24/7 Support",
    description: "Our team is available round-the-clock to assist you.",
  },
  {
    icon: "🔄",
    title: "Easy Returns",
    description: "Hassle-free 7-day return policy on most products.",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="lg:py-16 py-6 bg-base-200 text-base-content rounded-md shadow border border-base-content/15">
      <div className="max-w-6xl mx-auto lg:px-6 px-2 text-center text-base-content/70">
        <h2 className="lg:text-3xl text-xl font-extrabold lg:mb-8 mb-4">
          🎯 Why Choose Nova-Cart?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((item, index) => (
            <motion.div
              key={index}
              className="bg-base-100 lg:p-6 p-2 rounded-2xl shadow hover:shadow-md transition"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8, // ⏳ slower fade/slide
                ease: "easeOut", // 🪄 smooth easing
                delay: index * 0.15, // 🔀 staggered reveal
              }}
              viewport={{ once: false, amount: 0.2 }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-base-content">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
