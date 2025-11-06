import { Edit, Loader, PlusCircle, Save, X } from "lucide-react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import ConfirmDialog from "../../common/components/ui/ConfirmDialog";
import { Input } from "../../common/components/ui/Input";
import { MiniIconButton } from "../../common/components/ui/MiniIconButton";
import Modal from "../../common/components/ui/Modal";
import NoDataFound from "../../common/components/ui/NoDataFound";
import Textarea from "../../common/components/ui/Textarea";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";
import useValidator from "../../common/hooks/useValidator";

const SuperAdminFaqManagement = () => {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFaq, setEditFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  useEffect(() => {
    if (editFaq) {
      setFormData({
        question: editFaq?.question,
        answer: editFaq?.answer,
      });
    }
  }, [editFaq]);
  const question = formData?.question;
  const answer = formData?.answer;

  console.log("Form data", formData);

  // Validation
  const validationRules = {
    question: {
      required: { message: "Question is required" },
    },
    answer: {
      required: { message: "Answer is required" },
    },
  };

  /*** -----> Validator integration -----> */
  const { errors, validate } = useValidator(validationRules, {
    question,
    answer,
  });

  /*** ------> Faq data fetched ------> */
  const {
    data: faqs,
    isLoading: isLoadingFaqs,
    isError: isErrorFaqs,
    error: errorFaqs,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_FAQ.SUP_ADMIN_FAQ_ENDPOINT}/all-faqs`,
    queryKey: API_PATHS.SUP_ADMIN_FAQ.SUP_ADMIN_FAQ_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** ------> Faq Mutation CREATE/UPDATE API Hook ------> */
  const faqMutation = useApiMutation({
    method: editFaq ? "update" : "create",
    path: editFaq
      ? (payload) =>
          `${API_PATHS.SUP_ADMIN_FAQ.SUP_ADMIN_FAQ_ENDPOINT}/${payload.id}/edit`
      : `${API_PATHS.SUP_ADMIN_FAQ.SUP_ADMIN_FAQ_ENDPOINT}/add`,
    key: API_PATHS.SUP_ADMIN_FAQ.SUP_ADMIN_FAQ_KEY,
    onSuccess: () => {
      setFormData({
        question: "",
        answer: "",
      });
      handleModalToggler();
      setEditFaq(null);
    },
    onError: (error) => {
      toast.error("Error in saving faq!", error);
      console.error(error);
    },
  });

  /*** ------> Content Mutation DELETE API Hook ------> */
  const deleteFaqMutation = useApiMutation({
    method: "delete",
    path: (id) =>
      `${API_PATHS.SUP_ADMIN_FAQ.SUP_ADMIN_FAQ_ENDPOINT}/${id}/delete-faq`,
    key: API_PATHS.SUP_ADMIN_FAQ.SUP_ADMIN_FAQ_KEY,
  });

  /*** Use data fetch status Handler */
  const faqDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingFaqs,
    isError: isErrorFaqs,
    error: errorFaqs,
    label: "Faq",
  });

  const handleModalToggler = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target; // grabs both name and value from the input
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelCrud = () => {
    setEditFaq(null);
    setFormData({ question: "", answer: "" });
    handleModalToggler();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = { id: editFaq?._id, data: formData };
    faqMutation.mutate(payload);
  };

  const handleEdit = (data) => {
    setEditFaq(data);
    handleModalToggler();
  };

  const handleDelete = (id) => {
    deleteFaqMutation.mutate(id);
    setConfirmDelete(null);
  };

  if (faqDataStatus.status !== "success") return faqDataStatus.content;

  return (
    <div className="lg:space-y-6 space-y-4">
      <div className="">
        <h2 className="lg:text-2xl text-xl font-bold">
          Question & Answer Data
        </h2>
      </div>
      <div className="">
        <Button onClick={handleModalToggler} variant="indigo">
          <PlusCircle />
          Add FAQ
        </Button>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead className="bg-base-300">
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Answer</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <NoDataFound label={"FAQ "} />
                </td>
              </tr>
            ) : (
              faqs.map((faq, idx) => (
                <tr key={idx}>
                  <th>{idx + 1}</th>
                  <td>{faq?.question}</td>
                  <td>{faq?.answer}</td>
                  <td className="flex justify-end space-x-2">
                    <MiniIconButton
                      onClick={() => handleEdit(faq)}
                      icon="defaultEdit"
                      variant="indigo"
                    />
                    <MiniIconButton
                      onClick={() => setConfirmDelete(faq)}
                      name="delete"
                      variant="danger"
                      icon="delete"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalToggler}
          editFaq={editFaq}
        >
          <div className="mb-2 text-base-content/60">
            <h2 className="lg:text-2xl text-xl font-bold">
              {editFaq ? "Edit FAQ" : "Add FAQ"}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="question"
              placeholder="Your Question...."
              onChange={handleChange}
              value={question}
              className={
                errors.question
                  ? "input-secondary bg-yellow-200 mb-0 space-y-0"
                  : ""
              }
            />
            {errors?.question && (
              <p className="text-red-600 text-xs">{errors?.question}</p>
            )}

            <Textarea
              type="text"
              name="answer"
              placeholder="Your Answer...."
              onChange={handleChange}
              value={answer}
              className={
                errors.answer
                  ? "input-secondary bg-yellow-200 mb-0 space-y-0"
                  : ""
              }
            />
            {errors.answer && (
              <p className="text-red-600 text-xs">{errors.answer}</p>
            )}

            <div className="flex space-x-2">
              <div
                className={`${
                  faqMutation.isPending
                    ? "cursor-not-allowed bg-red-500 rounded-md"
                    : ""
                }`}
              >
                <Button
                  type="submit"
                  variant="indigo"
                  disabled={faqMutation.isPending}
                  className="btn btn-sm"
                >
                  {faqMutation.isPending ? (
                    <Loader size={20} className="animate-spin" />
                  ) : editFaq ? (
                    <Edit size={20} />
                  ) : (
                    <Save size={20} />
                  )}
                  {faqMutation.isPending
                    ? "saving..."
                    : editFaq
                    ? "Edit FAQ"
                    : "Add FAQ"}
                </Button>
              </div>

              <Button
                type="submit"
                variant="warning"
                onClick={handleCancelCrud}
                className="btn btn-sm"
              >
                <X size={20} />
                {editFaq ? "Cancel Edit FAQ" : "Cancel Add FAQ"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm delete dialogue box */}
      {confirmDelete && (
        <ConfirmDialog
          isOpen={confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete?._id)}
        />
      )}
    </div>
  );
};

export default SuperAdminFaqManagement;
