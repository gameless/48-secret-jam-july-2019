function usePixelGraphics(game, pixelsPerPixel) {
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
  game.scale.setUserScale(pixelsPerPixel, pixelsPerPixel);
  game.renderer.renderSession.roundPixels = true;
  Phaser.Canvas.setImageRenderingCrisp(game.canvas);
}

function loadImage(game, name) {
  game.load.image(name, `${name}.png`);
}

function loadImages(game) {
  loadImage(game, 'insect');
}

export default function (game) {
  return {
    preload() {
      usePixelGraphics(game, 6);
      loadImages(game);
    },

    update() {
      game.state.start('play');
    },
  };
}
