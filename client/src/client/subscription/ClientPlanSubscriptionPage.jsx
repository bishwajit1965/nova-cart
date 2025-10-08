import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import ClientPlanSubscriptionCard from "./ClientPlanSubscriptionCard";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import PageMeta from "../../common/components/ui/PageMeta";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import { useState } from "react";

const ClientPlanSubscriptionPage = () => {
  const pageTitle = usePageTitle();
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  console.log("Selected plan", selectedPlan);
  console.log("Selected plan id", selectedPlanId);

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

  /*** ------>User Plan data fetched ------> */
  const {
    data: userPlan,
    isLoadingUserPlan,
    isErrorUserPlan,
    errorUserPlan,
  } = useApiQuery({
    url: `${API_PATHS.CLIENT_USER.CLIENT_USER_PLAN_ENDPOINT}/my-plan`,
    queryKey: API_PATHS.CLIENT_USER.CLIENT_USER_PLAN_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** ------> Plan Subscription Mutation Hook ------> */
  const planMutation = useApiMutation({
    method: "create",
    path: `${API_PATHS.CLIENT_USER.CLIENT_USER_ENDPOINT}/subscribe`,
    key: API_PATHS.CLIENT_USER.CLIENT_USER_KEY,
    onSuccess: () => {},
    onError: (error) => {
      toast.error("Error saving plan!", error);
      console.error(error);
    },
  });
  /*** ------>Update Plan Subscription Mutation Hook ------> */
  const updatePlanMutation = useApiMutation({
    method: "update",
    path: `${API_PATHS.CLIENT_USER.CLIENT_USER_ENDPOINT}/subscribe`,
    key: API_PATHS.CLIENT_USER.CLIENT_USER_KEY,
    onSuccess: () => {},
    onError: (error) => {
      toast.error("Error saving plan!", error);
      console.error(error);
    },
  });

  const handleSelectPlan = (plan) => {
    try {
      setSelectedPlan(plan);
      toast.success(`Selected plan ${plan.name}`);
      const payload = { data: { planId: plan._id } };

      planMutation.mutate(payload);
    } catch (error) {
      console.error("Error in selecting plan!", error);
    }
  };

  /** -----> Use Fetched Data Status Handler -----> */
  const plansDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingPlans,
    isError: isErrorPlans,
    error: errorPlans,
    label: "Plans",
  });
  const userPlanDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingUserPlan,
    isError: isErrorUserPlan,
    error: errorUserPlan,
    label: "User Plans",
  });

  const plansWithStatus = plans?.map((plan) => ({
    ...plan,
    isCurrent: plan._id.toString() === userPlan?.plan?._id.toString(),
  }));

  return (
    <div>
      <PageMeta
        title="Client Plan Management || Nova-Cart"
        description="You can manage plans data in detail."
      />
      <DynamicPageTitle pageTitle={pageTitle} />
      <div className="">
        {plansDataStatus.status !== "success" ? (
          plansDataStatus.content
        ) : (
          <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-6 gap-4 justify-center">
            {plansWithStatus?.map((plan) => (
              <ClientPlanSubscriptionCard
                key={plan._id}
                plan={plan}
                isCurrent={plan?.isCurrent}
                selectedPlanId={selectedPlanId}
                onSelect={() =>
                  setSelectedPlanId(plan?._id) & handleSelectPlan(plan)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPlanSubscriptionPage;
