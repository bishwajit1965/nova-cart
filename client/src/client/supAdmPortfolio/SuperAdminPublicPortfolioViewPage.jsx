import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import Button from "../../common/components/ui/Button";

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
  if (projectsDataStatus.status !== "success")
    return projectsDataStatus.content;
  if (portfolioDataStatus.status !== "success")
    return portfolioDataStatus.content;

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
    <div className="min-h-screen bg-base-100 text-base-content-/70 lg:py-10 py-5 lg:px-4 px-2">
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

                <p className="max-w-3xl text-base-content/70 mt-2">
                  {pf.summary ||
                    "A thoughtful summary about this developer. Crisp. Precise. Engaging."}
                </p>

                <div className="lg:mt-6 nt-3 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    onClick={() => handleDownloadPDF(pf._id)}
                    variant="defaultRounded"
                    className=" rounded-full"
                    aria-label="Download PDF"
                  >
                    <FaFilePdf className="w-5 h-5" />
                    {downloading ? "Downloading..." : "Download PDF"}
                  </Button>

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

            {/* Experience */}
            <div className="">
              <div className="lg:col-span-1 bg-base-100 rounded-2xl lg:p-6 p-2 shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Experience</h3>
                {pf.experience && pf.experience.length ? (
                  <div className="grid lg:grid-cols-12 grid-cols-1 gap-4 justify-between">
                    {pf.experience.map((exp, i) => (
                      <article
                        key={i}
                        className="lg:col-span-6 col-span-12 p-4 border border-base-content/10 hover:shadow-sm transition rounded-2xl"
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
            </div>

            {/* PROJECTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <div className="grid lg:grid-cols-12 grid-cols-1 justify-between gap-4">
                    {projects?.map((p) => (
                      <div
                        key={p._id}
                        className="rounded-xl overflow-hidden border border-base-content/10 transform transition hover:scale-[1.01] hover:shadow-lg lg:col-span-6 col-span-12 bg-base-100"
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

                        <div className="lg:p-4">
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
            <div className="text-center text-sm text-base-content/70 lg:mt-10 mt-4">
              <p>Portfolio managed by site super-admin — public view only.</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminPublicPortfolioViewPage;
