import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths.js";
import CallToAction from "../../client/cart/components/CallToAction.jsx";
import DynamicPageTitle from "../utils/pageTitle/DynamicPageTitle";
import FounderNote from "../../client/cart/components/FounderNote.jsx";
import FunFacts from "../../client/cart/components/FunFacts.jsx";
import PageMeta from "../components/ui/PageMeta.jsx";
import { containerVariants } from "../../client/service/animations.js";
import { motion } from "framer-motion";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery.js";
import useFetchedDataStatusHandler from "../utils/hooks/useFetchedDataStatusHandler.jsx";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import useSEO from "../hooks/useSeo.js";
import { SEO_TEMPLATES } from "../../utils/seoTemplate.js";
import { LucideIcon } from "../lib/LucideIcons.js";
import SetTitle from "../utils/setTitle/SetTitle.jsx";
import HeaderSetter from "../../superAdmin/utilHelper/HeaderSetter.jsx";
import Button from "../components/ui/Button.jsx";

const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
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
  // SEO
  useSEO(SEO_TEMPLATES.about);

  const pageTitle = usePageTitle();

  /*** ------> About Content data fetched ------> */
  const {
    data: aboutContents,
    isLoading: isLoadingAboutContent,
    isError: isErrorAboutContent,
    error: errorAboutContent,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_ABOUT_CONTENT.SUP_ADMIN_ABOUT_CONTENT_ENDPOINT}/about-content`,
    queryKey: API_PATHS.SUP_ADMIN_ABOUT_CONTENT.SUP_ADMIN_ABOUT_CONTENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** Filter About Contents by sectionKey dynamically ***/
  const sections = [
    "about Nova-Cart",
    "founder-data",
    "developer-data",
    "developer-experience",
    "our-mission",
  ];

  const filteredAboutSections = sections.reduce((acc, key) => {
    acc[key] = aboutContents?.filter((item) => item.sectionKey === key) || [];
    return acc;
  }, {});

  /*** Filter about contents section wise */
  const aboutNovaCart = filteredAboutSections["about Nova-Cart"];
  const aboutFounder = filteredAboutSections["founder-data"];
  const aboutDeveloper = filteredAboutSections["developer-data"];
  const developerExperience = filteredAboutSections["developer-experience"];
  const developerMission = filteredAboutSections["our-mission"];

  console.log("About contents", aboutContents);
  console.log("About Nova cart", aboutNovaCart);
  // console.log("About Nova founder", aboutFounder);

  /*** Use data fetch status Handler */
  const aboutContentDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingAboutContent,
    isError: isErrorAboutContent,
    error: errorAboutContent,
    label: "About Content",
  });
  if (aboutContentDataStatus.status !== "success")
    return aboutContentDataStatus.content;

  return (
    <div className="lg:max-w-7xl mx-auto ">
      <PageMeta
        title="About Us || Nova-Cart"
        description="You can know about us from here in details."
      />
      <DynamicPageTitle pageTitle={pageTitle} icon={<LucideIcon.BookOpen />} />

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
            {aboutNovaCart.map((item) => (
              <div className="">
                <SetTitle
                  title={item.title}
                  decoratedText="E-Commerce"
                  description={item.content}
                  icon={<LucideIcon.ShoppingCart />}
                />
              </div>
            ))}
          </motion.div>

          {/* Founder note */}
          <div className="text-center space-y-4 bg-base-100 shadow lg:p-12 p-4 rounded-2xl hover:shadow-xl">
            <FounderNote aboutFounder={aboutFounder} />
          </div>

          {/* Fun facts */}
          <div className="text-center space-y-4 bg-base-100 shadow lg:p-12 p-4 rounded-2xl hover:shadow-xl">
            <SetTitle
              title="Fun Facts"
              decoratedText="From Developer 🎈"
              icon={<LucideIcon.LaughIcon />}
            />
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
              {developerMission.map((mission) => (
                <div className="">
                  <SetTitle
                    title={mission.title}
                    decoratedText="→ Indomitable"
                    icon={<LucideIcon.Target />}
                  />
                  <p className="text-base-content/50">{mission.content}</p>
                </div>
              ))}
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
            {developerExperience?.map((experience) => (
              <div className="lg:space-y-4 space-y-2">
                <SetTitle
                  title="Experience"
                  decoratedText="That Matters"
                  icon={<LucideIcon.Briefcase />}
                />
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-base-content/50">
                      {experience.title}
                    </h3>
                    <p className="text-base-content/50 text-sm">
                      2023 – Present
                    </p>
                    <p className="text-base-content/50">{experience.content}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content/50">
                      Learning & Practice Projects
                    </h3>
                    <p className="text-base-content/50 text-sm">2022 – 2023</p>
                    <p className="text-base-content/50">
                      {experience.extraData}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="bg-base-100 lg:space-y-5 space-y-4 rounded-2xl lg:p-12 p-4 hover:shadow-xl w-full"
          >
            <SetTitle
              title="Skills"
              decoratedText="Achieved"
              icon={<LucideIcon.Wrench />}
            />

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
            {aboutDeveloper?.map((developer) => (
              <div className="lg:space-y-4 space-y-2">
                <img
                  src={`${apiURL}/uploads/${developer.image}`}
                  alt="Founder"
                  className="w-28 h-28 rounded-full mx-auto border-4 border-base-300 shadow-md"
                />
                <SetTitle
                  title={developer.title}
                  decoratedText="& Founder"
                  icon={<LucideIcon.UserCircle />}
                />

                <p className="text-base-content/50 max-w-2xl mx-auto">
                  {developer.content}
                </p>
                <div className="">
                  <Button
                    href="/contact-us"
                    variant="success"
                    size="lg"
                    label="Reach the Founder"
                    icon={LucideIcon.MessageCircle}
                  />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Call to action */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center space-y-4 bg-base-100 shadow lg:p-12 p-4 rounded-2xl hover:shadow-xl"
          >
            <SetTitle
              title="Interested in"
              decoratedText="working with us ?🎈"
              icon={<LucideIcon.Workflow />}
            />

            <CallToAction />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
