// googleOAuth.js
export const loadGoogleSDK = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

export const initializeGoogle = (clientId, callback) => {
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback,
  });
};
