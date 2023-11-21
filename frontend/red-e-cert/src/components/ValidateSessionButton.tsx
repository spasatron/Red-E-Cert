import Cookies from "js-cookie";
import { useState } from "react";

async function checkSession(setState: (value: boolean | null) => void) {
  const response = await fetch(`/api/verify-session/`, {
    method: "GET",
    credentials: "include", // Include cookies in the request
    headers: {
      Authorization: "Bearer " + Cookies.get("authToken"), // Include the token as a Bearer token
      "Content-Type": "application/json", // Set the appropriate content type
      // Add other headers as needed
    },
  });
  const data = await response.json();
  setState(data);
}

function ValidateSessionButton() {
  const [verified, setVerified] = useState<boolean | null>(null);
  return (
    <>
      <button onClick={() => checkSession(setVerified)}>
        Validate Session
      </button>
      {verified === false && <h1>Session Not Validated</h1>}
      {verified === true && <h1>Session Validated</h1>}
    </>
  );
}

export default ValidateSessionButton;
