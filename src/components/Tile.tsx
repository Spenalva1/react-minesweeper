import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { TileStatus, Tile, BoardStatus } from '../lib/Minesweeper';

interface TileProps {
  tile: Tile;
  onTileClick: Function;
  onTileContextMenu: Function;
  status: BoardStatus;
}

const TileComponent: FunctionComponent<TileProps> = ({
  tile,
  onTileClick,
  onTileContextMenu,
  status,
}) => {
  const onContextMenu = (e: any) => {
    e.preventDefault();
    onTileContextMenu(tile.coords);
  };
  const onClick = () => {
    onTileClick(tile.coords);
  };
  return (
    <TileStyles
      onContextMenu={onContextMenu}
      onClick={onClick}
      tile={{
        tile,
        onTileClick,
        onTileContextMenu,
        status,
      }}
    >
      {tile.status === 'NUMBER' && tile.number !== 0 && (
        <span>{tile.number}</span>
      )}
    </TileStyles>
  );
};

export default TileComponent;

const getColorFromStatus = (status: TileStatus) => {
  if (status === 'NUMBER') return '#bbbbbb';
  if (status === 'MARKED') return 'orange';
  if (status === 'MINE') return 'red';
  return '#686868';
};

const getColorFromNumber = (n: number) => {
  if (n === 1) return 'blue';
  if (n === 2) return 'green';
  if (n === 3) return 'red';
  if (n === 4) return 'purple';
  if (n === 5) return 'maroon';
  if (n === 6) return 'turquoise';
  if (n === 7) return 'black';
  if (n === 8) return 'gray';
};

const TileStyles = styled.div<{ tile: TileProps }>`
  height: 100%;
  width: 100%;
  line-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props: any) =>
    getColorFromStatus(props.tile.tile.status)};
  user-select: none;
  cursor: ${(props: any) =>
    props.tile.tile.status === 'HIDDEN' && props.tile.status === 'PLAYING'
      ? 'pointer'
      : 'unset'};
  color: ${(props: any) => getColorFromNumber(props.tile.tile.number)};
  font-weight: bold;
  font-size: 1.2em;
  border: 1px solid black;
`;
