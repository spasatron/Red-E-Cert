import { useState } from "react";
import "./App.css";
import DropBoxQR from "./components/DropBoxQR";
import Homepage from "./components/Homepage";
import "./styles/print-styles.css";
import ImageUploadComponent from "./components/ImageUpload";

interface Cell {
  id: string;
  content: string;
  imageData: string | null;
}

const initial = Array.from({ length: 0 }, (_v, k) => k).map((k) => {
  const custom: Cell = {
    id: `id-${k}`,
    content: `Quote ${k}`,
    imageData: null,
  };

  return custom;
});

function App() {
  const [state, setState] = useState<{ cells: Cell[] }>({ cells: initial });

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

  return (
    <div className="to-print">
      <div className="print-grid">
        <div className="side-bar">
          <DropBoxQR />
          <ImageUploadComponent onImageUpload={loadImage} />
        </div>

        <Homepage state={state} setState={setState} />
      </div>
    </div>
  );
}

export default App;
