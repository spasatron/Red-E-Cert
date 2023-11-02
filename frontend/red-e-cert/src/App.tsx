import "./App.css";
import "./styles/print-styles.css";
import { UserProvider } from "./contexts/userContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Authenticate from "./components/Authenticate";

// const initial = Array.from({ length: 0 }, (_v, k) => k).map((k) => {
//   const custom: Cell = {
//     id: `id-${k}`,
//     content: `Quote ${k}`,
//     imageData: null,
//   };

//   return custom;
// });

/*
function App() {
  const [state, setState] = useState<{ cells: Cell[] }>({ cells: initial });
  const [isSignInModalOpen, setSignInModalOpen] = useState<boolean>(true);
  const nameRef = useRef<string>("");
  const emailRef = useRef<string>("");
  const authTokenRef = useRef<string>("");

  console.log("Rendering APP");
  const closeSignInModal = (name: string, email: string) => {
    nameRef.current = name;
    emailRef.current = email;
    setSignInModalOpen(false);
  };

  function loadImage(dataURL: string | null) {
    if (dataURL) {
      // Create a copy of the cells array
      const newCells = [...state.cells];

      newCells.push({
        id: `id-${newCells.length}`,
        content: `Quote ${newCells.length}`,
        imageData: dataURL,
      });

      // Update the content of the first cell
      setState({ cells: newCells });
      return;
    }
  }

  useEffect(() => {
    console.log("Auth token is set to " + authTokenRef.current);
    // Get the query string from the current URL
    const query = window.location.search;
    const searchParams = new URLSearchParams(query);

    // Check if the 'param' parameter is present in the query
    if (searchParams.has("state")) {
      const value = searchParams.get("state");
      if (value) {
        setSignInModalOpen(false);
        const userInfo = JSON.parse(decodeURIComponent(value));

        const name = userInfo.name;
        const email = userInfo.email;
        nameRef.current = name;
        emailRef.current = email;
        if (searchParams.has("code")) {
          // Get the value of the 'param' parameter
          const value = searchParams.get("code");
          if (value) {
            console.log(!authTokenRef.current);
            if (!authTokenRef.current) {
              console.log("Making POST Request");

              validateToken(value);
              authTokenRef.current = value;
            }
          }
        }
      }
    }
  }, []);

  return (
    <div>
      {isSignInModalOpen && <SignInModal onRequestClose={closeSignInModal} />}
      {!isSignInModalOpen && (
        <div className="to-print">
          <div className="print-grid">
            <div className="side-bar">
              {nameRef.current && <h1>{nameRef.current}</h1>}
              {emailRef.current && <h1>{emailRef.current}</h1>}
              <DropBoxQR />
              <ImageUploadComponent onImageUpload={loadImage} />
            </div>
            <Homepage state={state} setState={setState} />
          </div>
        </div>
      )}
    </div>
  );
}
*/

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/authenticate" element={<Authenticate />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
