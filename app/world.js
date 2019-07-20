import Colors from './colors';

const Tiles = {
  FLOOR: {
    isWall: false,
  },
};

Object.keys(Colors).forEach((color) => {
  Tiles[`WALL_${color}`] = {
    color: Colors[color],
    isWall: true,
  };
});

export { Tiles };

export const TILE_SIZE = 8;

export function colToX(col) {
  return col * TILE_SIZE;
}

export function rowToY(row) {
  return row * TILE_SIZE;
}

export function renderWallColor(color, filter) {
  if (!filter) return color;
  return color === filter ? color : Colors.BLACK;
}

export function isCollidable(color, filter) {
  return color !== filter;
}
