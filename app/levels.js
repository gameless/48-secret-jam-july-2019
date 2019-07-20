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
level.tiles[7][1] = World.Tiles.WALL_RED;
level.tiles[7][2] = World.Tiles.WALL_RED;
level.tiles[8][1] = World.Tiles.WALL_RED;
level.tiles[8][2] = World.Tiles.WALL_RED;

levels.push(level);

export default levels;
