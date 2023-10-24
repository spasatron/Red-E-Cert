import React, { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Grid from "./Grid";
import ImageUploadComponent from "./ImageUpload";

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

const reorder = (
  list: Cell[],
  startIndex: number,
  endIndex: number
): Cell[] => {
  const result: Cell[] = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Homepage: React.FC = () => {
  const [state, setState] = useState<{ cells: Cell[] }>({ cells: initial });

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const cells = reorder(
      state.cells,
      result.source.index,
      result.destination.index
    );

    setState({ cells });
  }

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
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid imgInfoArr={state.cells} />
      </DragDropContext>
      <ImageUploadComponent onImageUpload={loadImage} />
    </>
  );
};

export default Homepage;
