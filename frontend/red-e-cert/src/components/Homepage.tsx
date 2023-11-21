import { useUser } from "../contexts/userContext";
import SignInModal from "./SignInModal";
import "../App.css";
import ImageUploadComponent from "./ImageUpload";
import { useState } from "react";
import { Cell } from "../interfaces/types";
import PrintButton from "./PrintButton";
import { ToastContainer } from "react-toastify";
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
  const [cellState, setCellState] = useState<Cell[]>([]);

  const renderCerts = () => {
    const numRows = cellState?.length
      ? Math.ceil((cellState.length + 1) / 3)
      : 1;
    const maxRows = 2;
    const entriesPerRow = 3;
    const rendered_cells: JSX.Element[] = [];
    for (let row = 0; row < Math.min(numRows, maxRows); row++) {
      const startIndex = row * entriesPerRow;
      const endIndex = Math.min(
        startIndex + entriesPerRow,
        cellState?.length ? cellState.length : 1
      );
      const rowCells = cellState
        .slice(startIndex, endIndex)
        .map((cell, index) => (
          <td key={index + row} className="cert-wrapper">
            <img
              className="cell-img"
              src={cell.imageData ? cell.imageData : ""}
              alt="Failed To Load"
            />
          </td>
        ));
      if (
        row == Math.min(numRows, maxRows) - 1 &&
        endIndex != entriesPerRow * maxRows
      ) {
        rowCells.push(
          <td
            key={"uploadComponent"}
            className="remove-in-render"
            style={{ border: "5px dashed white" }}
          >
            <ImageUploadComponent
              setImageData={(dataURL: string | null) => {
                const newCellState = [...cellState];
                newCellState.push({
                  id: "test",
                  content: "image",
                  imageData: dataURL,
                });
                setCellState(newCellState);
              }}
            />
          </td>
        );
      }
      rendered_cells.push(<tr key={row + "rowid"}>{rowCells}</tr>);
    }

    return rendered_cells;
  };

  if (user) {
    return (
      <div className="homepage-print">
        {
          <style>
            {`
            .homepage-print {
              position: absolute;
              height: 100vh;
              width: 100vw;
            }

            .cert-page {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              /*border: 5px dashed white;*/
              border-collapse: collapse;
              box-sizing: border-box;

            }

            .cert-header {
              box-sizing: border-box;
              display: flex;
              width: 100%;
              height: 8%;
            }

            .cert-header > tr {
              display: flex;
              box-sizing: border-box;
              border: 5px solid white;
              height: 100%;
              width: 100%;
            }

            .cert-header > tr > th {
              flex: 1;
              width: 33vw;
              box-sizing: border-box;
              position: relative;
              display: flex;
              align-items: center; /* Vertical centering */
              justify-content: center; /* Horizontal centering */
            }

            .cert-grid {
              display: flex;
              flex-direction: column;
              box-sizing: border-box;
              width: 100%;
              height: 92%; /* Allocate 90% of the available height to .cert-grid */
            }

            .cert-grid > tr {
              display: flex;
              height: 50%;
              width: 100vw;
            }

            .cert-grid > tr > td {
              flex: 1;
              width: 33.33%;
              box-sizing: border-box;
              border: 5px solid white;
              position: relative;
            }


            .cert-grid > tr > td img {
              max-width: 98%;
              max-height: 98%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }

            .center{
              height: 100%;
              display: flex;
              align-items: center; /* Vertical centering */
              justify-content: center; /* Horizontal centering */
            }

            @media print {
              .homepage-print {
                size: A4;

              }
              @page {
                size: landscape;
              }
              .hide-print {
                display: none;
              }
          }`}
          </style>
        }
        <table className="cert-page">
          <thead className="cert-header">
            <tr>
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
          </thead>
          <tbody className="cert-grid">{renderCerts()}</tbody>
        </table>
        <ToastContainer
          className="hide-print"
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <PrintButton />
      </div>
    );
  } else {
    return <SignInModal />;
  }
}

export default Homepage;
