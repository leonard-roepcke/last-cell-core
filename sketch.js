let canvas;

function setup() {
  canvas = createCanvas(400, 400);
  windowResized();
  
}

function draw() {
  background(200);
  circle(50, 50, 50);
  test()
}

function windowResized() {
  let aspectRatio = 16 / 9;
  let w = windowWidth;
  let h = windowHeight;

  if (w / h > aspectRatio) {
    w = h * aspectRatio;
  } else {
    h = w / aspectRatio;
  }

  resizeCanvas(w, h);
  centerCanvas();
}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}
