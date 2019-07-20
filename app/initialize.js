import loadState from './states/load';
import playState from './states/play';

const game = new Phaser.Game({
  width: 160,
  height: 90,
  parent: 'parent',
  antialias: false,
});

game.state.add('load', loadState);
game.state.add('play', playState);

game.state.start('load');
