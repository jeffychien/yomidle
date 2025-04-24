'use client';
 
import { FormEvent, useRef, useState } from 'react';
 
enum CellState {
  UNANSWERED,
  CORRECT,
  INCORRECT
};

enum GameState {
  UNDECIDED,
  WON,
  UNWINNABLE
};

type Word = {
  kanji: string;
  yomis: string[];
};

type Cell = {
  word: Word;
  answer: string;
  state: CellState;
  alternativeYomis: string[];
};

const RowsColumnsAndDiagonals = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function Game({date, words} : { date : string, words : Word[] }) {
  const savedCells = localStorage.getItem(date);
  const [cells, setCells] = useState(
    savedCells
      ? JSON.parse(savedCells) as Cell[]
      : words.map((word) => ({
        word,
        answer: "",
        state: CellState.UNANSWERED,
        alternativeYomis: [] as string[]
      }))
  );

  const getGameState = (newCells : Cell[]) => {
    let winnableLines = 0;
    for (const line of RowsColumnsAndDiagonals) {
      let isLineAllCorrect = true;
      let isLineWinnable = true;
      for (const index of line) {
        isLineAllCorrect = isLineAllCorrect && newCells[index].state === CellState.CORRECT;
        isLineWinnable = isLineWinnable && newCells[index].state !== CellState.INCORRECT;
      }
      if (isLineAllCorrect) {
        return GameState.WON;
      }
      if (isLineWinnable) {
        winnableLines++;
      }
    }
    return winnableLines ? GameState.UNDECIDED : GameState.UNWINNABLE;
  };
  const checkGameState = (newCells : Cell[]) => {
    if (gameState === GameState.UNDECIDED) {
      setGameState(getGameState(newCells));
    }
  };
  const [gameState, setGameState] = useState(getGameState(cells));

  const mutateCell = (index : number, fn: (cell : Cell) => Cell) => {
    const newCells = [...cells];
    const newCell = fn({...newCells[index]});
    newCells[index] = newCell;
    return newCells;
  };

  // Used for changing focus to the next unanswered cell.
  const inputRefs = useRef(words.map(() => null) as (HTMLInputElement | null)[]);
  const focusOnNextUnansweredCell = (newCells : Cell[], index : number) => {
    for(let i = index + 1; i < newCells.length; i++) {
      if (newCells[i].state === CellState.UNANSWERED) {
        inputRefs.current[i]?.focus();
        return;
      }
    }
    for(let i = 0 ; i < index; i++) {
      if (newCells[i].state === CellState.UNANSWERED) {
        inputRefs.current[i]?.focus();
        return;
      }
    }
  };
  const checkWord = (e : FormEvent, index : number) => {
    const newCells = mutateCell(index, (cell) => {
      const normalized = cell.answer.trim().toLowerCase();
      const answerIndex = cell.word.yomis.indexOf(normalized);
      cell.state = answerIndex !== -1 ? CellState.CORRECT : CellState.INCORRECT;
      if (answerIndex !== -1) {
        cell.alternativeYomis = cell.word.yomis.filter((_, index) => index !== answerIndex);
      }
      return cell;
    });
    setCells(newCells);
    checkGameState(newCells);
    focusOnNextUnansweredCell(newCells, index);
    localStorage.setItem(date, JSON.stringify(newCells));

    e.preventDefault();
    return false;
  };
  const changeAnswer = (index : number, newAnswer : string) => {
    setCells(mutateCell(index, (cell) => {
      cell.answer = newAnswer;
      return cell;
    }));
  };
  
  return (
    <>
      <main>
        {gameState !== GameState.UNDECIDED &&
          <h2 className="text-4xl mb-10 text-center">
            {gameState === GameState.WON ? "Congratulations!" : "Better luck next time..."}
          </h2>
        }
        <div className="grid grid-cols-3 gap-[8px] row-start-2 items-center sm:items-start text-black text-center">
        {cells.map((cell, index) =>
          <div key={cell.word.kanji}
            className={"rounded-lg p-4 " +
                (cell.state == CellState.UNANSWERED ? "bg-gray-300": (
                  cell.state == CellState.CORRECT ? "bg-green-300" : "bg-red-300"
                ))}>
              <span className="text-2xl font-bold">
                {cell.state == CellState.UNANSWERED
                  ? cell.word.kanji
                  : <a href={`https://jisho.org/search/${cell.word.kanji}`} target="_blank"
                      className="text-blue-700 underline">{cell.word.kanji}</a>
                }
              </span>
              {cell.state == CellState.UNANSWERED &&
                <form onSubmit={e => checkWord(e, index)}>
                  <input type="text"
                    ref={(element) => { inputRefs.current[index] = element }}
                    value={cell.answer}
                    onChange={e => changeAnswer(index, e.target.value)}
                    className="text-black bg-white mt-4 mb-3"
                    autoFocus />
                </form>
              }
              {cell.state == CellState.CORRECT &&
                <>
                  <div className="text-lg">
                    {cell.answer}
                  </div>
                  {!!cell.alternativeYomis.length &&
                    <div>Also accepted: {cell.alternativeYomis.join(", ")}
                    </div>
                  }
                </>
              }
              {cell.state == CellState.INCORRECT &&
                <>
                  <div className="text-lg line-through">
                    {cell.answer}
                  </div>
                  <div>Answers: {cell.word.yomis.join(", ")}
                  </div>
                </>
              }
          </div>
        )}
        </div>
      </main>
    </>
  )
}
