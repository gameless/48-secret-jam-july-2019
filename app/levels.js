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
level.tiles[2][1] = World.Tiles.WALL_RED;
level.tiles[2][2] = World.Tiles.WALL_RED;

levels.push(level);

export default levels;
