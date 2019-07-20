var ctx;
var canvas;
var paused = false;
var lastFrameTime;

var keyDown = [];

var mouse = {x: 0, y: 0};

// TODO: maybe storing lists of points in polygons is easier?
var lines = [
	{x1: 10, y1: 10, x2: 630, y2: 10},
	{x1: 630, y1: 10, x2: 630, y2: 470},
	{x1: 10, y1: 470, x2: 630, y2: 470},
	{x1: 10, y1: 10, x2: 10, y2: 470},
	{x1: 100, y1: 100, x2: 200, y2: 70},
	{x1: 170, y1: 130, x2: 200, y2: 70},
	{x1: 100, y1: 100, x2: 170, y2: 130},
	{x1: 400, y1: 300, x2: 570, y2: 230},
	{x1: 500, y1: 300, x2: 570, y2: 230},
	{x1: 500, y1: 300, x2: 510, y2: 270},
	{x1: 510, y1: 270, x2: 400, y2: 300},
];

//var lightingPolygon = [];
var lightingPolygons = [[], [], [], []];
var lightingOffsets = [
	{x: 0, y: 0},
	{x: 0, y: 0}
	// {x: -5, y: -5},
	// {x:  5, y: -5},
	// {x: -5, y:  5},
	// {x:  5, y:  5},
	];
const SUBLIGHTS = 9;
const RADIUS = 3;
for (let i = 0; i < SUBLIGHTS - 2; i++) {
	lightingOffsets.push({x: RADIUS * Math.cos(2 * Math.PI * i / SUBLIGHTS), y: RADIUS * Math.sin(2 * Math.PI * i / SUBLIGHTS)});
}

function isKeyDown(keycode) {
	return keyDown[keycode];
}

function update(delta) {

}

function plus(a, b) {
	return {x: a.x + b.x, y: a.y + b.y};
}

// expects ray as {x, y, dx, dy}
// expects line segment as {x, y, dx, dy}
// returns t1 (not exactly the modular choice but)
function intersect(ray, segment) {
	// TODO check for parallel
	let t2 = (ray.dx * (segment.y - ray.y) + ray.dy * (ray.x - segment.x)) / (segment.dx * ray.dy - segment.dy * ray.dx);
	let t1 = (segment.x + segment.dx * t2 - ray.x) / ray.dx; // TODO what if dx == 0?
	if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
		return t1;
	}
	return null;
}

function angleOffsetRay(ray, dangle) {
	let magnitude = Math.sqrt(Math.pow(ray.dx, 2) + Math.pow(ray.dy, 2));
	let angle = Math.atan2(ray.dx, ray.dy) + dangle;
	return {x: ray.x, y: ray.y, dx: magnitude * Math.sin(angle), dy: magnitude * Math.cos(angle)};
}

function raycast(ray, lines) {
	let min_t1 = Infinity;

	for (let line of lines) {
		let t1 = intersect(ray, {x: line.x1, y: line.y1, dx: line.x2 - line.x1, dy: line.y2 - line.y1});

		if (t1 != null && t1 < min_t1) {
			min_t1 = t1;
		}
	}

	// TODO what if unbounded? canvas edge or something?
	if (min_t1 == Infinity) return null;
	return {x: ray.x + ray.dx * min_t1, y: ray.y + ray.dy * min_t1};
}

function calculateLightPolygon(point, lines) {
	let intersections = [];

	var pts = [];

	for (let line of lines) {
		let pt1 = {x: line.x1, y: line.y1};
		let pt2 = {x: line.x2, y: line.y2};

		if (!pts.some(pt => (pt.x == pt1.x && pt.y == pt1.y))) pts.push(pt1);
		if (!pts.some(pt => (pt.x == pt2.x && pt.y == pt2.y))) pts.push(pt2);
	}

	for (let pt of pts) {
		let ray = {x: point.x, y: point.y, dx: pt.x - point.x, dy: pt.y - point.y};
		let rays = [angleOffsetRay(ray, -0.00001), ray, angleOffsetRay(ray, 0.00001)];

		for (let r of rays) {
			let result = raycast(r, lines);
			if (result != null) intersections.push(result);
		}
	}

	// sort intersections
	intersections.sort((a, b) => (Math.atan2(b.x - point.x, b.y - point.y) - Math.atan2(a.x - point.x, a.y - point.y)));
	return intersections;
}

function drawBackground(ctx, fillStyle) {
	ctx.globalCompositeOperation = 'source-over';
	ctx.fillStyle=fillStyle;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawLines() {
	ctx.strokeStyle = "#fbfbfb";
	for (let line of lines) {
		ctx.beginPath();
		ctx.moveTo(line.x1, line.y1);
		ctx.lineTo(line.x2, line.y2);
		ctx.stroke();
	}
}

var lightingCanvas = document.createElement('canvas');
var lightingCtx = lightingCanvas.getContext('2d');

function drawLighting() {
	drawBackground(lightingCtx, "#000000");
	lightingCtx.globalCompositeOperation = 'lighter';
	lightingCtx.fillStyle = 'rgb(' + 255 / SUBLIGHTS + ',' + 255 / SUBLIGHTS + ',' + 255 / SUBLIGHTS + ')';
	for (let lightingPolygon of lightingPolygons) {
		if (lightingPolygon.length >= 1) {
			lightingCtx.beginPath();
			lightingCtx.moveTo(lightingPolygon[0].x, lightingPolygon[0].y);
			for (let i = 1; i < lightingPolygon.length; i++) {
				lightingCtx.lineTo(lightingPolygon[i].x, lightingPolygon[i].y);
			}
			lightingCtx.fill();
		}
	}

	// lightingCtx.globalCompositeOperation = 'multiply';
	// let lightingGradient = lightingCtx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 300);
	// lightingGradient.addColorStop (0, '#558a86');
	// lightingGradient.addColorStop (1, '#000000');
	// lightingCtx.fillStyle = lightingGradient;
	// lightingCtx.fillRect(0, 0, lightingCanvas.width, lightingCanvas.height);

	ctx.globalCompositeOperation = 'multiply';
	ctx.drawImage(lightingCanvas, 0, 0);
}

function render() {
	drawBackground(ctx, "#ffffff");
	drawLines();
	drawLighting();
}

function frame() {
	var delta = Date.now() - lastFrameTime;
	if (!paused) {
		update(delta);
	}
	render();
	lastFrameTime = Date.now();
	window.requestAnimationFrame(frame);
}

function initialize() {
	canvas = document.getElementById("myCanvas");

	lightingCanvas.width = canvas.width;
	lightingCanvas.height = canvas.height;

	canvas.addEventListener('mousemove', function(event) {
		mouse.x = event.offsetX;
		mouse.y = event.offsetY;
		for (let i = 0; i < lightingOffsets.length; i++) {
			lightingPolygons[i] = calculateLightPolygon(plus(mouse, lightingOffsets[i]), lines);
		}
	});

	ctx = canvas.getContext("2d");
	lastFrameTime = Date.now();
	window.requestAnimationFrame(frame);
}

$(document).keydown(function(event) {
	var keycode = event.keyCode ? event.keyCode : event.which;
	keyDown[keycode] = true;
});

$(document).keyup(function(event) {
	var keycode = event.keyCode ? event.keyCode : event.which;
	keyDown[keycode] = false;
});
