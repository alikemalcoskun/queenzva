import clsx from "clsx";
import { differenceInMinutes, differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";
import {
  M,
  N,
  precalculateValidQueensPositions,
  prepareQueensBoard,
  VALID_QUEENS_POSITIONS,
} from "./board-util";
import { InzvaQueen } from "./inzva-queen";
import { seed } from "./random";

precalculateValidQueensPositions();

function isInDanger(
  row: number,
  col: number,
  queenInserted: Record<number, string>
) {
  const sameRowCol = Object.entries(queenInserted).some(([key, value]) => {
    const i = Math.floor(+key / N);
    const j = +key % M;
    return value === "q" && (i === row || j === col);
  });
  // queen in one in 8 neighbors
  // copilot ate it copilot is so hungry
  const neighbor = Object.entries(queenInserted).some(([key, value]) => {
    const i = Math.floor(+key / N);
    const j = +key % M;
    return value === "q" && Math.abs(i - row) === 1 && Math.abs(j - col) === 1;
  });
  return sameRowCol || neighbor;
}

const VALID_QUEENS_POSITIONS_INTEGERS = VALID_QUEENS_POSITIONS.map(
  (positionList) => positionList.map((position) => position.x * N + position.y)
).map((x) => x.sort().join());

function App() {
  const [board] = useState(() => prepareQueensBoard());
  const [queenInserted, setQueenInserted] = useState<Record<number, string>>(
    {}
  );
  const [startTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  const won = VALID_QUEENS_POSITIONS_INTEGERS.includes(
    Object.keys(queenInserted)
      .filter((e) => queenInserted[e] === "q")
      .sort()
      .join()
  );
  useEffect(() => {
    if (won) return;
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [won]);

  // check if queenInserted is in VALID_QUEENS_POSITIONS
  // write this check's code
  if (won) {
    console.log("You win!");
  }

  const onClear = () => {
    setQueenInserted({});
  };

  return (
    <div className="flex justify-center items-center h-screen font-mono flex-col gap-2">
      <div className="text-4xl">{seed}</div>
      <button
        onClick={onClear}
        className="text-xl bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
      >
        Clear
      </button>
      <div className="text-4xl">
        {differenceInMinutes(currentTime, startTime)
          .toString()
          .padStart(2, "0")}
        :
        {(differenceInSeconds(currentTime, startTime) % 60)
          .toString()
          .padStart(2, "0")}
      </div>
      <div className={`inline-grid ${N === 8 ? "grid-cols-8" : "grid-cols-9"}`}>
        {board.map((row, i) => (
          <div
            key={i}
            className="grid"
          >
            {row.map((cellColor, j) => (
              <div
                key={j}
                className={clsx(
                  "flex select-none justify-center items-center h-12 w-12 text-2xl cursor-pointer border border-black p-3"
                )}
                style={{
                  background:
                    !won || queenInserted[N * i + j] !== "q"
                      ? cellColor
                      : "gold",
                }}
                onClick={() =>
                  setQueenInserted((prev) => ({
                    ...prev,
                    [N * i + j]:
                      (prev[N * i + j] || "") === ""
                        ? "x"
                        : prev[N * i + j] === "x"
                        ? "q"
                        : "",
                  }))
                }
              >
                {queenInserted[N * i + j] === "q" ? (
                  <InzvaQueen won={won} />
                ) : isInDanger(i, j, queenInserted) ? (
                  "x"
                ) : (
                  queenInserted[N * i + j]
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
