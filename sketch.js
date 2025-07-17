let canvas;

function setup() {
  canvas = createCanvas(400, 400);

  player = new Protein(proteinColors["green-ish"]);
  windowResized();
}

function draw() {
  background(200);
  player.draw();
  player.move(x=1,y=2);
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
