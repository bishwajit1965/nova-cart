// googleAuth.js

export const getGoogleIdToken = () => {
  return new Promise((resolve, reject) => {
    if (!window.google) return reject("Google API not loaded");

    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      redirect_uri: window.location.origin, // or your API route
      callback: (response) => {
        if (response.code) {
          resolve(response.code); // 🔑 Authorization Code
        } else {
          reject(response);
        }
      },
    });

    client.requestCode();
  });
};
