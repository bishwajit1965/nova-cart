import { Edit, PlusCircleIcon, Trash, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import Modal from "../../common/components/ui/Modal";
import SuperAdminHeroBannerForm from "../components/SuperAdminHeroBannerForm";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";

const apuURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const SuperAdminHeroSlidePage = () => {
  const [editingSlideBanner, setEditingSlideBanner] = useState(null);
  const [slidesBanner, setSlidesBanner] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    setEditingSlideBanner(null);
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
    // select: (res) => res.data, //NOT NEEDED HERE AS HOOK DOES IT
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  useEffect(() => {
    if (slidesBannerData) setSlidesBanner(slidesBannerData);
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
      toast.success("Slide deleted successfully");
    },
  });

  /*** -----> Uploads & updates data -----> */
  const handleSubmit = async (formData) => {
    await slidesBannerMutation.mutateAsync(formData);
    toggleForm();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this slide?")) {
      deleteSlidesBannerMutation.mutateAsync(id);
    }
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
    <div className="p-6 bg-base-200 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Hero & Banner Slides</h2>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {slidesBanner?.length === 0 && <p>No slides available.</p>}

        {slidesBanner?.map((slide) => (
          <div
            key={slide._id}
            className="border border-base-content/15 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={
                slide.image
                  ? `${apuURL}/uploads/${slide.image}`
                  : "/placeholder.png"
              }
              alt={slide.title}
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
                  onClick={() => handleDelete(slide._id)}
                  className="btn btn-sm"
                >
                  <Trash2 size={20} /> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button variant="primary" onClick={toggleForm}>
          <PlusCircleIcon /> Add New Slide
        </Button>
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
    </div>
  );
};

export default SuperAdminHeroSlidePage;
