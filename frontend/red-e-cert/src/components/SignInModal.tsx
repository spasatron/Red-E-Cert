import { MouseEventHandler, useState } from "react";
import { useUser } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

function SignInModal() {
  const { updateUser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleSignInDropBox: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    // Early Development TODO Remove
    console.log(import.meta.env.VITE_SIGNIN_DROPBOX_REDIRECT_URI);
    const client_id = encodeURIComponent("b8iisj0jc2bo1pe");
    const redirect_uri = encodeURIComponent(
      import.meta.env.VITE_SIGNIN_DROPBOX_REDIRECT_URI ||
        "http://localhost:8080/authenticate"
    );
    const userInfo = {
      name: name,
      email: email,
    };
    const state = encodeURIComponent(JSON.stringify(userInfo));
    window.location.href = `https://www.dropbox.com/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&state=${state}`;
    // Add your sign-in logic here
    // You can make an API call to authenticate the user
  };

  return (
    <div className="signin-modal-wrapper">
      <div className="signin-modal">
        <h2>Sign In</h2>
        <form>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" onClick={handleSignInDropBox}>
              DropBox
            </button>
            <button
              type="submit"
              onClick={() => {
                const authenticatedUser = {
                  name: name,
                  email: email,
                  qr_src: "",
                };
                updateUser(authenticatedUser);
                navigate("/");
              }}
            >
              Quick Print
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignInModal;
