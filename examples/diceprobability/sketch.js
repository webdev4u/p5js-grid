let grid;
let headerRenderer;
let renderer;

let values = [];
let probs = [];
let totalValues = 0;

function renderGridHeader(pos, bounds) {
  stroke(255);
  noFill();
  textAlign(CENTER, CENTER);
  textSize(18);
  text(pos + 1, bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);
}

function renderGridCell(col, row, bounds) {
  defaultRenderGridCell(col, row, bounds);

  let prob = probs[col + row];
  let c = map(prob, 0, Math.max(...probs), 0, 255);
  noStroke();
  fill(c);
  rect(bounds.x, bounds.y, bounds.w, bounds.h);
  
  textAlign(CENTER, CENTER);
  textSize(18);

  if (c > 128) {
    stroke(0);
    fill(0);
  } else {
    stroke(255);
    fill(255);
  }

  text(col + row + 2, bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);
}

function setup() {
  createCanvas(420, 420);

  grid = new Grid(6, 6, 1, 1, new Bounds(0, 0, width, height),
                 renderGridCell, renderGridHeader, renderGridHeader);

  values = new Array(12).fill(0);
  probs = new Array(12).fill(0);
}

function draw() {
  let oneCube = floor(random(0, 6));
  let twoCube = floor(random(0, 6));

  values[oneCube + twoCube]++;
  totalValues++;
  probs[oneCube+twoCube] = Math.floor((values[oneCube + twoCube]) * 100 / totalValues);

  background(0);
  grid.draw();
}