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
  Row,
  Config,
} from '../lib/Minesweeper';

interface BoardProps {
  config: Config;
}

const Board: FunctionComponent<BoardProps> = ({ config }) => {
  const [board, setBoard] = useState<Row[]>([]);

  useEffect(() => {
    const newBoard = createBoard(config);
    setBoard(newBoard);
  }, [config]);

  const onTileClick = (coords: Coords) => {
    const newBoard = clickTile(board, coords);
    setBoard(newBoard);
  };

  const onTileContextMenu = (coords: Coords) => {
    const newBoard = markTile(board, coords);
    setBoard(newBoard);
  };

  return (
    <BoardStyles config={config}>
      {board &&
        board.length > 0 &&
        board.map((row, i) =>
          row.map((tile, j) => (
            <TileComponent
              onTileClick={onTileClick}
              onTileContextMenu={onTileContextMenu}
              key={`${i}${j}`}
              tile={tile}
            />
          ))
        )}
    </BoardStyles>
  );
};

const BoardStyles = styled.div`
  display: grid;
  grid-template-columns: ${(props: { config: Config }) =>
    `repeat(${props.config.cols}, 30px)`};
  grid-template-rows: ${(props: { config: Config }) =>
    `repeat(${props.config.rows}, 30px)`};
  gap: 1px;
`;

export default Board;
