(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("colors.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  BLACK: 0x000000,
  RED: 0xff0000,
  GREEN: 0x3dbb9f,
  BLUE: 0x1d8acb,
  YELLOW: 0xfef200
};
exports["default"] = _default;

});

require.register("initialize.js", function(exports, require, module) {
"use strict";

var _load = _interopRequireDefault(require("./states/load"));

var _play = _interopRequireDefault(require("./states/play"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var game = new Phaser.Game({
  width: 240,
  height: 160,
  parent: 'parent',
  antialias: false,
  physicsConfig: {
    arcade: true
  }
});
game.state.add('load', _load["default"]);
game.state.add('play', _play["default"]);
game.state.start('load');

});

require.register("levels.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var World = _interopRequireWildcard(require("./world"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function blankTiles() {
  var tiles = [];

  for (var r = 0; r < 20; r += 1) {
    var row = [];

    for (var c = 0; c < 30; c += 1) {
      row.push(World.Tiles.FLOOR);
    }

    tiles.push(row);
  }

  return tiles;
}

var levels = [];
exports["default"] = levels;
var level = {};
level.tiles = blankTiles();
level.tiles[11][11] = World.Tiles.WALL_RED;
level.tiles[11][12] = World.Tiles.WALL_RED;
level.tiles[11][13] = World.Tiles.WALL_BLACK;
level.tiles[11][14] = World.Tiles.WALL_BLACK;
level.tiles[12][11] = World.Tiles.WALL_BLUE;
level.tiles[12][12] = World.Tiles.WALL_BLUE;
level.tiles[12][13] = World.Tiles.WALL_YELLOW;
level.tiles[12][14] = World.Tiles.WALL_YELLOW;
level.tiles[13][11] = World.Tiles.WALL_BLACK;
level.tiles[13][12] = World.Tiles.WALL_BLACK;
level.tiles[13][13] = World.Tiles.WALL_BLACK;
level.tiles[13][14] = World.Tiles.WALL_BLACK;
levels.push(level);

});

require.register("states/load.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function usePixelGraphics(game, pixelsPerPixel) {
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
  game.scale.setUserScale(pixelsPerPixel, pixelsPerPixel);
  game.renderer.renderSession.roundPixels = true;
  Phaser.Canvas.setImageRenderingCrisp(game.canvas);
}

function loadImage(game, name) {
  game.load.image(name, "".concat(name, ".png"));
}

function loadImages(game) {
  loadImage(game, 'blank');
  loadImage(game, 'penguin');
  loadImage(game, 'white');
}

function _default(game) {
  return {
    preload: function preload() {
      usePixelGraphics(game, 3);
      loadImages(game);
    },
    update: function update() {
      game.state.start('play');
    }
  };
}

});

