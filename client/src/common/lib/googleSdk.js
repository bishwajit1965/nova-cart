let codeClient;

export const initializeGoogleSDK = () => {
  if (document.getElementById("google-client-sdk")) return;

  const script = document.createElement("script");
  script.id = "google-client-sdk";
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;

  script.onload = () => {
    if (window.google) {
      codeClient = window.google.accounts.oauth2.initCodeClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "openid email profile",
        ux_mode: "popup",
        redirect_uri: "postmessage", // This is key to get `code` back in frontend
        callback: (response) => {
          // Will be overwritten in getGoogleIdToken()
        },
      });
    } else {
      console.error("❌ Google SDK loaded but window.google is undefined");
    }
  };

  document.body.appendChild(script);
};

export const getGoogleIdToken = () => {
  return new Promise((resolve, reject) => {
    if (!codeClient) {
      return reject(new Error("Google SDK not initialized"));
    }

    codeClient.callback = async (response) => {
      const code = response.code;

      if (!code) return reject(new Error("Authorization code missing"));

      try {
        // Exchange code for ID token in backend
        const res = await fetch(
          "http://localhost:3000/api/auth/oauth/google-signup",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          return reject(new Error(data.message || "Google sign-up failed"));
        }

        resolve(data);
      } catch (err) {
        reject(err);
      }
    };

    codeClient.requestCode();
  });
};
