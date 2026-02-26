import { Calendar, Star, User2, Users2 } from "lucide-react";
import StarRating from "../ui/StartRating";
import NoDataFound from "../ui/NoDataFound";
import { FaComment } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import { LucideIcon } from "../../lib/LucideIcons";
import { Link } from "react-router-dom";
import { useState } from "react";
import Modal from "../ui/Modal";
import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import { useApiMutation } from "../../../superAdmin/services/hooks/useApiMutation";
import Textarea from "../ui/Textarea";
import toast from "react-hot-toast";
import { useApiQuery } from "../../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../utils/hooks/useFetchedDataStatusHandler";

const ClientReviewRatings = ({ productData, product }) => {
  const { user } = useAuth();
  const [isReviewSectionOpen, setIsReviewSectionOpen] = useState(false);
  // For review form
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  /*** ========> REVIEW QUERY ========> */
  const {
    data: reviews,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
    error: errorReviews,
  } = useApiQuery({
    url: `${API_PATHS.CLIENT_PRODUCT_REVIEWS.ENDPOINT}/${product?.data?._id}`,
    queryKey: API_PATHS.CLIENT_PRODUCT_REVIEWS.KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** ========> REVIEW MUTATION ========> */
  const reviewMutation = useApiMutation({
    method: "create",
    path: API_PATHS.CLIENT_PRODUCT_REVIEWS.ENDPOINT,
    key: API_PATHS.CLIENT_PRODUCT_REVIEWS.KEY,
    showToast: false,
    onSuccess: (res) => {
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      setIsReviewSectionOpen(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to submit review");
      console.error(err);
    },
  });

  const handleOpenReviewSection = () => {
    setIsReviewSectionOpen((prev) => !prev);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        data: {
          productId: productData?._id,
          rating: rating,
          comment: comment.trim(),
        },
      };

      reviewMutation.mutate(payload);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  const reviewDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
    error: errorReviews,
    label: "Reviews",
  });

  return (
    <div>
      {/* ------> REVIEW BUTTON & MODAL ------> */}
      <div className="">
        {/* Review Button */}
        <div className="flex justify-end my-2.5">
          {user ? (
            <Button
              onClick={handleOpenReviewSection}
              type="submit"
              size="xs"
              className="btn"
              icon={
                loading ? (
                  <LucideIcon.Loader2 size={25} className="animate-spin" />
                ) : (
                  LucideIcon.UploadCloudIcon
                )
              }
              disabled={loading}
              label={loading ? "Submitting..." : "Write Review"}
            />
          ) : (
            <Link to="/login">
              <Button size="xs" className="btn-sm">
                Login to Review
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ------> REVIEW DATA & MODAL ------> */}
      {reviews && reviews.length > 0 ? (
        <>
          <div className="">
            <h2 className="font-bold flex items-center justify-between gap-2 text-lg">
              <span>
                <Users2 size={20} className="inline mr-1" />
                Reviews & Ratings
              </span>
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-xs font-normal flex items-center justify-center border-2 text-white shadow">
                {reviews ? reviews?.length : 0}
              </span>
            </h2>
          </div>

          {reviews?.map((review) => (
            <div
              key={review?._id}
              className="p-2 border border-base-content/15 rounded-md bg-base-100 space-y-1 shadow mb-2 text-sm"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-bold flex items-center gap-1">
                  <User2 size={15} /> {review?.user?.name}
                </h4>
                <span>{<StarRating rating={review?.rating ?? 0} />}</span>
              </div>
              <small className="text-sm flex items-center gap-1">
                <Calendar size={15} className="inline mr-1" />{" "}
                <span>
                  {new Date(review?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </small>
              <p className="text-xs text-normal text-justify">
                <FaComment size={15} className="inline mr-1" />
                <span className="text-medium text-thin">{review?.comment}</span>
              </p>
            </div>
          ))}
        </>
      ) : (
        <NoDataFound label="Reviews" />
      )}

      {/* ------> MODAL TO SUBMIT REVIEW------>*/}

      {isReviewSectionOpen && (
        <Modal
          isOpen={!!isReviewSectionOpen}
          onClose={() => setIsReviewSectionOpen(false)}
          title="Submit Product Review"
        >
          <form onSubmit={handleSubmitReview}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="rating" className="font-semibold">
                  Your Rating:
                </label>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`cursor-pointer transition ${
                        (hover || rating) >= star
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-400"
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(null)}
                    />
                  ))}
                </div>

                <Textarea
                  name="review"
                  id="review"
                  label="Your Review"
                  rows="4"
                  placeholder="Share your experience..."
                  className="textarea textarea-bordered w-full"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <Button
                variant="success"
                size="sm"
                icon={
                  loading ? (
                    <Loader2 size={25} className="animate-spin" />
                  ) : (
                    LucideIcon.UploadCloudIcon
                  )
                }
                type="submit"
                disabled={loading}
                label={loading ? "Submitting..." : "Write Review"}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ClientReviewRatings;
