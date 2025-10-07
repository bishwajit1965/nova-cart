import { File, Key, Puzzle, User } from "lucide-react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import ConfirmDialog from "../../common/components/ui/ConfirmDialog";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { Input } from "../../common/components/ui/Input";
import Modal from "../../common/components/ui/Modal";
import PageMeta from "../../common/components/ui/PageMeta";
import SuperAdminFeatureCard from "../components/SuperAdminFeatureCard";
import Textarea from "../../common/components/ui/Textarea";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import usePageTitle from "../services/hooks/usePageTitle";
import { useState } from "react";
import useValidator from "../../common/hooks/useValidator";

const SuperAdminFeatureManagementPage = () => {
  const { pageTitle } = usePageTitle();
  const [showModal, setShowModal] = useState(false);
  const [editFeature, setEditFeature] = useState(null);
  const [title, setTitle] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  /*** ------> Features data fetched ------> */
  const {
    data: features,
    isLoadingFeatures,
    isErrorFeatures,
    errorFeatures,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_FEATURE.SUP_ADMIN_FEATURE_ENDPOINT}/all`,
    queryKey: API_PATHS.SUP_ADMIN_FEATURE.SUP_ADMIN_FEATURE_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  useEffect(() => {
    if (editFeature) {
      setTitle(editFeature.title);
      setKey(editFeature.key);
      setDescription(editFeature.description);
    } else {
      setTitle("");
      setKey("");
      setDescription("");
    }
  }, [editFeature]);

  console.log("Plans", features);

  // Validation
  const validationRules = {
    title: {
      required: { message: "Title is required" },
    },
    key: {
      required: { message: "Key is required" },
    },

    description: {
      required: { message: "Description is required" }, // <-- Add this line
      custom: (val) =>
        val && val.length > 100
          ? "Description must be less than 100 characters"
          : null,
    },
  };

  /*** -----> Validator integration -----> */
  const { errors, validate } = useValidator(validationRules, {
    title,
    key,
    description,
  });

  /*** ------> Feature Mutation CREATE/UPDATE API Hook ------> */
  const featureMutation = useApiMutation({
    method: editFeature ? "update" : "create",
    path: editFeature
      ? (payload) =>
          `${API_PATHS.SUP_ADMIN_FEATURE.SUP_ADMIN_FEATURE_ENDPOINT}/${payload.id}/edit`
      : API_PATHS.SUP_ADMIN_FEATURE.SUP_ADMIN_FEATURE_ENDPOINT,
    key: API_PATHS.SUP_ADMIN_FEATURE.SUP_ADMIN_FEATURE_KEY, // used by useQuery
    onSuccess: () => {
      setEditFeature(null);
      setTitle("");
      setKey("");
      setDescription("");
    },
    onError: (error) => {
      toast.error("Error in saving feature!", error);
      console.error(error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!validate()) return;
      const payload = editFeature
        ? {
            id: editFeature._id,
            data: {
              title,
              key,
              description,
            },
          }
        : {
            data: {
              title,
              key,
              description,
            },
          };

      featureMutation.mutate(payload, {
        onSuccess: () => {
          setTimeout(() => {
            setShowModal(false);
          }, 1000);
        },
      });
    } catch (error) {
      console.error("Error in creating/updating feature!", error);
    } finally {
      setLoading(false);
    }
  };

  /*** ------> Feature Mutation DELETE API Hook ------> */
  const deleteFeatureMutation = useApiMutation({
    method: "delete",
    path: (id) =>
      `${API_PATHS.SUP_ADMIN_FEATURE.SUP_ADMIN_FEATURE_ENDPOINT}/${id}/delete`,
    key: API_PATHS.SUP_ADMIN_FEATURE.SUP_ADMIN_FEATURE_KEY,
  });

  const handleDeleteFeature = (id) => {
    const payload = id;
    deleteFeatureMutation.mutate(payload, {
      onSuccess: () => {
        setTimeout(() => {
          setConfirmDelete(null);
        }, 600);
      },
      onError: (error) => {},
    });
  };

  /** -------- Use Fetched Data Status Handler -------- */
  const featuresDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingFeatures,
    isError: isErrorFeatures,
    error: errorFeatures,
    label: "Features",
  });
  return (
    <>
      <PageMeta
        title="Feature Management || Nova-Cart"
        description="You can manage feature data in detail."
      />
      <DynamicPageTitle pageTitle={pageTitle} />

      <div className="lg:p-6">
        <h1 className="text-2xl font-bold mb-4">Feature Management</h1>
        <button
          className="btn btn-primary mb-4"
          onClick={() => setShowModal(true)}
        >
          <Puzzle /> Add New Feature
        </button>
        {featuresDataStatus.status !== "success" ? (
          featuresDataStatus.content
        ) : (
          <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-6 gap-4 justify-center">
            {features?.map((feature) => (
              <SuperAdminFeatureCard
                key={feature._id}
                feature={feature}
                onEdit={() => {
                  setEditFeature(feature);
                  setShowModal(true);
                }}
                onDelete={() => setConfirmDelete(feature)}
              />
            ))}
          </div>
        )}

        {/* Modal component goes here */}
        {showModal && (
          <Modal
            isOpen={showModal}
            editFeature={editFeature}
            onClose={() => {
              setEditFeature(null);
              setShowModal(false);
            }}
          >
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-base-100 p-6 rounded shadow w-96">
                <h2 className="text-xl font-bold mb-4">
                  {editFeature ? "Edit Feature" : "Add Feature"}
                </h2>
                <form onSubmit={handleSubmit} action="">
                  <Input
                    className="input mb-2 w-full"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {errors.title && (
                    <p className="text-red-600 text-xs mt-1">{errors.title}</p>
                  )}
                  <Input
                    className="input mb-2 w-full"
                    placeholder="Key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  />
                  {errors.key && (
                    <p className="text-red-600 text-xs mt-1">{errors.key}</p>
                  )}
                  <Textarea
                    className="input mb-4 w-full"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {errors.description && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.description}
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowModal(false);
                        setEditFeature(null);
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      className="btn btn-primary"
                      // onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        )}

        {/* Confirm delete dialogue box */}
        {confirmDelete && (
          <ConfirmDialog
            isOpen={confirmDelete}
            onClose={() => setConfirmDelete(null)}
            onConfirm={() => handleDeleteFeature(confirmDelete._id)}
          />
        )}
      </div>
    </>
  );
};

export default SuperAdminFeatureManagementPage;
