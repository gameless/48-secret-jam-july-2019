import * as World from './world';

const levels = [];

const level = {};
level.tiles = [];
for (let r = 0; r < 20; r += 1) {
  const row = [];
  for (let c = 0; c < 30; c += 1) {
    row.push(World.Tiles.FLOOR);
  }
  level.tiles.push(row);
}
level.tiles[11][11] = World.Tiles.WALL_RED;
level.tiles[11][12] = World.Tiles.WALL_RED;
level.tiles[11][13] = World.Tiles.WALL_BLACK;
level.tiles[11][14] = World.Tiles.WALL_BLACK;
level.tiles[12][11] = World.Tiles.WALL_BLUE;
level.tiles[12][12] = World.Tiles.WALL_BLUE;
level.tiles[12][13] = World.Tiles.WALL_YELLOW;
level.tiles[12][14] = World.Tiles.WALL_YELLOW;
level.tiles[13][11] = World.Tiles.WALL_BLACK;
level.tiles[13][12] = World.Tiles.WALL_BLACK;
level.tiles[13][13] = World.Tiles.WALL_BLACK;
level.tiles[13][14] = World.Tiles.WALL_BLACK;

levels.push(level);

export { levels as default };
