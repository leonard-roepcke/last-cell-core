


let canvas;
let btn;
let myMusic;

function preload() {
  myMusic = loadSound('music.flac');
}

function setup() {
  drawHandler = new DrawHandler();
  canvas = createCanvas(400, 400);

  btn = createButton('Sound');
  btn.position(10, 10);
  btn.mousePressed(playMusic);

  windowResized();
  ui = new Ui(canvas);
  player = new Player(drawHandler, ui);
  enemyHandler = new Enemy_handler(drawHandler, player);
  aminoHandler = new AminoHandler(drawHandler, player);

  
 
}

function draw() {
  background(proteinColors.screen);
  switch(ui.getState()){
    case "game":
      player.update();
      player.move();
      enemyHandler.update();
      drawHandler.draw();
      aminoHandler.update();
      break;
    
    case "levelup":
      ui.drawLevelup();
      break;

    case "gameover":
      ui.drawGameover();
  }
  
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
  if (!canvas) return;
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


//helpers
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
