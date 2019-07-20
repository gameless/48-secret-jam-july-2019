export default class extends Phaser.State {
  create() {
    this.stage.backgroundColor = '#ffffff';
    this.game.add.image(0, 0, 'insect');

    const graphics = this.game.add.graphics(50, 50);
    graphics.beginFill(0x00ffff);
    graphics.drawPolygon([
      new Phaser.Point(50, 50),
      new Phaser.Point(50, 60),
      new Phaser.Point(60, 60),
      new Phaser.Point(55, 50),
    ]);
    graphics.endFill();
  }
}
