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
        'script',
      ],
    },
  },
};
