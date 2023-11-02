import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import Cookies from "js-cookie";
import { useEffect } from "react";

function Authenticate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateUser } = useUser();

  useEffect(() => {
    const authenticateUser = async () => {
      // Extract the authentication code from the query parameters
      const searchParams = new URLSearchParams(location.search);
      const authCode = searchParams.get("code");
      const state = searchParams.get("state");

      if (authCode && state) {
        const userInfo = JSON.parse(decodeURIComponent(state));

        const response = await fetch(
          `http://127.0.0.1:8000/create-dropbox-session/${authCode}`,
          { method: "POST" }
        );
        const token = await response.json();
        console.log(token);
        Cookies.set("authToken", token, { expires: 1 / 48 });
        // Send a request to your backend to validate the authentication code
        // and retrieve user information
        // Update the authentication state in your app with the user's information
        const authenticatedUser = {
          name: userInfo.name,
          email: userInfo.email,
        };
        updateUser(authenticatedUser);
        navigate("/");
      }

      // Redirect the user to the homepage
    };
    try {
      authenticateUser();
    } catch (error) {
      console.log(error);
    }
    //navigate("/");
  }, [location, history]);

  return <h1>Waiting To Authenticate</h1>;
}

export default Authenticate;
