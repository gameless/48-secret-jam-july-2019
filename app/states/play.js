import Colors from '../colors';
import Levels from '../levels';
import * as World from '../world';

export default class extends Phaser.State {
  makeLevel(level) {
    const tiles = level.tiles;
    this.wallsByColor = {};
    Object.values(Colors).forEach((color) => {
      this.wallsByColor[color] = [];
    });
    for (let r = 0; r < tiles.length; r += 1) {
      for (let c = 0; c < tiles[r].length; c += 1) {
        if (tiles[r][c].isWall) {
          const tile = this.game.add.sprite(World.colToX(c), World.rowToY(r), 'white');
          this.wallsByColor[tiles[r][c].color].push({ r, c, tile });
        }
      }
    }

    Object.values(Colors).forEach((color) => {
      this.wallsByColor[color].forEach(({ tile }) => {
        tile.tint = World.renderWallColor(color, this.filter);
        tile.width = World.TILE_SIZE;
        tile.height = World.TILE_SIZE;
        this.game.physics.arcade.enable(tile);
        tile.body.immovable = true;
      });
    });
  }

  updateFilter() {
    this.stage.backgroundColor = !this.filter ? 0xffffff : this.filter;
    Object.values(Colors).forEach((color) => {
      this.wallsByColor[color].forEach(({ tile }) => {
        tile.tint = World.renderWallColor(color, this.filter);
        if (World.isCollidable(color, this.filter)) {
          this.collisionGroup.add(tile);
        } else {
          this.collisionGroup.remove(tile);
        }
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
      if (movable.draw.scale.x < 0) {
        movable.draw.x += movable.body.width;
      }
      movable.draw.y = Math.round(movable.body.y);
    });
  }

  create() {
    this.collisionGroup = this.game.add.group();
    this.filter = Colors.YELLOW;
    this.makeLevel(Levels[0]);
    this.updateFilter();

    this.movables = [];
    this.player = this.makeMovable(100, 10, 'penguin');

    const otherBug = this.game.add.sprite(30, 40, 'penguin');
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
      this.updateFilter();
    }, this);
    this.input.keyboard.addKey(Phaser.Keyboard.CLOSED_BRACKET).onDown.add(() => {
      this.filter = this.glasses[(this.glasses.indexOf(this.filter) - 1 + this.glasses.length)
        % this.glasses.length];
      this.updateFilter();
    }, this);
  }

  update() {
    this.game.physics.arcade.collide(this.collisionGroup);

    if (this.cursors.left.isDown) {
      this.player.draw.scale.x = -1;
      this.player.body.body.velocity.x = -50;
    } else if (this.cursors.right.isDown) {
      this.player.draw.scale.x = 1;
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

    this.updateMovables();
  }
}
