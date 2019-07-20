import * as World from './world';

const levels = [];

const level = {};
level.tiles = [];
for (let r = 0; r < 10; r += 1) {
  const row = [];
  for (let c = 0; c < 10; c += 1) {
    row.push(World.Tiles.FLOOR);
  }
  level.tiles.push(row);
}
level.tiles[1][1] = World.Tiles.WALL_RED;
level.tiles[1][2] = World.Tiles.WALL_RED;
level.tiles[1][3] = World.Tiles.WALL_BLACK;
level.tiles[1][4] = World.Tiles.WALL_BLACK;
level.tiles[2][1] = World.Tiles.WALL_BLUE;
level.tiles[2][2] = World.Tiles.WALL_BLUE;
level.tiles[2][3] = World.Tiles.WALL_YELLOW;
level.tiles[2][4] = World.Tiles.WALL_YELLOW;
level.tiles[3][1] = World.Tiles.WALL_BLACK;
level.tiles[3][2] = World.Tiles.WALL_BLACK;
level.tiles[3][3] = World.Tiles.WALL_BLACK;
level.tiles[3][4] = World.Tiles.WALL_BLACK;

levels.push(level);

export default levels;
