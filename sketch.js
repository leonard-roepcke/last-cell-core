let canvas;

let myMusic;

function preload() {
  myMusic = loadSound('music.flac');
}

function setup() {
  drawHandler = new DrawHandler();
  canvas = createCanvas(400, 400);
  windowResized();
  player = new Player(drawHandler);
  enemy_handler = new Enemy_handler(drawHandler, player);

  let btn = createButton('Play/Pause');
  btn.position(10, 10);
  btn.mousePressed(playMusic);
}

function draw() {
  background(proteinColors.screen);
  player.update();
  player.move();
  enemy_handler.update();
  drawHandler.draw();
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
  return [w, h];
}

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

function playMusic() {
  if (myMusic.isPlaying()) {
    myMusic.stop();
  } else {
    myMusic.play();
  }
}