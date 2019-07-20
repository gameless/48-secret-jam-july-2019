import Colors from '../colors';
import Levels from '../levels';
import * as World from '../world';

export default class extends Phaser.State {
  makeMovable(x, y, key) {
    const image = this.game.add.sprite(x, y, key);
    const blank = this.game.add.sprite(x, y, 'blank');
    blank.width = image.width;
    blank.height = image.height;

    this.game.physics.arcade.enable(blank);
    blank.body.collideWorldBounds = true;
    this.collisionGroup.add(blank);

    const movable = { body: blank, draw: image };
    this.movables.push(movable);
    return movable;
  }

  updateMovables() {
    this.movables.forEach((movable) => {
      movable.draw.x = Math.round(movable.body.x);
      movable.draw.y = Math.round(movable.body.y);
    });
  }

  create() {
    this.stage.backgroundColor = '#683f09';

    this.tileGraphics = this.game.add.graphics(0, 0);

    this.level = Levels[0]; // eslint-disable-line
    this.filter = Colors.YELLOW;
    this.renderLevel();

    this.collisionGroup = this.game.add.group();
    this.movables = [];
    this.player = this.makeMovable(0, 0, 'insect');

    const otherBug = this.game.add.sprite(20, 30, 'insect');
    this.collisionGroup.add(otherBug);
    this.game.physics.arcade.enable(otherBug, true);
    otherBug.body.immovable = true;

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.game.physics.arcade.collide(this.collisionGroup);

    this.updateMovables();

    if (this.cursors.left.isDown) {
      this.player.body.body.velocity.x = -50;
    } else if (this.cursors.right.isDown) {
      this.player.body.body.velocity.x = 50;
    } else {
      this.player.body.body.velocity.x = 0;
    }
    if (this.cursors.up.isDown) {
      this.player.body.body.velocity.y = -50;
    } else if (this.cursors.down.isDown) {
      this.player.body.body.velocity.y = 50;
    } else {
      this.player.body.body.velocity.y = 0;
    }
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
