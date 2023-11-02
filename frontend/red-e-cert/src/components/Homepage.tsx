import { useUser } from "../contexts/userContext";
import SignInModal from "./SignInModal";
import Cookies from "js-cookie";
// const reorder = (
//   list: Cell[],
//   startIndex: number,
//   endIndex: number
// ): Cell[] => {
//   const result: Cell[] = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);

//   return result;
// };

// interface HomepageProps {
//   state: { cells: Cell[] };
//   setState: (state: { cells: Cell[] }) => void;
// }

// const Homepage: React.FC<HomepageProps> = ({ state, setState }) => {
//   function onDragEnd(result: DropResult) {
//     if (!result.destination) {
//       return;
//     }

//     if (result.destination.index === result.source.index) {
//       return;
//     }

//     const cells = reorder(
//       state.cells,
//       result.source.index,
//       result.destination.index
//     );

//     setState({ cells });
//   }

//   return (
//     <>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Grid imgInfoArr={state.cells} />
//       </DragDropContext>
//     </>
//   );
// };
async function checkSession() {
  const response = await fetch(`http://localhost:8000/verify-session/`, {
    method: "GET",
    credentials: "include", // Include cookies in the request
    headers: {
      Authorization: "Bearer " + Cookies.get("authToken"), // Include the token as a Bearer token
      "Content-Type": "application/json", // Set the appropriate content type
      // Add other headers as needed
    },
  });
  const data = await response.json();
  console.log(data);
}

function Homepage() {
  const { user } = useUser();
  if (user) {
    return (
      <div>
        <h1>User Authenticated {user.name} Recognized</h1>
        <button onClick={checkSession}></button>
      </div>
    );
  } else {
    return <SignInModal />;
  }
}

export default Homepage;
