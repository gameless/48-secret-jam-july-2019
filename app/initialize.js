import loadState from './states/load';
import playState from './states/play';

const game = new Phaser.Game({
  width: 240,
  height: 160,
  parent: 'parent',
  antialias: false,
  physicsConfig: {
    arcade: true,
  },
});

game.state.add('load', loadState);
game.state.add('play', playState);

game.state.start('load');
