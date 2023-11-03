import { useUser } from "../contexts/userContext";
import SignInModal from "./SignInModal";
import "../App.css";
import { DummyCert } from "../assets/example_cert";
import ImageUploadComponent from "./ImageUpload";
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

function Homepage() {
  const { user } = useUser();
  if (user) {
    return (
      <>
        <table className="cert-page">
          <tr className="header" style={{ border: "5px dashed white" }}>
            <th>
              <b>Name: </b>
              <span id="user-name">{user.name}</span>
            </th>
            <th>
              <b>E-mail: </b>
              <a id="user-email" href="mailto:{{email}}">
                {user.email}
              </a>
            </th>
            <th>
              <img width="75px" src={user.qr_src} />
            </th>
          </tr>
          <tr>
            {/*Certs go here*/}
            <td className="cert-cell">
              <div className="cert-wrapper">
                <img id="display-img" src={DummyCert} />
              </div>
            </td>
            <td>Test</td>
            <td>
              <ImageUploadComponent
                onImageUpload={(dataURL: string | null) => {
                  console.log(dataURL);
                }}
              />
            </td>
          </tr>
        </table>
      </>
    );
  } else {
    return <SignInModal />;
  }
}

export default Homepage;
