import { Check, EyeClosed, EyeOff, Star, StarOff, Trash2 } from "lucide-react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import API_PATHS from "../services/apiPaths/apiPaths";
import { useApiQuery } from "../services/hooks/useApiQuery";
import Button from "../../common/components/ui/Button";
import Badge from "../../common/components/ui/Badge";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useState } from "react";
import Pagination from "../../common/pagination/Pagination";
// import { Pagination } from "swiper/modules";

export const SuperAdminTestimonialManagement = () => {
  /*** =======> QUERY APIS =======> */
  const {
    data: testimonials,
    isLoading: isLoadingTestimonials,
    isError: isErrorTestimonials,
    error: errorTestimonials,
  } = useApiQuery({
    url: API_PATHS.SUPER_ADMIN_TESTIMONIAL.SUPER_ADMIN_TESTIMONIAL_ENDPOINT,
    queryKey: API_PATHS.SUPER_ADMIN_TESTIMONIAL.SUPER_ADMIN_TESTIMONIAL_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** =======> MUTATION APIS =======> */

  const approveMutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.SUPER_ADMIN_TESTIMONIAL.SUPER_ADMIN_TESTIMONIAL_ENDPOINT}/${payload.id}/approve`,
    key: API_PATHS.SUPER_ADMIN_TESTIMONIAL.SUPER_ADMIN_TESTIMONIAL_KEY,
  });

  const statusMutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.SUPER_ADMIN_TESTIMONIAL.SUPER_ADMIN_TESTIMONIAL_ENDPOINT}/${payload.id}/status`,
    key: API_PATHS.SUPER_ADMIN_TESTIMONIAL.SUPER_ADMIN_TESTIMONIAL_KEY,
  });

  const hideMutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.SUPER_ADMIN_TESTIMONIAL.SUPER_ADMIN_TESTIMONIAL_ENDPOINT}/${payload.id}/hide`,
    key: API_PATHS.SUPER_ADMIN_TESTIMONIAL.SUPER_ADMIN_TESTIMONIAL_KEY,
  });

  const featureMutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.SUPER_ADMIN_TESTIMONIAL.SUPER_ADMIN_TESTIMONIAL_ENDPOINT}/${payload.id}/feature`,
    key: API_PATHS.SUPER_ADMIN_TESTIMONIAL.SUPER_ADMIN_TESTIMONIAL_KEY,
  });

  const deleteMutation = useApiMutation({
    method: "delete",
    path: (payload) =>
      `${API_PATHS.SUPER_ADMIN_TESTIMONIAL.SUPER_ADMIN_TESTIMONIAL_ENDPOINT}/${payload.id}`,
    key: API_PATHS.SUPER_ADMIN_TESTIMONIAL.SUPER_ADMIN_TESTIMONIAL_KEY,
  });

  const [paginatedData, setPaginatedData] = useState(testimonials || []);

  // To display total permissions in pagination
  const dataLength = testimonials?.length;

  console.log("Testimonials", testimonials);

  /*** ========> HANDLERS ========> */

  const handleApproveTestimonial = (testimonial) => {
    const payload = {
      id: testimonial._id,
      data: {
        status: "approved",
        isFeatured: true,
      },
    };
    approveMutation.mutateAsync(payload);
  };

  const handleHideTestimonial = (testimonial) => {
    const payload = {
      id: testimonial._id,
      status: "hidden",
      isFeatured: false,
    };
    hideMutation.mutateAsync(payload);
  };

  const handleToggleTestimonial = (testimonial) => {
    const payload = {
      id: testimonial._id,
      data: {
        status: "approved",
        isFeatured: !testimonial.isFeatured,
      },
    };
    featureMutation.mutateAsync(payload);
  };

  const handleUpdateStatus = (testimonial) => {
    const payload = {
      id: testimonial._id,
      data: {
        status: "approved",
        isFeatured: true,
      },
    };
    statusMutation.mutateAsync(payload);
  };

  const handleDeleteTestimonial = (testimonial) => {
    const payload = {
      id: testimonial._id,
    };
    deleteMutation.mutateAsync(payload);
  };

  const testimonialsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingTestimonials,
    isError: isErrorTestimonials,
    error: errorTestimonials,
    label: "Testimonials",
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">
        Super Admin Testimonial Management
      </h1>
      {testimonialsDataStatus.status !== "success" ? (
        testimonialsDataStatus.content
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table table-xs">
            <thead>
              <tr className="text-left">
                <th>Name</th>
                <th>Email</th>
                <th>Feedback</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData?.map((t) => (
                <tr key={t._id} className="">
                  <td>{t.name}</td>
                  <td className="text-sm text-gray-500">{t.email}</td>
                  <td className="max-w-xs truncate">{t.feedback}</td>
                  <td>{t.rating} ⭐</td>

                  <td>
                    <Badge
                      color={
                        t.status === "approved"
                          ? "blue"
                          : t.status === "hidden"
                          ? "red"
                          : t.status === "pending"
                          ? "gray"
                          : "green"
                      }
                    >
                      <span className="capitalize">{t.status}</span>
                    </Badge>
                  </td>

                  <td className="flex gap-2">
                    {t.status !== "approved" && (
                      <div
                        className="tooltip"
                        data-tip={t.status !== "approved" ? "Approve" : "Hide"}
                      >
                        <Button
                          onClick={() => handleApproveTestimonial(t)}
                          size="icon"
                        >
                          {t.status === "pending" ? (
                            <EyeClosed size={16} />
                          ) : (
                            <Check size={16} />
                          )}
                        </Button>
                      </div>
                    )}

                    {t.status === "approved" && t.isFeatured === true && (
                      <div
                        className="tooltip"
                        data-tip={t.status === "approved" ? "Hide" : "Approve"}
                      >
                        <Button
                          size="icon"
                          onClick={() => handleHideTestimonial(t)}
                        >
                          <EyeOff size={16} />
                        </Button>
                      </div>
                    )}

                    <div
                      className="tooltip"
                      data-tip={t.isFeatured ? "Featured" : "Non-featured"}
                    >
                      <Button
                        size="icon"
                        onClick={() => handleToggleTestimonial(t)}
                      >
                        {t.isFeatured ? (
                          <Star size={16} />
                        ) : (
                          <StarOff
                            size={16}
                            className={
                              t.isFeatured === true
                                ? "text-yellow-500 bg-yellow-500"
                                : "text-yellow-500"
                            }
                          />
                        )}
                      </Button>
                    </div>

                    {t.status === "hidden" && t.isFeatured === false && (
                      <Button
                        onClick={() => handleDeleteTestimonial(t)}
                        size="icon"
                        variant="danger"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* pagination begins*/}
          <Pagination
            items={testimonials}
            dataLength={dataLength}
            onPaginatedDataChange={setPaginatedData}
          />
        </div>
      )}
    </div>
  );
};

export default SuperAdminTestimonialManagement;
