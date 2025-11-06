import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";

/**
 * Premium portfolio view (Tailwind-only).
 * Replace your existing component with this one (keeps your data hooks).
 */

const SkeletonRect = ({ className = "h-4 w-full rounded" }) => (
  <div className={`bg-base-300 animate-pulse ${className}`} />
);

const Badge = ({ children }) => (
  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm transform transition-transform hover:-translate-y-0.5">
    {children}
  </span>
);

const SuperAdminPublicPortfolioViewPage = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [downloading, setDownloading] = useState(false);

  // portfolios
  const {
    data: portfolios,
    isLoading: isLoadingPortfolio,
    isError: isErrorPortfolio,
    error: errorPortfolio,
  } = useApiQuery({
    url: `${API_PATHS.CLIENT_SUP_ADM_PORTFOLIO.CLIENT_SUP_ADM_PORTFOLIO_ENDPOINT}/get-portfolios`,
    queryKey: API_PATHS.CLIENT_SUP_ADM_PORTFOLIO.CLIENT_SUP_ADM_PORTFOLIO_KEY,
  });

  // projects
  const {
    data: projects,
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
    error: errorProjects,
  } = useApiQuery({
    url: `${API_PATHS.CLIENT_SUP_ADM_PROJECT.CLIENT_SUP_ADM_PROJECT_ENDPOINT}/get-projects`,
    queryKey: API_PATHS.CLIENT_SUP_ADM_PROJECT.CLIENT_SUP_ADM_PROJECT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const portfolioDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingPortfolio,
    isError: isErrorPortfolio,
    error: errorPortfolio,
    label: "Portfolio",
  });
  const projectsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
    error: errorProjects,
    label: "Projects",
  });

  // Early returns for fetch errors/loading using your existing status handler
  // if (projectsDataStatus.status !== "success")
  //   return projectsDataStatus.content;
  // if (portfolioDataStatus.status !== "success")
  //   return portfolioDataStatus.content;

  // PDF open helper
  const handleDownloadPDF = (id) => {
    setDownloading(true);
    // open in new tab, backend handles stream
    window.open(`${apiURL}/api/client/portfolio/${id}/pdf`, "_blank");
    // we don't know when download ends, reset after a small delay so button UI isn't stuck
    setTimeout(() => setDownloading(false), 1200);
  };

  // If still loading, show full-page skeleton (premium layout)
  if (isLoadingPortfolio || isLoadingProjects) {
    return (
      <div className="min-h-screen bg-base-100 flex items-start justify-center py-16 px-4">
        <div className="w-full max-w-5xl space-y-8">
          {/* Hero skeleton */}
          <div className="bg-base-100 rounded-3xl p-8 shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-base-200 h-32 w-32 animate-pulse" />
              <SkeletonRect className="h-8 w-64" />
              <SkeletonRect className="h-4 w-48" />
              <SkeletonRect className="h-4 w-96" />
              <div className="mt-4 flex gap-3">
                <SkeletonRect className="h-10 w-40 rounded-full" />
                <SkeletonRect className="h-10 w-24 rounded-full" />
              </div>
            </div>
          </div>

          {/* Skills skeleton */}
          <div className="bg-base-100 rounded-2xl p-6 shadow-md">
            <SkeletonRect className="h-6 w-32 mb-4" />
            <div className="grid grid-cols-2 gap-3">
              <SkeletonRect className="h-10" />
              <SkeletonRect className="h-10" />
              <SkeletonRect className="h-10" />
              <SkeletonRect className="h-10" />
            </div>
          </div>

          {/* Experience skeleton */}
          <div className="bg-base-100 rounded-2xl p-6 shadow-md">
            <SkeletonRect className="h-6 w-40 mb-4" />
            <div className="space-y-3">
              <SkeletonRect className="h-20" />
              <SkeletonRect className="h-20" />
            </div>
          </div>

          {/* Projects skeleton */}
          <div className="bg-base-100 rounded-2xl p-6 shadow-md">
            <SkeletonRect className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SkeletonRect className="h-64 rounded-lg" />
              <SkeletonRect className="h-64 rounded-lg" />
              <SkeletonRect className="h-64 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show actual data
  return (
    <div className="min-h-screen bg-base-100 text-base-content-/70 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {portfolios?.map((pf) => (
          <section key={pf._id} className="lg:space-y-6 space-y-4">
            {/* HERO */}
            <div className="bg-base-100 rounded-3xl lg:p-10 p-2 shadow-lg transform transition-all hover:shadow-2xl">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <img
                    src={
                      pf.profileImage
                        ? `${apiURL}${pf.profileImage}`
                        : "/placeholder-avatar.png"
                    }
                    alt={pf.name || "Profile"}
                    className="w-36 h-36 rounded-full object-cover border-4 border-base-100 shadow-lg"
                  />
                  {/* small status dot */}
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 ring-2 ring-base-100" />
                </div>

                <h1 className="lg:text-4xl text-2xl font-extrabold tracking-tight">
                  {pf.name || "Your Name"}
                </h1>
                <p className="text-lg text-base-content/70">
                  {pf.title || "Full Stack Developer"}
                </p>

                <p className="max-w-3xl text-base-content/70 mt-4">
                  {pf.summary ||
                    "A thoughtful summary about this developer. Crisp. Precise. Engaging."}
                </p>

                <div className="lg:mt-6 nt-3 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleDownloadPDF(pf._id)}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transform transition cursor-pointer"
                    aria-label="Download PDF"
                  >
                    <FaFilePdf className="w-5 h-5" />
                    {downloading ? "Downloading..." : "Download PDF"}
                  </button>

                  {pf.contactUrl && (
                    <a
                      href={pf.contactUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline text-base-content/70"
                    >
                      Contact
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* SKILLS */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Skills</h3>
              <div className="flex flex-wrap gap-3">
                {pf.skills && pf.skills.length > 0 ? (
                  pf.skills.map((s, i) => <Badge key={i}>{s}</Badge>)
                ) : (
                  <p className="text-sm text-base-content/70">
                    No skills listed.
                  </p>
                )}
              </div>
            </div>

            {/* EXPERIENCE + PROJECTS SIDE-BY-SIDE (stack on mobile) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* EXPERIENCE (left) */}
              <div className="lg:col-span-1 bg-base-100 rounded-2xl p-6 shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Experience</h3>
                {pf.experience && pf.experience.length ? (
                  <div className="space-y-4">
                    {pf.experience.map((exp, i) => (
                      <article
                        key={i}
                        className="p-4 rounded-lg border border-base-content/10 hover:shadow-sm transition"
                      >
                        <h4 className="font-semibold">{exp.title}</h4>
                        <div className="text-sm text-base-content/70">
                          {exp.company} • {exp.duration}
                        </div>
                        {exp.description && (
                          <p className="mt-2 text-sm text-base-content/70">
                            {exp.description}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-base-content/70">
                    No experience listed.
                  </p>
                )}
              </div>

              {/* PROJECTS (right, wide) */}
              <div className="lg:col-span-2 bg-base-100 rounded-2xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold">Projects</h3>
                  <span className="text-sm text-base-content/70">
                    {projects && projects.length
                      ? `${projects.length} projects`
                      : "No projects"}
                  </span>
                </div>

                {projects && projects.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projects.map((p) => (
                      <div
                        key={p._id}
                        className="rounded-xl overflow-hidden border border-base-content/10 transform transition hover:scale-[1.01] hover:shadow-lg"
                      >
                        <div className="w-full h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
                          {p.projectImage ? (
                            <img
                              src={`${apiURL}${p.projectImage}`}
                              alt={p.title}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="text-base-content/70">No image</div>
                          )}
                        </div>

                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-bold text-lg">{p.title}</h4>
                              <div className="text-sm text-base-content/70">
                                {p.subTitle}
                              </div>
                            </div>
                            <div className="text-xs text-base-content/70">
                              {p.year}
                            </div>
                          </div>

                          <p className="mt-2 text-sm text-base-content/70 line-clamp-3">
                            {p.summary || p.description}
                          </p>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs text-base-content/70">
                              {p.techStack?.length
                                ? p.techStack.join(" • ")
                                : "—"}
                            </div>

                            <div className="flex items-center gap-3">
                              {p.link && (
                                <a
                                  href={p.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-indigo-600 hover:underline text-sm"
                                >
                                  Live
                                </a>
                              )}
                              <a
                                href={pf.socialLinks?.github || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm underline text-base-content/70"
                              >
                                GitHub
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-base-content/70">
                    No projects available yet.
                  </p>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="text-center text-sm text-base-content/70">
              Portfolio managed by site super-admin — public view only.
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminPublicPortfolioViewPage;

// import { useState } from "react";
// import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
// import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
// import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
// import { Loader, Save } from "lucide-react";
// import { FaFilePdf } from "react-icons/fa";

// const SuperAdminPublicPortfolioViewPage = () => {
//   const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
//   const [downloading, setDownloading] = useState(false);

//   /*** -----> Fetch Public Portfolios -----> */
//   const {
//     data: portfolios,
//     isLoading: isLoadingPortfolio,
//     isError: isErrorPortfolio,
//     error: errorPortfolio,
//   } = useApiQuery({
//     url: `${API_PATHS.CLIENT_SUP_ADM_PORTFOLIO.CLIENT_SUP_ADM_PORTFOLIO_ENDPOINT}/get-portfolios`,
//     queryKey: API_PATHS.CLIENT_SUP_ADM_PORTFOLIO.CLIENT_SUP_ADM_PORTFOLIO_KEY,
//   });

//   /*** ------> Projects public view Content data fetched ------> */
//   const {
//     data: projects,
//     isLoading: isLoadingProjects,
//     isError: isErrorProjects,
//     error: errorProjects,
//   } = useApiQuery({
//     url: `${API_PATHS.CLIENT_SUP_ADM_PROJECT.CLIENT_SUP_ADM_PROJECT_ENDPOINT}/get-projects`,
//     queryKey: API_PATHS.CLIENT_SUP_ADM_PROJECT.CLIENT_SUP_ADM_PROJECT_KEY,
//     options: {
//       staleTime: 0,
//       refetchOnWindowFocus: true,
//       refetchOnReconnect: true,
//     },
//   });
//   console.log("CLIENT PFOJECts", projects);

//   /*** ------> PDF Download Handler ------> */
//   const handleDownloadPDF = (id) => {
//     setDownloading(true);
//     window.open(`${apiURL}/api/client/portfolio/${id}/pdf`, "_blank");
//   };

//   /*** ------> Presentational Components ------> */
//   const Skills = ({ items = [] }) => {
//     if (!items.length) return null;
//     return (
//       <div className="mt-4 grid lg:grid-cols-12 grid-cols-1 gap-2">
//         {items.map((skill, i) => (
//           <span
//             key={i}
//             className="lg:col-span-6 col-span-12 p-4 text-sm font-medium rounded-xl border border-base-content/15 bg-base-100 shadow-sm"
//           >
//             {skill}
//           </span>
//         ))}
//       </div>
//     );
//   };

//   const Experience = ({ items = [] }) => {
//     if (!items.length) return null;
//     return (
//       <div className="mt-6 space-y-4">
//         {items.map((exp, i) => (
//           <div
//             key={i}
//             className="p-4 rounded-lg border-base-content/15 bg-base-100 shadow-sm"
//           >
//             <div className="flex items-start justify-between">
//               <div>
//                 <h4 className="text-lg font-semibold">{exp.title}</h4>
//                 <div className="text-sm text-gray-500">
//                   {exp.company} • {exp.duration}
//                 </div>
//               </div>
//             </div>
//             {exp.description && (
//               <p className="mt-2 text-sm text-base-content/70">
//                 {exp.description}
//               </p>
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const Projects = ({ items = [] }) => {
//     if (!items.length) return null;
//     return (
//       <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {items.map((p, i) => (
//           <div
//             key={i}
//             className="border rounded-lg overflow-hidden border-base-content/15 bg-base-100 shadow-sm"
//           >
//             {p.projectImage && (
//               <img
//                 src={`${apiURL}${p.projectImage}`}
//                 alt={p.name}
//                 className="w-full h-40 object-cover"
//               />
//             )}
//             <div className="p-4 text-base-content/70 space-y-2">
//               <h5 className="font-semibold">{p.title}</h5>
//               <h5 className="font-semibold">{p.subTitle}</h5>
//               <h5 className="font-semibold">{p.type}</h5>
//               <p className="mt-2 text-sm text-base-content/70">
//                 {p.description}
//               </p>
//               <p className="mt-2 text-sm text-base-content/70">{p.summary}</p>
//               {p.techStack?.length > 0 && (
//                 <div className="mt-3 text-xs text-gray-500">
//                   {p.techStack.join(" • ")}
//                 </div>
//               )}
//               <p>{p.year}</p>
//               <div className="mt-3 flex items-center gap-2">
//                 {p.link && (
//                   <a
//                     href={p.link}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="text-sm underline"
//                   >
//                     Live Demo
//                   </a>
//                 )}
//                 <a
//                   href={portfolios[0]?.socialLinks?.github}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-sm underline cursor-pointer"
//                 >
//                   GitHub
//                 </a>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   /*** ------>Portfolio Data Fetch Status Handler ------> */
//   const portfolioDataStatus = useFetchedDataStatusHandler({
//     isLoading: isLoadingPortfolio,
//     isError: isErrorPortfolio,
//     error: errorPortfolio,
//     label: "Portfolio",
//   });

//   /*** Projects data fetch status Handler */
//   const projectsDataStatus = useFetchedDataStatusHandler({
//     isLoading: isLoadingProjects,
//     isError: isErrorProjects,
//     error: errorProjects,
//     label: "Projects",
//   });

//   if (projectsDataStatus.status !== "success")
//     return projectsDataStatus.content;

//   if (portfolioDataStatus.status !== "success")
//     return portfolioDataStatus.content;

//   /*** ------> Page Rendering ------> */
//   return (
//     <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto space-y-8">
//         {isLoadingPortfolio && (
//           <div className="space-y-4 bg-base-100 relative max-h-96">
//             <div className="w-full h-6 bg-base-300 animate-pulse"></div>
//             <div className="w-[90%] h-6 bg-base-300 animate-pulse"></div>
//             <div className="w-[80%] h-6 bg-base-300 animate-pulse"></div>
//             <div className="w-[70%] h-6 bg-base-300 animate-pulse"></div>
//             <div className="w-1070%] h-20 bg-base-300 animate-pulse"></div>
//             <div className="absolute top-[50%] justify-self-center">
//               <Loader className="animate-spin" />
//             </div>
//           </div>
//         )}
//         {portfolios?.map((portfolio) => (
//           <div key={portfolio._id} className="space-y-6">
//             {/* Top Card */}
//             <div className="bg-base-200 p-6 rounded-2xl shadow-md text-center">
//               <img
//                 src={`${apiURL}${portfolio?.profileImage}`}
//                 alt="Profile"
//                 className="w-28 h-28 mx-auto rounded-full object-cover border-2 border-gray-100 shadow-sm"
//               />
//               <h1 className="text-2xl font-bold mt-4">
//                 {portfolio.name || "Your Name"}
//               </h1>
//               <p className="text-gray-600">
//                 {portfolio.title || "Full Stack Developer"}
//               </p>
//               <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
//                 {portfolio.summary || "Short intro goes here."}
//               </p>
//               <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
//                 <button
//                   onClick={() => handleDownloadPDF(portfolio._id)}
//                   disabled={downloading}
//                   className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
//                 >
//                   {downloading ? <Save size={25} /> : <FaFilePdf size={25} />}

//                   {downloading ? "Downloading..." : "Download PDF"}
//                 </button>
//                 {portfolio.contactUrl && (
//                   <a
//                     href={portfolio.contactUrl}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="text-sm underline"
//                   >
//                     Contact
//                   </a>
//                 )}
//               </div>
//             </div>

//             {/* Skills */}
//             <section>
//               <h3 className="text-base font-semibold">Skills</h3>
//               <Skills items={portfolio.skills || []} />
//             </section>

//             {/* Experience */}
//             <section>
//               <h3 className="text-base font-semibold mt-6">Experience</h3>
//               <Experience items={portfolio.experience || []} />
//             </section>

//             {/* Projects */}
//             <section>
//               <h3 className="text-base font-semibold mt-6">Projects</h3>
//               <Projects items={projects || []} />
//             </section>

//             {/* Footer Note */}
//             <div className="divider"></div>
//             <p className="text-xs text-base-content/70 text-center">
//               Portfolio is managed by the site super-admin. Public view only.
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SuperAdminPublicPortfolioViewPage;

// // import { useEffect, useState } from "react";
// // import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
// // import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
// // import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";

// // const SuperAdminPublicPortfolioViewPage = () => {
// //   const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [downloading, setDownloading] = useState(false);

// //   /*** ----->Public Portfolios fetching API Hook -----> */
// //   const {
// //     data: portfolios,
// //     isLoading: isLoadingPortfolio,
// //     isError: isErrorPortfolio,
// //     error: errorPortfolio,
// //   } = useApiQuery({
// //     url: `${API_PATHS.CLIENT_SUP_ADM_PORTFOLIO.CLIENT_SUP_ADM_PORTFOLIO_ENDPOINT}/get-portfolios`,
// //     queryKey: API_PATHS.CLIENT_SUP_ADM_PORTFOLIO.CLIENT_SUP_ADM_PORTFOLIO_KEY,
// //   });
// //   console.log("Portfolio", portfolios);

// //   /*** ------> PDF generator handler ------> */
// //   const handleDownloadPDF = (id) => {
// //     const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
// //     window.open(`${apiURL}/api/client/portfolio/${id}/pdf`, "_blank");
// //   };

// //   // const handleDownloadPDF = async (portfolio) => {
// //   //   if (!portfolio || !portfolio._id) return;
// //   //   try {
// //   //     setDownloading(true);
// //   //     const res = await fetch(`/api/portfolio/pdf/${portfolio._id}`);
// //   //     if (!res.ok) throw new Error("Failed to download PDF");
// //   //     const blob = await res.blob();
// //   //     const url = window.URL.createObjectURL(blob);
// //   //     const a = document.createElement("a");
// //   //     a.href = url;
// //   //     a.download = `${(portfolio?.name || "portfolio").replace(
// //   //       /\s+/g,
// //   //       "_"
// //   //     )}.pdf`;
// //   //     document.body.appendChild(a);
// //   //     a.click();
// //   //     a.remove();
// //   //     window.URL.revokeObjectURL(url);
// //   //   } catch (err) {
// //   //     console.error(err);
// //   //     alert("Could not download PDF. Try again later.");
// //   //   } finally {
// //   //     setDownloading(false);
// //   //   }
// //   // };

// //   // Small presentational components inside the file for convenience
// //   const Skills = ({ items = [] }) => {
// //     if (!items.length) return null;
// //     return (
// //       <div className="mt-4 grid lg:grid-cols-12 grid-cols-1 justify-between  gap-2">
// //         {items.map((s, i) => (
// //           <span
// //             key={i}
// //             className="lg:col-span-6 col-span-12 inline-block p-4 text-sm font-medium rounded-xl border border-base-content/15 bg-base-100 shadow-sm"
// //           >
// //             {s}
// //           </span>
// //         ))}
// //       </div>
// //     );
// //   };

// //   const Experience = ({ items = [] }) => {
// //     if (!items.length) return null;
// //     return (
// //       <div className="mt-6 space-y-4">
// //         {items.map((exp, i) => (
// //           <div
// //             key={i}
// //             className="p-4 rounded-lg border-base-content/15 bg-base-100     shadow-sm"
// //           >
// //             <div className="flex items-start justify-between">
// //               <div>
// //                 <h4 className="text-lg font-semibold">{exp.title}</h4>
// //                 <div className="text-sm text-gray-500">
// //                   {exp.company} • {exp.duration}
// //                 </div>
// //               </div>
// //             </div>
// //             {exp.description && (
// //               <p className="mt-2 text-sm text-base-content/70">
// //                 {exp.description}
// //               </p>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //     );
// //   };
// //   const Projects = ({ items = [] }) => {
// //     if (!items.length) return null;
// //     return (
// //       <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //         {items?.map((p, i) => (
// //           <div
// //             key={i}
// //             className="border rounded-lg overflow-hidden border-base-content/15 bg-base-100 shadow-sm"
// //           >
// //             {p.image && (
// //               <img
// //                 src={p.image}
// //                 alt={p.name}
// //                 className="w-full h-40 object-cover"
// //               />
// //             )}
// //             <div className="p-4 text-base-content/70">
// //               <h5 className="font-semibold">{p.name}</h5>
// //               <p className="mt-2 text-sm text-base-content/70">
// //                 {p.description}
// //               </p>
// //               {p.techStack && p.techStack.length > 0 && (
// //                 <div className="mt-3 text-xs text-gray-500">
// //                   {p.techStack.join(" • ")}
// //                 </div>
// //               )}
// //               <div className="mt-3 flex items-center gap-2">
// //                 {p.demoUrl && (
// //                   <a
// //                     href={p.demoUrl}
// //                     target="_blank"
// //                     rel="noreferrer"
// //                     className="text-sm underline"
// //                   >
// //                     Live
// //                   </a>
// //                 )}

// //                 <a
// //                   href={portfolios[0]?.socialLinks?.github}
// //                   target="_blank"
// //                   rel="noreferrer"
// //                   className="text-sm underline cursor-pointer"
// //                 >
// //                   GitHub
// //                 </a>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     );
// //   };

// //   /*** ------> Portfolio data fetched status hook ------> */
// //   const portfolioDataStatus = useFetchedDataStatusHandler({
// //     isLoading: isLoadingPortfolio,
// //     isError: isErrorPortfolio,
// //     error: errorPortfolio,
// //     label: "Portfolio",
// //   });

// //   if (portfolioDataStatus.status !== "success")
// //     return portfolioDataStatus.content;

// //   return (
// //     <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-5xl mx-auto">
// //         {/* Top card Image */}
// //         <div className="bg-base-100 p-6 rounded-2xl shadow-md">
// //           {loading ? (
// //             <div className="animate-pulse">
// //               <div className="h-6 bg-base-200 rounded w-48 mb-4"></div>
// //               <div className="h-4 bg-base-200 rounded w-32 mb-6"></div>
// //               <div className="h-24 bg-base-200 rounded"></div>
// //             </div>
// //           ) : error ? (
// //             <div className="text-red-600">Error loading portfolio: {error}</div>
// //           ) : !portfolios ? (
// //             <div className="">
// //               <div className="flex flex-col sm:flex-row sm:items-center gap-6">
// //                 <div className="flex-shrink-0">
// //                   {/* <img
// //                     src={data.profileImage || "/placeholder-avatar.png"}
// //                     alt={data.name || "Developer"}
// //                     className="w-28 h-28 rounded-full object-cover border-2 border-gray-100 shadow-sm"
// //                   /> */}
// //                 </div>
// //               </div>
// //             </div>
// //           ) : (
// //             portfolios?.map((portfolio) => (
// //               <div key={portfolio._id} className="flex-row mx-auto space-y-4">
// //                 <div className="flex justify-center">
// //                   <img
// //                     src={`${apiURL}${portfolio?.profileImage}`}
// //                     alt=""
// //                     className="w-28 h-28 rounded-full object-cover border-2 border-gray-100 shadow-sm"
// //                   />
// //                 </div>
// //                 <div className="flex justify-center">
// //                   <div className="text-center">
// //                     <div className="space-y-2">
// //                       <h1 className="text-2xl font-bold">
// //                         {portfolio.name || "Your Name"}
// //                       </h1>
// //                       <p className="mt-1 text-gray-600">
// //                         {portfolio.title || "Full Stack Developer"}
// //                       </p>

// //                       <p className="mt-4 text-gray-700 max-w-2xl">
// //                         {portfolio.summary ||
// //                           "Short intro or about you goes here."}
// //                       </p>
// //                     </div>

// //                     <div className="text-center space-y-4 my-4">
// //                       <button
// //                         onClick={() => handleDownloadPDF(portfolio._id)}
// //                         disabled={downloading}
// //                         className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
// //                       >
// //                         {downloading ? "Downloading..." : "Download PDF"}
// //                       </button>
// //                       {/* Optional: link to contact or external site */}
// //                       {portfolio.contactUrl && (
// //                         <a
// //                           href={portfolio.contactUrl}
// //                           target="_blank"
// //                           rel="noreferrer"
// //                           className="text-sm underline"
// //                         >
// //                           Contact
// //                         </a>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="">
// //                   {/* Skills */}
// //                   <section className="mt-6">
// //                     <h3 className="text-base font-semibold">Skills</h3>
// //                     <Skills items={portfolio?.skills || []} />
// //                   </section>

// //                   {/* Experience */}
// //                   <section className="mt-6">
// //                     <h3 className="text-base font-semibold">Experience</h3>
// //                     <Experience items={portfolio?.experience || []} />
// //                   </section>

// //                   {/* Projects */}
// //                   <section className="mt-6">
// //                     <div className="flex items-center justify-between">
// //                       <h3 className="text-base font-semibold">Projects</h3>
// //                     </div>
// //                     <Projects items={portfolio?.projects || []} />
// //                   </section>
// //                 </div>
// //                 {/* Footer note */}
// //                 <div className="divider"></div>
// //                 <div className="mt-6 text-xs text-base-content/70 text-center">
// //                   Portfolio is managed by the site super-admin. Public view
// //                   only.
// //                 </div>
// //               </div>
// //             ))
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SuperAdminPublicPortfolioViewPage;
