const $ = require('jquery');

const insect = new Image();
insect.src = 'insect.png';

const screenCanvas = document.getElementById('myCanvas');
const screenCtx = screenCanvas.getContext('2d');

const canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 240;
const globalCtx = canvas.getContext('2d');
const screenScale = { };

function calculateScale() {
  screenCanvas.width = window.innerWidth;
  screenCanvas.height = window.innerHeight;
  screenScale.scale = Math.max(1, Math.floor(Math.min(screenCanvas.width / canvas.width,
    screenCanvas.height / canvas.height)));
  screenScale.w = screenScale.scale * canvas.width;
  screenScale.h = screenScale.scale * canvas.height;
  screenScale.x = (screenCanvas.width - screenScale.w) / 2;
  screenScale.y = (screenCanvas.height - screenScale.h) / 2;
}

calculateScale();

const paused = false;
let lastFrameTime;

const keyDown = [];

const mouse = { x: 0, y: 0 };

// TODO: maybe storing lists of points in polygons is easier?
const demoLines = [
  {
    x1: 10, y1: 10, x2: 630, y2: 10,
  },
  {
    x1: 630, y1: 10, x2: 630, y2: 470,
  },
  {
    x1: 10, y1: 470, x2: 630, y2: 470,
  },
  {
    x1: 10, y1: 10, x2: 10, y2: 470,
  },
  {
    x1: 100, y1: 100, x2: 200, y2: 70,
  },
  {
    x1: 170, y1: 130, x2: 200, y2: 70,
  },
  {
    x1: 100, y1: 100, x2: 170, y2: 130,
  },
  {
    x1: 400, y1: 300, x2: 570, y2: 230,
  },
  {
    x1: 500, y1: 300, x2: 570, y2: 230,
  },
  {
    x1: 500, y1: 300, x2: 510, y2: 270,
  },
  {
    x1: 510, y1: 270, x2: 400, y2: 300,
  },
];

// var lightingPolygon = [];
const lightingPolygons = [[], [], [], []];
const lightingOffsets = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  // {x: -5, y: -5},
  // {x:  5, y: -5},
  // {x: -5, y:  5},
  // {x:  5, y:  5},
];
const SUBLIGHTS = 9;
const RADIUS = 3;
for (let i = 0; i < SUBLIGHTS - 2; i += 1) {
  lightingOffsets.push({
    x: RADIUS * Math.cos(2 * Math.PI * i / SUBLIGHTS),
    y: RADIUS * Math.sin(2 * Math.PI * i / SUBLIGHTS),
  });
}

// function isKeyDown(keycode) {
//   return keyDown[keycode];
// }

function update(/* delta */) {

}

function plus(a, b) {
  return { x: a.x + b.x, y: a.y + b.y };
}

// expects ray as {x, y, dx, dy}
// expects line segment as {x, y, dx, dy}
// returns t1 (not exactly the modular choice but)
function intersect(ray, segment) {
  // TODO check for parallel
  const t2 = (ray.dx * (segment.y - ray.y) + ray.dy * (ray.x - segment.x))
    / (segment.dx * ray.dy - segment.dy * ray.dx);
  const t1 = (segment.x + segment.dx * t2 - ray.x) / ray.dx; // TODO what if dx == 0?
  if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
    return t1;
  }
  return null;
}

function angleOffsetRay(ray, dangle) {
  const magnitude = Math.sqrt((ray.dx ** 2) + (ray.dy ** 2));
  const angle = Math.atan2(ray.dx, ray.dy) + dangle;
  return {
    x: ray.x, y: ray.y, dx: magnitude * Math.sin(angle), dy: magnitude * Math.cos(angle),
  };
}

function raycast(ray, lines) {
  let t1Min = Infinity;

  lines.forEach((line) => {
    const t1 = intersect(ray, {
      x: line.x1, y: line.y1, dx: line.x2 - line.x1, dy: line.y2 - line.y1,
    });

    if (t1 != null && t1 < t1Min) {
      t1Min = t1;
    }
  });

  // TODO what if unbounded? canvas edge or something?
  if (t1Min === Infinity) return null;
  return { x: ray.x + ray.dx * t1Min, y: ray.y + ray.dy * t1Min };
}

