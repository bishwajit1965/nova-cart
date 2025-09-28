// facebookSdk.js
export const getFacebookAccessToken = async () => {
  return new Promise((resolve, reject) => {
    if (!window.FB) return reject("Facebook SDK not loaded");

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          resolve(response.authResponse.accessToken);
        } else {
          reject("Facebook login failed or cancelled");
        }
      },
      { scope: "public_profile,email" }
    );
  });
};

// Optional: Call this early if not done globally
export const initFacebookSDK = () => {
  if (window.FB) return;

  window.fbAsyncInit = function () {
    window.FB.init({
      appId: import.meta.env.VITE_FACEBOOK_APP_ID,
      cookie: true,
      xfbml: false,
      version: "v19.0",
    });
  };

  const script = document.createElement("script");
  script.src = "https://connect.facebook.net/en_US/sdk.js";
  script.async = true;
  script.defer = true;
  script.onerror = () => console.error("Failed to load Facebook SDK");
  document.body.appendChild(script);
};
