import { Edit, PlusCircleIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import Modal from "../../common/components/ui/Modal";
import SuperAdminHeroBannerForm from "../components/SuperAdminHeroBannerForm";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import ConfirmDialog from "../../common/components/ui/ConfirmDialog";
import buildUrl from "../../common/hooks/useBuildUrl";
const apuURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const SuperAdminHeroSlidePage = () => {
  const [editingSlideBanner, setEditingSlideBanner] = useState(null);
  const [slidesBanner, setSlidesBanner] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (editingSlideBanner) setEditingSlideBanner(null);
  };

  const {
    data: slidesBannerData,
    isLoading: isLoadingSlidesData,
    isError: isErrorSlidesData,
    error: errorSlidesData,
  } = useApiQuery({
    url: API_PATHS.SUP_ADMIN_HERO_SLIDES_BANNER
      .SUP_ADMIN_HERO_SLIDES_BANNER_ENDPOINT,
    queryKey:
      API_PATHS.SUP_ADMIN_HERO_SLIDES_BANNER.SUP_ADMIN_HERO_SLIDES_BANNER_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  useEffect(() => {
    if (slidesBannerData) setSlidesBanner(slidesBannerData);
    if (editingSlideBanner && !isFormOpen) setEditingSlideBanner(null);
  }, [slidesBannerData]);

  const slidesBannerMutation = useApiMutation({
    method: editingSlideBanner ? "update" : "create",
    path: editingSlideBanner
      ? (payload) =>
          `${API_PATHS.SUP_ADMIN_HERO_SLIDES_BANNER.SUP_ADMIN_HERO_SLIDES_BANNER_ENDPOINT}/${payload.id}`
      : API_PATHS.SUP_ADMIN_HERO_SLIDES_BANNER
          .SUP_ADMIN_HERO_SLIDES_BANNER_ENDPOINT,
    key: API_PATHS.SUP_ADMIN_HERO_SLIDES_BANNER
      .SUP_ADMIN_HERO_SLIDES_BANNER_KEY, // used by useQuery
    onSuccess: () => {
      setEditingSlideBanner(null);
    },
    onError: (error) => {
      toast.error("Error saving permission");
      console.error(error);
    },
  });

  const deleteSlidesBannerMutation = useApiMutation({
    method: "delete",
    path: (id) =>
      `${API_PATHS.SUP_ADMIN_HERO_SLIDES_BANNER.SUP_ADMIN_HERO_SLIDES_BANNER_ENDPOINT}/${id}`,
    key: API_PATHS.SUP_ADMIN_HERO_SLIDES_BANNER
      .SUP_ADMIN_HERO_SLIDES_BANNER_KEY,
    onSuccess: () => {
      setConfirmDelete(null);
    },
    onError: (error) => {
      toast.error("Error in deleting slider banner", error);
    },
  });

  /*** -----> Uploads & updates data -----> */
  const handleSubmit = async (formData) => {
    await slidesBannerMutation.mutateAsync(formData);
    toggleForm();
  };

  const handleToggleConfirmDialogue = (slide) => {
    setConfirmDelete(slide);
  };

  const handleDelete = async (id) => {
    deleteSlidesBannerMutation.mutateAsync(id);
  };

  /** --------> Use Fetched Data Status Handler --------> */
  const slidesDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingSlidesData,
    isError: isErrorSlidesData,
    error: errorSlidesData,
    label: "Slides Banner",
  });

  if (slidesDataStatus.status !== "success") return slidesDataStatus.content;

  return (
    <div className="lg:p-6 p-2 bg-base-200 rounded-lg shadow-lg max-w-7xl mx-auto lg:space-y-6 space-y-4">
      <div className="lg:flex grid items-center lg:gap-6 gap-2">
        <Button variant="primary" onClick={toggleForm}>
          <PlusCircleIcon size={20} /> Add New Slide
        </Button>
        <h2 className="lg:text-2xl text-lg font-extrabold text-base-content/70">
          Hero & Banner Slides
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {slidesBanner?.length === 0 && <p>No slides available.</p>}

        {slidesBanner?.map((slide) => (
          <div
            key={slide._id}
            className="border border-base-content/15 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={buildUrl(`${slide?.image}`)}
              alt={slide?.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">{slide.title}</h3>
              {slide.subtitle && <p className="text-sm">{slide.subtitle}</p>}
              {slide.ctaLink && (
                <p className="text-xs text-blue-600 truncate">
                  CTA: {slide.ctaLink}
                </p>
              )}
              {slide.secondaryLink && (
                <p className="text-xs text-blue-600 truncate">
                  Secondary Link: {slide.secondaryLink}
                </p>
              )}
              {slide.type && (
                <p className="text-xs">
                  Type:{" "}
                  {slide.type.charAt(0).toUpperCase() + slide.type.slice(1)}
                </p>
              )}
              <div className="flex justify-between mt-2">
                <Button
                  variant="indigo"
                  onClick={() => setEditingSlideBanner(slide) || toggleForm()}
                  className="btn btn-sm"
                >
                  <Edit size={20} /> Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleToggleConfirmDialogue(slide)}
                  className="btn btn-sm"
                >
                  <Trash2 size={20} /> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toggle form open  */}
      {isFormOpen && (
        <Modal
          isOpen={toggleForm}
          onClose={toggleForm}
          title="Hero & Banner Slide"
        >
          <SuperAdminHeroBannerForm
            initialData={editingSlideBanner}
            onClose={toggleForm}
            isFormOpen={isFormOpen}
            onSubmit={handleSubmit}
            editingSlideBanner={editingSlideBanner}
            setEditingSlideBanner={setEditingSlideBanner}
          />
        </Modal>
      )}

      {/* Confirm delete dialogue box */}
      {confirmDelete && (
        <ConfirmDialog
          title={`${confirmDelete.title}`}
          isOpen={confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete._id)}
        />
      )}
    </div>
  );
};

export default SuperAdminHeroSlidePage;
