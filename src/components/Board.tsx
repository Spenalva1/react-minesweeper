/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import TileComponent from './Tile';
import {
  clickTile,
  Coords,
  createBoard,
  markTile,
  Config,
  Board as BoardType,
  BoardStatus,
} from '../lib/Minesweeper';

interface BoardProps {
  config: Config;
}

const Board: FunctionComponent<BoardProps> = ({ config }) => {
  const [game, setGame] = useState<{
    board: BoardType;
    status: BoardStatus;
    minesLeft: number;
  }>({
    board: [],
    status: 'PLAYING',
    minesLeft: 0,
  });

  useEffect(() => {
    setGame({ ...createBoard(config), minesLeft: config.mines });
  }, [config]);

  const onTileClick = (coords: Coords) => {
    if (game.status !== 'PLAYING') return;
    setGame({ ...game, ...clickTile(game.board, coords) });
  };

  const onTileContextMenu = (coords: Coords) => {
    if (game.status !== 'PLAYING') return;
    const { board: newBoard, event } = markTile(game.board, coords);
    if (event === 'NONE') return;
    let newMinesLeft = game.minesLeft;
    if (event === 'MARKED') {
      newMinesLeft--;
    } else {
      newMinesLeft++;
    }
    setGame({
      ...game,
      board: newBoard,
      minesLeft: newMinesLeft,
    });
  };

  const { board, minesLeft, status } = game;

  return (
    <div>
      <p>Mines left: {minesLeft}</p>
      <BoardStyles config={config}>
        {board &&
          board.length > 0 &&
          board.map((row, i) =>
            row.map((tile, j) => (
              <TileComponent
                key={`${i}${j}`}
                onTileClick={onTileClick}
                onTileContextMenu={onTileContextMenu}
                tile={tile}
                status={status}
              />
            ))
          )}
      </BoardStyles>
      {status === 'WON' && <h3>YOU WONNNNNNNNN</h3>}
      {status === 'LOST' && <h3>YOU LOSTTTTTTTTTT</h3>}
    </div>
  );
};

const BoardStyles = styled.div`
  display: grid;
  grid-template-columns: ${(props: { config: Config }) =>
    `repeat(${props.config.cols}, 24px)`};
  grid-template-rows: ${(props: { config: Config }) =>
    `repeat(${props.config.rows}, 24px)`};
`;

export default Board;
