import Colors from '../colors';
import Levels from '../levels';
import * as World from '../world';

export default class extends Phaser.State {
  create() {
    this.stage.backgroundColor = '#683f09';
    this.game.add.image(0, 0, 'insect');

    this.tileGraphics = this.game.add.graphics(0, 0);

    this.level = Levels[0]; // eslint-disable-line
    this.filter = Colors.YELLOW;
    this.renderLevel();
  }

  renderLevel() {
    this.stage.backgroundColor = this.filter;
    const tiles = this.level.tiles;
    const wallsByColor = {};
    Object.values(Colors).forEach((color) => {
      wallsByColor[color] = [];
    });
    for (let r = 0; r < tiles.length; r += 1) {
      for (let c = 0; c < tiles[r].length; c += 1) {
        if (tiles[r][c].isWall) {
          wallsByColor[tiles[r][c].color].push({ r, c });
        }
      }
    }

    const graphics = this.tileGraphics;

    Object.values(Colors).forEach((color) => {
      graphics.beginFill(World.renderWallColor(color, this.filter));
      wallsByColor[color].forEach(({ r, c }) => {
        graphics.drawRect(World.colToX(c), World.rowToY(r), World.TILE_SIZE, World.TILE_SIZE);
      });
      graphics.endFill();
    });
  }
}
