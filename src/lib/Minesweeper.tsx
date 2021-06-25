/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */

export type Board = Row[];

export type BoardStatus = 'PLAYING' | 'WON' | 'LOST';

export type TileStatus =
  | 'HIDDEN'
  | 'MINE'
  | 'NUMBER'
  | 'MARKED'
  | 'WRONG'
  | 'LOOSER';

type Row = Tile[];

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
  status: TileStatus;
  isMine: boolean;
  coords: Coords;
}

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

export const createBoard = (
  config: Config
): { board: Board; status: BoardStatus } => {
  const minesPosition = getMinesPosition(config);
  const newBoard: Board = [];
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
  return { board: enumeratedBoard, status: 'PLAYING' };
};

export const clickTile = (
  board: Board,
  coords: Coords
): { board: Board; status: BoardStatus } => {
  const { x, y } = coords;

  if (board[x][y].status === 'NUMBER') {
    return clickNumber(board, coords);
  }

  if (board[x][y].status !== 'HIDDEN') return { board, status: 'PLAYING' };

  const newBoard = [...[...board]];

  if (newBoard[x][y].isMine) {
    newBoard[x][y].status = 'LOOSER';
    return { board: getLostBoard(newBoard), status: 'LOST' };
  }

  newBoard[x][y].status = 'NUMBER';

  if (newBoard[x][y].number === 0) {
    clickAdyacents(newBoard, coords);
  }

  return { board: newBoard, status: isBoardWon(newBoard) ? 'WON' : 'PLAYING' };
};

export const markTile = (
  board: Board,
  coords: Coords
): { board: Board; event: 'MARKED' | 'UNMARKED' | 'NONE' } => {
  const { x, y } = coords;
  if (board[x][y].status === 'NUMBER' || board[x][y].status === 'MINE')
    return { board, event: 'NONE' };
  const newBoard = [...[...board]];
  newBoard[x][y].status =
    newBoard[x][y].status === 'MARKED' ? 'HIDDEN' : 'MARKED';
  return {
    board: newBoard,
    event: newBoard[x][y].status === 'MARKED' ? 'MARKED' : 'UNMARKED',
  };
};

export const getWonBoard = (board: Board): Board =>
  board.map((row) =>
    row.map((tile) => ({
      ...tile,
      status: tile.isMine ? 'MARKED' : tile.status,
    }))
  );

export const getLostBoard = (board: Board): Board =>
  board.map((row) =>
    row.map((tile) => ({
      ...tile,
      status: getLostTileStatus(tile),
    }))
  );

const getLostTileStatus = (tile: Tile): TileStatus => {
  if (tile.isMine) {
    return tile.status !== 'LOOSER' && tile.status !== 'MARKED'
      ? 'MINE'
      : tile.status;
  }
  if (tile.status === 'MARKED') {
    return 'WRONG';
  }
  return tile.status;
};

const clickNumber = (
  board: Board,
  coords: Coords
): { board: Board; status: BoardStatus } => {
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
    const status = clickAdyacents(newBoard, coords);

    if (status === 'LOST') {
      return {
        board: getLostBoard(newBoard),
        status: 'LOST',
      };
    }

    return {
      board: newBoard,
      status: isBoardWon(newBoard) ? 'WON' : 'PLAYING',
    };
  }
  return { board, status: isBoardWon(board) ? 'WON' : 'PLAYING' };
};

const clickAdyacents = (board: Board, coords: Coords): BoardStatus => {
  let status: BoardStatus = 'PLAYING';
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
            board[x][y].status = 'LOOSER';
            status = 'LOST';
          } else {
            board[x][y].status = 'NUMBER';
            if (board[x][y].number === 0) {
              status = clickAdyacents(board, { x, y });
            }
          }
        }
      }
    }
  }
  return status;
};

const enumerateTile = (board: Board, coords: Coords) => {
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

const enumerateBoard = (board: Board) => {
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

const isBoardWon = (board: Board): boolean =>
  board.every((row) =>
    row.every((tile) => tile.status === 'NUMBER' || tile.isMine)
  );

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
