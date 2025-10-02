import {
  containerVariants,
  itemVariants,
} from "../../client/service/animations.js";

import CallToAction from "../../client/cart/components/CallToAction.jsx";
import DynamicPageTitle from "../utils/pageTitle/DynamicPageTitle";
import FounderNote from "../../client/cart/components/FounderNote.jsx";
import FunFacts from "../../client/cart/components/FunFacts.jsx";
import PageMeta from "../components/ui/PageMeta.jsx";
import { motion } from "framer-motion";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";

const skills = [
  { name: "JavaScript (ES6+)", level: 90 },
  { name: "React & Tailwind CSS", level: 70 },
  { name: "Node.js & Express", level: 70 },
  { name: "MongoDB & Mongoose", level: 65 },
  { name: "REST API Design", level: 80 },
  { name: "Authentication & Security", level: 90 },
  { name: "Git & GitHub", level: 90 },
  { name: "Problem Solving", level: 85 },
  { name: "Clean Code Practices", level: 90 },
  { name: "Frontend Development", level: 90 },
  { name: "Backend Development", level: 80 },
  { name: "Database Management", level: 70 },
  { name: "UI/UX Design", level: 60 },
];

const AboutUs = () => {
  const pageTitle = usePageTitle();

  return (
    <>
      <PageMeta
        title="About Us || Nova-Cart"
        description="You can know about us from here in details."
      />
      <DynamicPageTitle pageTitle={pageTitle} />

      <div className="min-h-screen lg:py-16 py-4 lg:px-6 px-2 bg-base-200 rounded-2xl ">
        <div className="max-w-6xl mx-auto lg:space-y-16 space-y-4">
          {/* Hero Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center space-y-4 bg-base-100 shadow lg:p-12 p-4 rounded-2xl hover:shadow-xl"
          >
            <h1 className="lg:text-4xl text-xl font-extrabold text-base-content/70">
              About <span className="text-indigo-600">Nova-Cart</span>
            </h1>
            <p className="text-lg text-base-content/50 max-w-2xl mx-auto">
              Nova-Cart is more than just an e-commerce project — it’s a dream
              of building a fast, elegant, and developer-friendly platform from
              scratch.
            </p>
          </motion.div>

          {/* Founder note */}
          <div className="text-center space-y-4 bg-base-100 shadow lg:p-12 p-4 rounded-2xl hover:shadow-xl">
            <FounderNote />
          </div>

          {/* Fun facts */}
          <div className="text-center space-y-4 bg-base-100 shadow lg:p-12 p-4 rounded-2xl hover:shadow-xl">
            <h2 className="lg:text-2xl text-xl font-bold text-base-content/70 mb-6 text-center">
              🎈 Fun Facts
            </h2>

            <FunFacts />
          </div>

          {/* Mission Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-12 items-center shadow lg:p-12 p-4 bg-base-100 rounded-2xl hover:shadow-xl"
          >
            <div className="">
              <img
                src="8qf6_4bh9_220517.jpg"
                alt="Our Mission"
                className="rounded-2xl h-80 w-full"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-base-content/70">
                🚀 Our Mission
              </h2>
              <p className="text-base-content/50">
                To create a shopping experience that’s lightning fast,
                intuitive, and future-proof. Nova-Cart is built with modern
                tools like React, Tailwind, Node.js, and MongoDB — so it’s
                designed to scale.
              </p>
            </div>
          </motion.div>

          {/* Experience Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="bg-base-100 shadow rounded-2xl lg:p-12 p-4 hover:shadow-xl"
          >
            <h2 className="lg:text-2xl text-xl font-bold text-base-content/70 mb-6 text-center">
              💼 Experience
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-base-content/50">
                  Full-Stack Developer (Independent)
                </h3>
                <p className="text-base-content/50 text-sm">2023 – Present</p>
                <p className="text-base-content/50">
                  Building nova-cart, a full-featured e-commerce platform with
                  authentication, cart/wishlist, admin dashboards, and more.
                  Hands-on with backend APIs, frontend UI, and database
                  modeling.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-base-content/50">
                  Learning & Practice Projects
                </h3>
                <p className="text-base-content/50 text-sm">2022 – 2023</p>
                <p className="text-base-content/50">
                  Completed multiple projects in Node.js, React, and MongoDB
                  while strengthening fundamentals of JavaScript, REST APIs, and
                  authentication.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="bg-base-100 lg:space-y-5 space-y-4 rounded-2xl lg:p-12 p-4 hover:shadow-xl w-full"
          >
            <h2 className="lg:text-2xl text-xl font-bold mb-6 text-center text-base-content/70">
              🛠 Skills
            </h2>
            {skills.map((skill, idx) => (
              <div className="w-full border border-base-content/15 rounded-2xl shadow">
                <motion.div
                  key={idx}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="lg:p-4 p-2"
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-base-content/70">
                      {skill.name}
                    </span>{" "}
                    {/* <- use skill.name */}
                    <span className="text-sm font-semibold text-base-content/70">
                      {skill.level}%
                    </span>{" "}
                    {/* <- skill.level */}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className="h-4 bg-indigo-500 rounded-full" />
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>

          {/* Founder Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="bg-base-100 shadow rounded-2xl lg:p-12 p-4 text-center space-y-4 hover:shadow-xl"
          >
            <img
              src="bishwajit-1.jpg"
              alt="Founder"
              className="w-28 h-28 rounded-full mx-auto border-4 border-base-300 shadow-md"
            />
            <h3 className="lg:text-2xl text-xl font-semibold text-base-content/70">
              👨‍💻 The Developer
            </h3>
            <p className="text-base-content/50 max-w-2xl mx-auto">
              Nova-Cart is being crafted line by line with dedication and love
              for clean code. This project represents persistence, growth, and
              the vision of becoming a professional developer who can stand tall
              in the industry.
            </p>
          </motion.div>

          {/* Call to action */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center space-y-4 bg-base-100 shadow lg:p-12 p-4 rounded-2xl hover:shadow-xl"
          >
            <h2 className="lg:text-2xl text-xl font-bold text-base-content/70 mb-6 text-center">
              🎈 Interested in working with us?
            </h2>

            <CallToAction />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
