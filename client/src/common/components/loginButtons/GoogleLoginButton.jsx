import { useEffect, useRef } from "react";
import axios from "axios";

const GoogleLoginButton = () => {
  const googleButton = useRef(null);

  const handleCredential = async (response) => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/gfAuth/oauth/google`,
        { token: response.credential },
        { withCredentials: true }
      );

      console.log("✅ Google Login Success:", result.data);

      // save access token + user
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      window.location.reload();
    } catch (err) {
      console.error("❌ Google Login Error:", err.response?.data || err);
    }
  };

  useEffect(() => {
    /* global google */
    if (!window.google || !google.accounts) return;

    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredential,
    });

    google.accounts.id.renderButton(googleButton.current, {
      theme: "outline",
      size: "large",
      width: 260,
    });
  }, []);

  return <div ref={googleButton}></div>;
};

export default GoogleLoginButton;
