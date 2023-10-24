import React from "react";
import "../App.css";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface Cell {
  id: string;
  content: string;
  imageData: string | null;
}

interface CellProps {
  cell: Cell;
  index: number;
}

interface GridProps {
  imgInfoArr: Cell[];
}

const Cell: React.FC<CellProps> = ({ cell, index }) => {
  return (
    <Draggable draggableId={cell.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="grid-cell"
        >
          {cell.imageData && (
            <img src={cell.imageData} alt="New Image" className="grid-cell" />
          )}
          {!cell.imageData && <h4>{cell.content}</h4>}
        </div>
      )}
    </Draggable>
  );
};

const Grid: React.FC<GridProps> = ({ imgInfoArr }) => {
  const numRows = 2;
  const increment = imgInfoArr.length > 4 ? 3 : 2;
  const gridTemplateColumnsValue = `repeat(${increment}, 1fr)`;
  const renderDroppables = () => {
    const droppables = [];

    for (let row = 0; row < numRows; row++) {
      const startIndex = row * increment;
      const endIndex = Math.min(startIndex + increment, imgInfoArr.length);
      const droppableId = `row${row}`;

      const cells = imgInfoArr
        .slice(startIndex, endIndex)
        .map((cell, index) => (
          <Cell cell={cell} index={startIndex + index} key={cell.id} />
        ));

      droppables.push(
        <Droppable
          key={droppableId}
          droppableId={droppableId}
          direction="horizontal"
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid-row"
              style={{ gridTemplateColumns: gridTemplateColumnsValue }}
            >
              {cells}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      );
    }
    return droppables;
  };

  return (
    <div className="grid-center">
      <div className="grid-container">{renderDroppables()}</div>
    </div>
  );
};

export default Grid;