function calculateLightPolygon(point, lines) {
  const intersections = [];

  const pts = [];

  lines.forEach((line) => {
    const pt1 = { x: line.x1, y: line.y1 };
    const pt2 = { x: line.x2, y: line.y2 };

    if (!pts.some(pt => (pt.x === pt1.x && pt.y === pt1.y))) pts.push(pt1);
    if (!pts.some(pt => (pt.x === pt2.x && pt.y === pt2.y))) pts.push(pt2);
  });

  pts.forEach((pt) => {
    const ray = {
      x: point.x, y: point.y, dx: pt.x - point.x, dy: pt.y - point.y,
    };
    const rays = [angleOffsetRay(ray, -0.00001), ray, angleOffsetRay(ray, 0.00001)];

    rays.forEach((r) => {
      const result = raycast(r, lines);
      if (result != null) intersections.push(result);
    });
  });

  // sort intersections
  intersections.sort((a, b) => {
    const angle1 = Math.atan2(b.x - point.x, b.y - point.y);
    const angle2 = Math.atan2(a.x - point.x, a.y - point.y);
    return angle1 - angle2;
  });
  return intersections;
}

function drawBackground(ctx, fillStyle) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = fillStyle;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawLines() {
  globalCtx.strokeStyle = '#fbfbfb';
  demoLines.forEach((line) => {
    globalCtx.beginPath();
    globalCtx.moveTo(line.x1, line.y1);
    globalCtx.lineTo(line.x2, line.y2);
    globalCtx.stroke();
  });
}

const lightingCanvas = document.createElement('canvas');
const lightingCtx = lightingCanvas.getContext('2d');

function drawLighting() {
  drawBackground(lightingCtx, '#000000');
  lightingCtx.globalCompositeOperation = 'lighter';
  lightingCtx.fillStyle = `rgb(${255 / SUBLIGHTS},${255 / SUBLIGHTS},${255 / SUBLIGHTS})`;
  lightingPolygons.forEach((lightingPolygon) => {
    if (lightingPolygon.length >= 1) {
      lightingCtx.beginPath();
      lightingCtx.moveTo(lightingPolygon[0].x, lightingPolygon[0].y);
      for (let i = 1; i < lightingPolygon.length; i += 1) {
        lightingCtx.lineTo(lightingPolygon[i].x, lightingPolygon[i].y);
      }
      lightingCtx.fill();
    }
  });

  // lightingCtx.globalCompositeOperation = 'multiply';
  // let lightingGradient = lightingCtx.createRadialGradient(
  //   mouse.x, mouse.y, 0, mouse.x, mouse.y, 300,
  // );
  // lightingGradient.addColorStop (0, '#558a86');
  // lightingGradient.addColorStop (1, '#000000');
  // lightingCtx.fillStyle = lightingGradient;
  // lightingCtx.fillRect(0, 0, lightingCanvas.width, lightingCanvas.height);

  globalCtx.globalCompositeOperation = 'multiply';
  globalCtx.drawImage(lightingCanvas, 0, 0);

  globalCtx.drawImage(insect, 20, 20);
}

function render() {
  drawBackground(globalCtx, '#ffffff');
  drawLines();
  drawLighting();

  // draw to screen
  screenCtx.imageSmoothingEnabled = false;
  screenCtx.drawImage(canvas, screenScale.x, screenScale.y, screenScale.w, screenScale.h);
}

function frame() {
  const delta = Date.now() - lastFrameTime;
  if (!paused) {
    update(delta);
  }
  render();
  lastFrameTime = Date.now();
  window.requestAnimationFrame(frame);
}

function initialize() {
  lightingCanvas.width = canvas.width;
  lightingCanvas.height = canvas.height;

  screenCanvas.addEventListener('mousemove', (event) => {
    mouse.x = (event.offsetX - screenScale.x) / screenScale.scale;
    mouse.y = (event.offsetY - screenScale.y) / screenScale.scale;
    for (let i = 0; i < lightingOffsets.length; i += 1) {
      lightingPolygons[i] = calculateLightPolygon(plus(mouse, lightingOffsets[i]), demoLines);
    }
  });

  lastFrameTime = Date.now();
  window.requestAnimationFrame(frame);
}

$(window).resize(() => {
  calculateScale();
});

$(document).keydown((event) => {
  const keycode = event.keyCode ? event.keyCode : event.which;
  keyDown[keycode] = true;
});

$(document).keyup((event) => {
  const keycode = event.keyCode ? event.keyCode : event.which;
  keyDown[keycode] = false;
});

initialize();
