export default class extends Phaser.State {
  create() {
    this.stage.backgroundColor = '#ffffff';

    this.playerBod = this.game.add.sprite(0, 0, 'blank');
    this.playerBod.width = 16;
    this.playerBod.height = 16;
    this.player = this.game.add.sprite(0, 0, 'insect');
    const otherBug = this.game.add.sprite(20, 30, 'insect');

    this.sprites = this.game.add.group();
    this.sprites.add(this.playerBod);
    this.sprites.add(otherBug);

    const graphics = this.game.add.graphics(50, 50);
    graphics.beginFill(0x00ffff);
    graphics.drawPolygon([
      new Phaser.Point(50, 50),
      new Phaser.Point(50, 60),
      new Phaser.Point(60, 60),
      new Phaser.Point(55, 50),
    ]);
    graphics.endFill();

    this.game.physics.arcade.enable(this.game.world, true);

    this.playerBod.body.collideWorldBounds = true;

    otherBug.body.immovable = true;

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.game.physics.arcade.collide(this.sprites);

    this.player.x = Math.round(this.playerBod.x);
    this.player.y = Math.round(this.playerBod.y);

    if (this.cursors.left.isDown) {
      this.playerBod.body.velocity.x = -50;
    } else if (this.cursors.right.isDown) {
      this.playerBod.body.velocity.x = 50;
    } else {
      this.playerBod.body.velocity.x = 0;
    }
    if (this.cursors.up.isDown) {
      this.playerBod.body.velocity.y = -50;
    } else if (this.cursors.down.isDown) {
      this.playerBod.body.velocity.y = 50;
    } else {
      this.playerBod.body.velocity.y = 0;
    }
  }
}
