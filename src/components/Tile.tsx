import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Status, Tile } from '../lib/Minesweeper';

interface TileProps {
  tile: Tile;
  onTileClick: Function;
  onTileContextMenu: Function;
}

const TileComponent: FunctionComponent<TileProps> = ({
  tile,
  onTileClick,
  onTileContextMenu,
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
      }}
    >
      {tile.status === 'NUMBER' && tile.number !== 0 && (
        <span>{tile.number}</span>
      )}
    </TileStyles>
  );
};

export default TileComponent;

const getColorFromStatus = (status: Status) => {
  if (status === 'NUMBER') return '#bbbbbb';
  if (status === 'MARKED') return 'orange';
  if (status === 'MINE') return 'red';
  return '#686868';
};

const getColorFromNumber = (number: string) => (number ? 'blue' : 'red');

const TileStyles = styled.div<{ tile: TileProps }>`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props: any) =>
    getColorFromStatus(props.tile.tile.status)};
  user-select: none;
  cursor: ${(props: any) =>
    props.tile.tile.status === 'HIDDEN' ? 'pointer' : 'unset'};
  color: ${(props: any) => getColorFromNumber(props.tile.tile.number)};
  font-weight: bold;
  font-size: 1.2em;
`;
