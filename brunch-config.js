module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'app.js': 'app/**',
        'vendor.js': 'node_modules/**',
      },
    },
  },
  modules: {
    autoRequire: {
      'app.js': [
        'initialize',
      ],
    },
  },
  npm: {
    static: [
      'node_modules/phaser-ce/build/phaser.js',
    ],
  },
};
