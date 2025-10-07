import { Layers, Loader, Save, X } from "lucide-react";

import API_PATHS from "../services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import ConfirmDialog from "../../common/components/ui/ConfirmDialog";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { Input } from "../../common/components/ui/Input";
import { LucideIcon } from "../../common/lib/LucideIcons";
import Modal from "../../common/components/ui/Modal";
import PageMeta from "../../common/components/ui/PageMeta";
import SuperAdminPlanCard from "../components/SuperAdminPlanCard";
import Textarea from "../../common/components/ui/Textarea";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import usePageTitle from "../services/hooks/usePageTitle";
import { useState } from "react";
import useValidator from "../../common/hooks/useValidator";

const SuperAdminPlanManagementPage = () => {
  const { pageTitle } = usePageTitle();

  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState("monthly");
  const [description, setDescription] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (editPlan) {
      setName(editPlan?.name);
      setPrice(editPlan?.price);
      setDuration(editPlan?.duration);
      setDescription(editPlan?.description);
      setSelectedFeatures(editPlan?.features.map((f) => f._id));
    } else {
      setName("");
      setPrice(0);
      setDuration("monthly");
      setDescription("");
      setSelectedFeatures([]);
    }
  }, [editPlan]);

  /*** ------> Plans data fetched ------> */
  const {
    data: plans,
    isLoadingPlans,
    isErrorPlans,
    errorPlans,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_PLANS.SUP_ADMIN_PLANS_ENDPOINT}/all`,
    queryKey: API_PATHS.SUP_ADMIN_PLANS.SUP_ADMIN_PLANS_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** ------> Features data fetched ------> */
  const {
    data: featuresData,
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

  // Validation
  const validationRules = {
    name: {
      required: { message: "Name is required" },
    },
    price: {
      required: { message: "Price is required" },
    },
    duration: {
      required: { message: "Duration is required" },
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
    name,
    price,
    duration,
    description,
  });

  /*** ------> Plan Mutation CREATE/UPDATE API Hook ------> */
  const planMutation = useApiMutation({
    method: editPlan ? "update" : "create",
    path: editPlan
      ? (payload) =>
          `${API_PATHS.SUP_ADMIN_PLANS.SUP_ADMIN_PLANS_ENDPOINT}/${payload.id}/edit`
      : API_PATHS.SUP_ADMIN_PLANS.SUP_ADMIN_PLANS_ENDPOINT,
    key: API_PATHS.SUP_ADMIN_PLANS.SUP_ADMIN_PLANS_KEY, // used by useQuery
    onSuccess: () => {
      setEditPlan(null);
      setName("");
      setPrice(0);
      setDuration("monthly");
      setDescription("");
      setSelectedFeatures([]);
    },
    onError: (error) => {
      toast.error("Error in saving plan!", error);
      console.error(error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!validate()) return;
      const payload = editPlan
        ? {
            id: editPlan._id,
            data: {
              name,
              price,
              duration,
              features: selectedFeatures,
              description,
            },
          }
        : {
            data: {
              name,
              price,
              duration,
              features: selectedFeatures,
              description,
            },
          };

      planMutation.mutate(payload, {
        onSuccess: () => {
          setTimeout(() => {
            setShowModal(false);
          }, 1000);
        },
      });
    } catch (error) {
      console.error("Error in creating/updating plan!", error);
    } finally {
      setLoading(false);
    }
  };

  /*** ------> Plan Mutation DELETE API Hook ------> */
  const deletePlanMutation = useApiMutation({
    method: "delete",
    path: (id) =>
      `${API_PATHS.SUP_ADMIN_PLANS.SUP_ADMIN_PLANS_ENDPOINT}/${id}/delete`,
    key: API_PATHS.SUP_ADMIN_PLANS.SUP_ADMIN_PLANS_KEY,
  });

  const handleDeletePlan = (id) => {
    const payload = id;
    deletePlanMutation.mutate(payload, {
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
    label: "Plans",
  });

  /** -------- Use Fetched Data Status Handler -------- */
  const plansDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingPlans,
    isError: isErrorPlans,
    error: errorPlans,
    label: "Plans",
  });

  const handleFeatureToggle = (id) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <>
      <PageMeta
        title="Plan Management || Nova-Cart"
        description="You can manage plans data in detail."
      />
      <DynamicPageTitle pageTitle={pageTitle} />

      <div className="lg:p-6">
        <h1 className="text-2xl font-bold mb-4">Plans Management</h1>
        <button
          className="btn btn-primary mb-4"
          onClick={() => setShowModal(true)}
        >
          <Layers /> Add New Plan
        </button>
        {plansDataStatus.status !== "success" ? (
          plansDataStatus.content
        ) : (
          <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-6 gap-4 justify-center">
            {plans?.map((plan) => (
              <SuperAdminPlanCard
                key={plan._id}
                plan={plan}
                onEdit={() => {
                  setEditPlan(plan);
                  setShowModal(true);
                }}
                onDelete={() => setConfirmDelete(plan)}
              />
            ))}
          </div>
        )}

        {/* Modal component goes here */}
        {showModal && (
          <Modal
            isOpen={showModal}
            editPlan={editPlan}
            title={editPlan?.name}
            onClose={() => {
              setShowModal(false);
              setEditPlan(null);
            }}
          >
            <div className="">
              <h2>{editPlan?.name}</h2>
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-base-100 p-6 rounded shadow w-96">
                  <h2 className="text-xl font-bold mb-4">
                    {editPlan ? "Edit Plan" : "Add Plan"}
                  </h2>
                  <form action="" onSubmit={handleSubmit}>
                    <div className="">
                      <Input
                        className="input mb-2 w-full"
                        type="text"
                        name="name"
                        placeholder="Name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {errors.name && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="">
                      <Input
                        className="input mb-2 w-full"
                        type="number"
                        name="price"
                        placeholder="Price..."
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      {errors.price && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.price}
                        </p>
                      )}
                    </div>
                    <div className="">
                      <select
                        className="input mb-2 w-full"
                        name="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="lifetime">Lifetime</option>
                      </select>
                      {errors.duration && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.duration}
                        </p>
                      )}
                    </div>
                    <div className="">
                      <Textarea
                        name="description"
                        className="input mb-2 w-full"
                        placeholder="Description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      {errors.description && (
                        <p className="text-red-600 text-xs mt-1">
                          {errors.description}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <p className="font-semibold">Select Features:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {featuresData?.map((f) => (
                          <label
                            key={f._id}
                            className="flex items-center gap-1"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFeatures.includes(f._id)}
                              onChange={() => handleFeatureToggle(f._id)}
                            />
                            {f.title}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end items-center space-x-4">
                      <div className="">
                        <Button
                          variant="warning"
                          onClick={() => {
                            setShowModal(false);
                            setEditPlan(null);
                          }}
                        >
                          <X size={20} /> Cancel
                        </Button>
                      </div>
                      <div
                        className={`${
                          planMutation.isPending
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                      >
                        <Button
                          variant="indigo"
                          type="submit"
                          onClick={handleSubmit}
                          disabled={planMutation.isPending}
                        >
                          {planMutation?.isPending ? (
                            <Loader size={20} className="animate-spin" />
                          ) : (
                            <Save size={20} />
                          )}
                          {planMutation?.isPending ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Confirm delete dialogue box */}
        {confirmDelete && (
          <ConfirmDialog
            isOpen={confirmDelete}
            onClose={() => setConfirmDelete(null)}
            onConfirm={() => handleDeletePlan(confirmDelete._id)}
          />
        )}
      </div>
    </>
  );
};

export default SuperAdminPlanManagementPage;
