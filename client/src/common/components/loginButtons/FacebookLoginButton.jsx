import axios from "axios";

export default function FacebookLoginButton() {
  const handleFBLogin = () => {
    FB.login(
      async (response) => {
        if (response.authResponse) {
          const { accessToken } = response.authResponse;

          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/gfAuth/oauth/facebook`,
              { token: accessToken },
              { withCredentials: true }
            );

            console.log("✅ FACEBOOK LOGIN SUCCESS", res.data);
          } catch (err) {
            console.error("❌ FACEBOOK LOGIN ERROR:", err);
          }
        } else {
          console.log("❌ Facebook login failed");
        }
      },
      { scope: "email,public_profile" }
    );
  };

  return (
    <button
      onClick={handleFBLogin}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Continue with Facebook
    </button>
  );
}
