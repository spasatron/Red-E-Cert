import { useUser } from "../contexts/userContext";
import SignInModal from "./SignInModal";
import "../App.css";
import ImageUploadComponent from "./ImageUpload";
import { useState } from "react";
import { Cell } from "../interfaces/types";
import PrintButton from "./PrintButton";
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
            />
          </td>
        ));
      if (
        row == Math.min(numRows, maxRows) - 1 &&
        endIndex != entriesPerRow * maxRows
      ) {
        rowCells.push(
          <td key={"uploadComponent"}>
            <ImageUploadComponent
              onImageUpload={(dataURL: string | null) => {
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
        <style>
          {`
          .to-print {
            height: 100%;
            width: 100%;
            padding: 0;
          }
          

          table {
            width: 100%;
            max-height: 100%;
            table-layout: fixed;
            border: 5px dashed white;
            border-collapse: collapse;
          }
          thead {
            border: 5px solid white;
          }
          td {
            border: 5px solid white;
            border-collapse: collapse;
            width: 50%; /* For a 2xN table, each column should take 50% of the available width */
          }

          .cert-cell {
            padding: 10px;
          }

          .cert-wrapper {
            position: relative;
          }

          .cert-wrapper img {
            max-width: 100%;
            max-height: 100%;
          }

          .cert-edit-menu {
            display: none;
          }

          .cert-wrapper:hover .cert-edit-menu {
            display: block;
          }

          .cert-edit-menu {
            position: absolute;
            bottom: 0;
            right: 0;
          }

          .cert-move-menu {
            position: absolute;
            top: 0;
            left: 0;
          }

          .print-button{
            position: absolute;
            bottom: 1rem;
            left: 1rem;
            background-color: limegreen;
          }

          /*Page breaks for the printer*/
          @media print {
            .homepage-print {
              size: A4;
              /*margin: 1cm; /* Set page margins */
            }
            @page {
              size: landscape;
            }
            .hide-print {
              display: none;
            }
            table {
              width: 100%;
              max-height: 100%;
              table-layout: fixed;
              border: 5px dashed black;
              border-collapse: collapse;
            }
  
            td {
              border: 5px solid black;
              border-collapse: collapse;
              width: 50%; /* For a 2xN table, each column should take 50% of the available width */
            }
            thead {
              border: 5px dashed black; 
            }
            
          }`}
        </style>
        <table className="cert-page">
          <thead>
            <tr className="header">
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
          <tbody>{renderCerts()}</tbody>
        </table>
        <PrintButton />
      </div>
    );
  } else {
    return <SignInModal />;
  }
}

export default Homepage;
