/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
export type Status = 'HIDDEN' | 'MINE' | 'NUMBER' | 'MARKED';

export interface Config {
  rows: number;
  cols: number;
  mines: number;
}

export interface Coords {
  x: number;
  y: number;
}

export interface Tile {
  number: number;
  status: Status;
  isMine: boolean;
  coords: Coords;
}

export type Row = Tile[];

export const levelsConfig = {
  beginner: {
    rows: 8,
    cols: 8,
    mines: 10,
  },
  intermediate: {
    rows: 16,
    cols: 16,
    mines: 40,
  },
  expert: {
    rows: 16,
    cols: 30,
    mines: 99,
  },
};

export const createBoard = (config: Config) => {
  const minesPosition = getMinesPosition(config);
  const newBoard: Row[] = [];
  let row: Row;
  for (let i = 0; i < config.rows; i++) {
    row = [];
    for (let j = 0; j < config.cols; j++) {
      row.push({
        status: 'HIDDEN',
        number: 0,
        coords: { x: i, y: j },
        isMine: false,
      });
    }
    newBoard.push(row);
  }
  minesPosition.forEach((position) => {
    newBoard[position.x][position.y].isMine = true;
  });
  const enumeratedBoard = enumerateBoard(newBoard);
  return enumeratedBoard;
};

export const clickTile = (board: Row[], coords: Coords) => {
  const { x, y } = coords;
  if (board[x][y].status === 'NUMBER') {
    return clickNumber(board, coords);
  }
  if (board[x][y].status !== 'HIDDEN') return board;
  const newBoard = [...[...board]];
  newBoard[x][y].status = newBoard[x][y].isMine ? 'MINE' : 'NUMBER';
  if (newBoard[x][y].number === 0 && newBoard[x][y].status === 'NUMBER') {
    clickAdyacents(newBoard, coords);
  }
  return newBoard;
};

export const markTile = (board: Row[], coords: Coords) => {
  const { x, y } = coords;
  if (board[x][y].status === 'NUMBER' || board[x][y].status === 'MINE')
    return board;
  const newBoard = [...[...board]];
  newBoard[x][y].status =
    newBoard[x][y].status === 'MARKED' ? 'HIDDEN' : 'MARKED';
  return newBoard;
};

const clickNumber = (board: Row[], coords: Coords) => {
  let tilesMarked = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const x = coords.x + i;
      const y = coords.y + j;
      if (
        validPosition(x, y, board.length, board[0].length) &&
        !(i === 0 && j === 0)
      ) {
        if (board[x][y].status === 'MARKED') {
          tilesMarked++;
        }
      }
    }
  }
  if (tilesMarked === board[coords.x][coords.y].number) {
    const newBoard = [...[...board]];
    clickAdyacents(newBoard, coords);
    return newBoard;
  }
  return board;
};

const clickAdyacents = (board: Row[], coords: Coords) => {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const x = coords.x + i;
      const y = coords.y + j;
      if (
        validPosition(x, y, board.length, board[0].length) &&
        !(i === 0 && j === 0)
      ) {
        if (board[x][y].status === 'HIDDEN') {
          if (board[x][y].isMine) {
            board[x][y].status = 'MINE';
          } else {
            board[x][y].status = 'NUMBER';
            if (board[x][y].number === 0) {
              clickAdyacents(board, { x, y });
            }
          }
        }
      }
    }
  }
};

const enumerateTile = (board: Row[], coords: Coords) => {
  let number = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (
        validPosition(coords.x + i, coords.y + j, board.length, board[0].length)
      ) {
        if (board[coords.x + i][coords.y + j].isMine) number++;
      }
    }
  }
  return number;
};

const enumerateBoard = (board: Row[]) => {
  const newBoard = [...[...board]];
  const enumeratedBoard = newBoard.map((row) => {
    const enumeratedRow = row.map((tile) => {
      if (tile.isMine) return tile;
      return {
        ...tile,
        number: enumerateTile(newBoard, tile.coords),
      };
    });
    return enumeratedRow;
  });
  return enumeratedBoard;
};

const getMinesPosition = ({ rows, cols, mines }: Config) => {
  const minesPosition: Coords[] = [];
  let coords: Coords;
  while (minesPosition.length < mines) {
    coords = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    if (validMine(minesPosition, coords)) minesPosition.push(coords);
  }
  return minesPosition;
};

const validMine = (mines: Coords[], mine: Coords) =>
  !mines.some((a) => positionsMatch(a, mine));

const positionsMatch = (a: Coords, b: Coords) => a.x === b.x && a.y === b.y;

const validPosition = (x: number, y: number, xmax: number, ymax: number) =>
  x >= 0 && x < xmax && y >= 0 && y < ymax;
