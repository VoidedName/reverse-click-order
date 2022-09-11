import React, {FC, PropsWithChildren, useEffect, useState} from 'react';
import './App.css';

const GridLayout: FC<PropsWithChildren> = ({children}) => <div className={'grid-layout'}>{children}</div>;
const GridRow: FC<PropsWithChildren> = ({children}) => <div className={'row'}>{children}</div>;
const EmptyCell: FC = () => <div className={'cell'} />;

type GridCellProps = {
  onClick?: () => void,
  marked?: boolean,
}
const GridCell: FC<GridCellProps> = ({onClick, marked}) => <div
  className={`cell simple-border ${marked ? 'clicked' : ''} ${onClick ? 'clickable' : ''}`}
  onClick={onClick}
/>;


function cellLabel(x: number, y: number) {
  return `${x},${y}`;
}

const isMarked = (x: number, y: number, marked: string[]) => marked.includes(cellLabel(x, y));

const ReversableButtonGrid: FC<{ grid: boolean[][], animationSpeed?: number }> = ({grid, animationSpeed = 250}) => {
  const [clickOrder, setClickOrder] = useState<string[]>([]); // "x,y" <- id shape
  const [playingBack, setPlayingBack] = useState(false);

  const markCell = (x: number, y: number) => setClickOrder(prev => isMarked(x, y, prev) ? prev : [...prev, cellLabel(x, y)]);
  const allCellsMarked = clickOrder.length >= grid.reduce((sum, row) => sum + row.filter(cell => cell).length, 0);

  useEffect(() => {
    if (allCellsMarked) {
      setPlayingBack(true);
    }
    if (clickOrder.length === 0) {
      setPlayingBack(false);
    }
  }, [allCellsMarked, clickOrder]);

  useEffect(() => {
    if (playingBack) {
      const timer = setTimeout(() => {
        setClickOrder(prev => prev.slice(1));
      }, animationSpeed);
      return () => clearTimeout(timer);
    }
  }, [playingBack, clickOrder, animationSpeed]);

  return (
    <GridLayout>
      {grid.map((row, y) =>
        <GridRow key={y}>
          {row.map((cell, x) => cell
            ? <GridCell
              key={x}
              marked={isMarked(x, y, clickOrder)}
              onClick={playingBack || isMarked(x, y, clickOrder) ? undefined : () => markCell(x,y)}
            />
            : <EmptyCell key={x} />
          )}
        </GridRow>)}
    </GridLayout>
  );
};

function App() {
  return <>
    <ReversableButtonGrid grid={[
      [true, true, true],
      [false, true, false],
      [true, true, true],
    ]} />
  </>;
}

export default App;
