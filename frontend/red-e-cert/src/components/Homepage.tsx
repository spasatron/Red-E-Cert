import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Grid from "./Grid";

interface Cell {
  id: string;
  content: string;
  imageData: string | null;
}

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

interface HomepageProps {
  state: { cells: Cell[] };
  setState: (state: { cells: Cell[] }) => void;
}

const Homepage: React.FC<HomepageProps> = ({ state, setState }) => {
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

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid imgInfoArr={state.cells} />
      </DragDropContext>
    </>
  );
};

export default Homepage;
