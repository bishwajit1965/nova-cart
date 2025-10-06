import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import Loader from "../../common/components/ui/Loader";
import { LucideIcon } from "../../common/lib/LucideIcons";
import api from "../../superAdmin/services/api/api";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import { useState } from "react";

const ClientStripePaymentForm = ({
  orderId,
  amount,
  shippingAddress,
  onPaymentSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  console.log("Order ID", orderId);

  /** ------> STRIPE ORDER MUTATION HOOK ------> */
  const stripeOrderMutation = useApiMutation({
    method: "create",
    path: (payload) =>
      `${API_PATHS.CLIENT_STRIPE.CLIENT_STRIPE_ENDPOINT}/${payload.orderId}/create-payment-intent`,
    key: API_PATHS.CLIENT_STRIPE.CLIENT_STRIPE_KEY,

    onSuccess: async (res) => {
      try {
        const clientSecret = res.clientSecret;
        const cardElement = elements.getElement(CardElement);

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: shippingAddress,
          },
        });

        if (result?.error) {
          toast.error(result.error.message);
          return;
        }

        if (result?.paymentIntent?.status === "succeeded") {
          toast.success("✅Payment successful!");
          await api.post("/client/stripe/capture", {
            orderId,
            paymentIntentId: result.paymentIntent.id,
          });
          onPaymentSuccess?.();
        }
      } catch (error) {
        console.error(error);
        toast.error("Unexpected error while confirming payment");
      } finally {
        setIsProcessing(false);
      }
    },
    onError: (error) => {
      toast.error("Error processing payment");
      console.error(error);
    },
  });

  const handleStripeCardPayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    try {
      setIsProcessing(true);
      const orderPayload = {
        data: { orderId, amount },
      };
      stripeOrderMutation.mutate(orderPayload, {
        onSuccess: () => {},
        onError: () => {},
      });
    } catch (error) {
      console.error("Error in processing order!", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="">
      <form onSubmit={handleStripeCardPayment} className="space-y-4">
        <div className="p-3 border rounded border-base-content/20">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
        <Button
          type="submit"
          variant="indigo"
          className="w-full rounded-b-lg rounded-t-none border-b-none border-r-none border-r-none border-none hover:text-gray-300"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? <Loader /> : <LucideIcon.CreditCard />}
          {isProcessing
            ? "Processing..."
            : `Pay with Stripe $ ${(amount / 100).toFixed(2)}`}
        </Button>
      </form>
    </div>
  );
};

export default ClientStripePaymentForm;
