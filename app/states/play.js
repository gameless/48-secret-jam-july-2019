export default class extends Phaser.State {
  create() {
    this.stage.backgroundColor = '#ffffff';
    this.game.add.image(0, 0, 'insect');
  }
}
