import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./common/providers/AuthProvider.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import { loadStripe } from "@stripe/stripe-js";
import router from "./admin/routes/Routes.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Create a client instance
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Elements stripe={stripePromise}>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#6a5acd",
                color: "#fff",
              },
            }}
            reverseOrder={false}
          />
        </Elements>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
