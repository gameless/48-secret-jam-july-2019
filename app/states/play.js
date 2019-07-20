import Colors from '../colors';
import Levels from '../levels';
import * as World from '../world';

export default class extends Phaser.State {
  create() {
    this.stage.backgroundColor = '#683f09';

    this.tileGraphics = this.game.add.graphics(0, 0);

    this.level = Levels[0]; // eslint-disable-line
    this.filter = Colors.YELLOW;
    this.renderLevel();

    this.player = this.game.add.sprite(0, 0, 'insect');
    const otherBug = this.game.add.sprite(20, 30, 'insect');

    this.sprites = this.game.add.group();
    this.sprites.add(this.player);
    this.sprites.add(otherBug);

    this.game.physics.arcade.enable(this.game.world, true);

    this.player.body.collideWorldBounds = true;

    otherBug.body.immovable = true;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.glasses = [
      null,
      Colors.RED,
      Colors.YELLOW,
      Colors.BLUE,
      Colors.GREEN,
    ];

    this.input.keyboard.addKey(Phaser.Keyboard.OPEN_BRACKET).onDown.add(() => {
      this.filter = this.glasses[(this.glasses.indexOf(this.filter) + 1) % this.glasses.length];
      this.renderLevel();
    }, this);
    this.input.keyboard.addKey(Phaser.Keyboard.CLOSED_BRACKET).onDown.add(() => {
      this.filter = this.glasses[(this.glasses.indexOf(this.filter) - 1 + this.glasses.length)
        % this.glasses.length];
      this.renderLevel();
    }, this);
  }

  update() {
    this.game.physics.arcade.collide(this.sprites);

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -50;
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 50;
    } else {
      this.player.body.velocity.x = 0;
    }
    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -50;
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = 50;
    } else {
      this.player.body.velocity.y = 0;
    }
  }

  renderLevel() {
    this.stage.backgroundColor = !this.filter ? 0xffffff : this.filter;
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
    graphics.clear();

    Object.values(Colors).forEach((color) => {
      if (color !== this.filter) {
        graphics.beginFill(World.renderWallColor(color, this.filter));
        wallsByColor[color].forEach(({ r, c }) => {
          graphics.drawRect(World.colToX(c), World.rowToY(r), World.TILE_SIZE, World.TILE_SIZE);
        });
        graphics.endFill();
      }
    });
  }
}
