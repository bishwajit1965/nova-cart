import { Loader, SaveAllIcon } from "lucide-react";

import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import Textarea from "../ui/Textarea";
import toast from "react-hot-toast";
import { useApiMutation } from "../../../superAdmin/services/hooks/useApiMutation";
import { useState } from "react";
import useValidator from "../../hooks/useValidator";

const TestimonialFormSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const ratingOptions = [1, 2, 3, 4, 5];
  const [form, setForm] = useState({
    name: "",
    email: "",
    feedback: "",
    avatar: "",
    rating: 5,
  });

  /*** ------> Testimonial Mutation ------> */
  const testimonialMutation = useApiMutation({
    method: "create",
    path: API_PATHS.CLIENT_TESTIMONIAL.CLIENT_TESTIMONIAL_ENDPOINT,
    key: API_PATHS.CLIENT_TESTIMONIAL.CLIENT_KEY,
    onSuccess: () => {
      setIsLoading(false);
      setForm({ name: "", email: "", feedback: "", avatar: "", rating: 5 });
    },
    onError: (error) => {
      toast.error("Error saving testimonial");
      console.error(error);
    },
  });

  /*** ------> Handle form input changes ------> */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    feedback: {
      required: { message: "Feedback is required" },
    },
    avatar: {
      required: { message: "Image url is required" },
      pattern: {
        value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i,
        message: "Enter a valid image URL",
      },
    },
    rating: {
      required: { message: "Rating is required" },
    },
  };

  /*** ------> Validator integration ------> */
  const { errors, validate } = useValidator(validationRules, {
    name: form.name,
    email: form.email,
    feedback: form.feedback,
    avatar: form.avatar,
    rating: form.rating,
  });

  /*** ------> Handle form submission ------> */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    setIsLoading(true);

    const payload = { data: form };
    testimonialMutation.mutate(payload);
  };

  return (
    <div className="bg-base-200 lg:py-16 py-4 rounded-md shadow max-w-7xl mx-auto lg:space-y-6 space-y-4 lg:px-6 px-2">
      <div className="">
        <h2 className="lg:text-3xl text-xl font-extrabold text-base-content/70 lg:mb-8 mb-4 text-center">
          📝 Share Your Experience
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-base-100 lg:p-6 p-2 rounded-xl shadow mt-6 space-y-4 hover:shadow-lg transition"
      >
        <h3 className="text-xl font-bold text-center mb-2">
          📝 Submit Testimonial
        </h3>
        <div className="">
          <Input
            type="text"
            name="name"
            placeholder="Your Name..."
            value={form.name}
            onChange={handleChange}
            className=""
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        <div className="">
          <Input
            type="text"
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
        <div className="">
          <Textarea
            name="feedback"
            placeholder="Your Feedback..."
            value={form.feedback}
            onChange={handleChange}
            className=""
            rows="3"
          />
          {errors.feedback && (
            <p className="text-red-600 text-xs mt-1">{errors.feedback}</p>
          )}
        </div>
        <div className="">
          <Input
            type="text"
            name="avatar"
            placeholder="Avatar URL (optional)"
            value={form.avatar}
            onChange={handleChange}
            className=""
          />
          {errors.avatar && (
            <p className="text-red-600 text-xs mt-1">{errors.avatar}</p>
          )}
        </div>
        <div className="">
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded border-base-content/15"
          >
            {ratingOptions.map((num) => (
              <option key={num} value={num}>
                {num} Star{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          {errors.rating && (
            <p className="text-red-600 text-xs mt-1">{errors.rating}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="btn w-full bg-primary text-white py-2 rounded hover:bg-primary/80 transition flex items-center justify-center space-x-2"
        >
          {isLoading ? <Loader className="animate-spin" /> : <SaveAllIcon />}
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default TestimonialFormSection;