;require.register("states/play.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _colors = _interopRequireDefault(require("../colors"));

var _levels = _interopRequireDefault(require("../levels"));

var World = _interopRequireWildcard(require("../world"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _default =
/*#__PURE__*/
function (_Phaser$State) {
  _inherits(_default, _Phaser$State);

  function _default() {
    _classCallCheck(this, _default);

    return _possibleConstructorReturn(this, _getPrototypeOf(_default).apply(this, arguments));
  }

  _createClass(_default, [{
    key: "makeLevel",
    value: function makeLevel(level) {
      var _this = this;

      var tiles = level.tiles;
      this.wallsByColor = {};
      Object.values(_colors["default"]).forEach(function (color) {
        _this.wallsByColor[color] = [];
      });

      for (var r = 0; r < tiles.length; r += 1) {
        for (var c = 0; c < tiles[r].length; c += 1) {
          if (tiles[r][c].isWall) {
            var tile = this.game.add.sprite(World.colToX(c), World.rowToY(r), 'white');
            this.wallsByColor[tiles[r][c].color].push({
              r: r,
              c: c,
              tile: tile
            });
          }
        }
      }

      Object.values(_colors["default"]).forEach(function (color) {
        _this.wallsByColor[color].forEach(function (_ref) {
          var tile = _ref.tile;
          tile.tint = World.renderWallColor(color, _this.filter);
          tile.width = World.TILE_SIZE;
          tile.height = World.TILE_SIZE;

          _this.game.physics.arcade.enable(tile);

          tile.body.immovable = true;
        });
      });
    }
  }, {
    key: "updateFilter",
    value: function updateFilter() {
      var _this2 = this;

      this.stage.backgroundColor = !this.filter ? 0xffffff : this.filter;
      Object.values(_colors["default"]).forEach(function (color) {
        _this2.wallsByColor[color].forEach(function (_ref2) {
          var tile = _ref2.tile;
          tile.tint = World.renderWallColor(color, _this2.filter);

          if (World.isCollidable(color, _this2.filter)) {
            _this2.collisionGroup.add(tile);
          } else {
            _this2.collisionGroup.remove(tile);
          }
        });
      });
    }
  }, {
    key: "makeMovable",
    value: function makeMovable(x, y, key) {
      var image = this.game.add.sprite(x, y, key);
      var blank = this.game.add.sprite(x, y, 'blank');
      blank.width = image.width;
      blank.height = image.height;
      this.game.physics.arcade.enable(blank);
      blank.body.collideWorldBounds = true;
      this.collisionGroup.add(blank);
      var movable = {
        body: blank,
        draw: image
      };
      this.movables.push(movable);
      return movable;
    }
  }, {
    key: "updateMovables",
    value: function updateMovables() {
      this.movables.forEach(function (movable) {
        movable.draw.x = Math.round(movable.body.x);

        if (movable.draw.scale.x < 0) {
          movable.draw.x += movable.body.width;
        }

        movable.draw.y = Math.round(movable.body.y);
      });
    }
  }, {
    key: "create",
    value: function create() {
      var _this3 = this;

      this.collisionGroup = this.game.add.group();
      this.filter = _colors["default"].YELLOW;
      this.makeLevel(_levels["default"][0]);
      this.updateFilter();
      this.movables = [];
      this.player = this.makeMovable(100, 10, 'penguin');
      var otherBug = this.game.add.sprite(30, 40, 'penguin');
      this.collisionGroup.add(otherBug);
      this.game.physics.arcade.enable(otherBug);
      otherBug.body.immovable = true;
      this.cursors = this.input.keyboard.createCursorKeys();
      this.glasses = [null, _colors["default"].RED, _colors["default"].YELLOW, _colors["default"].BLUE, _colors["default"].GREEN];
      this.input.keyboard.addKey(Phaser.Keyboard.OPEN_BRACKET).onDown.add(function () {
        _this3.filter = _this3.glasses[(_this3.glasses.indexOf(_this3.filter) + 1) % _this3.glasses.length];

        _this3.updateFilter();
      }, this);
      this.input.keyboard.addKey(Phaser.Keyboard.CLOSED_BRACKET).onDown.add(function () {
        _this3.filter = _this3.glasses[(_this3.glasses.indexOf(_this3.filter) - 1 + _this3.glasses.length) % _this3.glasses.length];

        _this3.updateFilter();
      }, this);
    }
  }, {
    key: "update",
    value: function update() {
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
  }]);

  return _default;
}(Phaser.State);

exports["default"] = _default;

});

require.register("world.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colToX = colToX;
exports.rowToY = rowToY;
exports.renderWallColor = renderWallColor;
exports.isCollidable = isCollidable;
exports.TILE_SIZE = exports.Tiles = void 0;

var _colors = _interopRequireDefault(require("./colors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Tiles = {
  FLOOR: {
    isWall: false
  }
};
exports.Tiles = Tiles;
Object.keys(_colors["default"]).forEach(function (color) {
  Tiles["WALL_".concat(color)] = {
    color: _colors["default"][color],
    isWall: true
  };
});
var TILE_SIZE = 8;
exports.TILE_SIZE = TILE_SIZE;

function colToX(col) {
  return col * TILE_SIZE;
}

function rowToY(row) {
  return row * TILE_SIZE;
}

function renderWallColor(color, filter) {
  if (!filter) return color;
  return color === filter ? color : _colors["default"].BLACK;
}

function isCollidable(color, filter) {
  return color !== filter;
}

});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('initialize');