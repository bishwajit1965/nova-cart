import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "./common/providers/AuthProvider.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import SystemSettingsProvider from "./common/providers/SystemSettingsProvider.jsx";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import { loadStripe } from "@stripe/stripe-js";
import router from "./admin/routes/Routes.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Create a client instance
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <SystemSettingsProvider>
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
          </SystemSettingsProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </AuthProvider>
  </StrictMode>
);
