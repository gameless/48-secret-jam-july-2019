import Colors from '../colors';
import Levels from '../levels';
import * as World from '../world';

export default class extends Phaser.State {
  makeLevel(level) {
    this.stage.backgroundColor = this.filter;
    const tiles = level.tiles;
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

    Object.values(Colors).forEach((color) => {
      wallsByColor[color].forEach(({ r, c }) => {
        const tile = this.game.add.sprite(World.colToX(c), World.rowToY(r), 'white');
        tile.tint = World.renderWallColor(color, this.filter);
        tile.width = World.TILE_SIZE;
        tile.height = World.TILE_SIZE;
        if (World.isCollidable(color, this.filter)) {
          this.collisionGroup.add(tile);
        }
        this.game.physics.arcade.enable(tile);
        tile.body.immovable = true;
      });
    });
  }

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

    this.collisionGroup = this.game.add.group();
    this.filter = Colors.YELLOW;
    this.makeLevel(Levels[0]);

    this.movables = [];
    this.player = this.makeMovable(100, 10, 'insect');

    const otherBug = this.game.add.sprite(30, 40, 'insect');
    this.collisionGroup.add(otherBug);
    this.game.physics.arcade.enable(otherBug);
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
}
