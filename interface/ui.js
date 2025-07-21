let posibleUistates = {
  start: "start",
  game: "game",
  levelup: "levelup",
  gameover: "gameover",
};

let cardTyps = {
  speeder: "speeder",
  eater: "eater",
};

let cardTypeList = Object.values(cardTyps);

class Button {
  constructor(label, pos = [50, 25], size = [20, 10], onClick = () => {}) {
    this.label = label;
    this.pos = pos;
    this.size = size;
    this.onClick = onClick;
    this.isPressed = false;
  }

  draw() {
    let w = this.size[0] * width * 0.01;
    let h = this.size[1] * height * 0.01;
    let x = this.pos[0] * width * 0.01 - w / 2;
    let y = this.pos[1] * height * 0.01 - h / 2;

    let hovered = mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;

    if (hovered && mouseIsPressed) {
      if (!this.isPressed) {
        this.isPressed = true;
        this.onClick();
      }
    } else {
      this.isPressed = false;
    }

    let scale = hovered ? 1.05 : 1.0;

    let scaledW = w * scale;
    let scaledH = h * scale;
    let scaledX = this.pos[0] * width * 0.01 - scaledW / 2;
    let scaledY = this.pos[1] * height * 0.01 - scaledH / 2;

    fill(proteinColors.blue);
    rect(scaledX, scaledY, scaledW, scaledH, 0.05 * width);

    textAlign(CENTER, CENTER);
    textSize(scaledH * 0.5);
    fill(255);
    text(this.label, this.pos[0] * width * 0.01, this.pos[1] * height * 0.01);
  }
}

class KeyHandler {
  constructor() {
    this.keys = {
      "a": 65,
      "w": 87,
      "s": 83,
      "d": 68,
      "up": 38,
      "down": 40,
      "left": 37,
      "right": 39,
      "enter": 13,
      "j": 74,
      "k": 75,
      "space": 32
    };
    this.keysAr = [];
    Object.keys(this.keys).forEach(keyName => {
      this.keysAr.push(new Key(this.keys[keyName]));
    });
  }

  isNewKeyPressed(keyName = "enter") {
    return this.keysAr.some(key => key.key === this.keys[keyName] && key.isNewPressed());
  }
}

class Key {
  constructor(key) {
    this.key = key;
    this.lock = false;
  }

  isNewPressed() {
    if (keyIsDown(this.key)) {
      if (!this.lock) {
        this.lock = true;
        return true;
      }
    } else {
      this.lock = false;
    }
    return false;
  }

  isPressed() {
    return keyIsDown(this.key);
  }
}

class Ui {
  constructor(canvas) {
    this.state = posibleUistates.gameover;
    this.cards = [];
    this.playerRef = null;
    this.canvas = canvas;
    this.keyHandler = new KeyHandler();
    this.selectedCardIndex = 0;
    this.timer = new Timer();
    this.timer.start();
    this.highscore = 0;
    this.highscoreDev = 0;
    this.reset();
    this.buttons = [
      new Button(
        "Play",
        [50, 60],
        [17, 8],
        () => {
          playMusic();
          this.setState(posibleUistates.start);
        }
      ),
    ];

    this.canvas.mousePressed(() => {
      if (this.state === posibleUistates.levelup) {
        for (let card of this.cards) {
          if (card.checkClicked(mouseX, mouseY)) {
            break;
          }
        }
      }
    });
  }

  reset() {
    this.timer = new Timer();
    this.timer.start();
  }

  getState() {
    return this.state;
  }

  setState(state) {
    this.state = state;
    if (state === posibleUistates.levelup) {
      this.setupLevelupCards();
    }
  }

  sendPlayerRef(playerRef) {
    this.playerRef = playerRef;
  }

  setupLevelupCards() {
    this.cards = [];
    this.selectedCardIndex = 0;
    let cardWidth = 0.2 * width;
    let cardHeight = 0.6 * height;
    let gap = 0.05 * width;
    let centerX = width / 2;
    let centerY = height / 2;
    let totalWidth = 3 * cardWidth + 2 * gap;
    let startX = centerX - totalWidth / 2;
    let y = centerY - cardHeight / 2 + (height/100)*10;

    for (let i = 0; i < 3; i++) {
      let randomCardTyp = random(cardTypeList);
      let card = new Card(
        randomCardTyp,
        `${randomCardTyp.toUpperCase()} ${i + 1}`,
        `++ ${randomCardTyp}`,
        this.playerRef
      );
      let x = startX + i * (cardWidth + gap);
      card.enable([x, y], [cardWidth, cardHeight]);
      this.cards.push(card);
    }
  }

  drawGame() {
    this.displayTimer();
  }

  drawLevelup() {
    this.drawUiText("Level up", [50, 15], 30)

    this.cards.forEach(card => card.update());

    if (
      this.keyHandler.isNewKeyPressed("left") ||
      this.keyHandler.isNewKeyPressed("a")
    ) {
      this.selectedCardIndex -= 1;
    }

    if (
      this.keyHandler.isNewKeyPressed("right") ||
      this.keyHandler.isNewKeyPressed("d")
    ) {
      this.selectedCardIndex += 1;
    }

    if (this.selectedCardIndex < 0) {
      this.selectedCardIndex = 2;
    } else if (this.selectedCardIndex > 2) {
      this.selectedCardIndex = 0;
    }

    this.cards[this.selectedCardIndex].drawBorder();

    if (
      this.keyHandler.isNewKeyPressed("space") ||
      this.keyHandler.isNewKeyPressed("enter")
    ) {
      this.cards[this.selectedCardIndex].activate();
    }
  }

  drawGameover() {
    this.drawUiText("Last Cell Core", [50, 45], 30);
    this.drawUiText("Highscore: " + this.highscore + "s", [10, 5], 10);
    this.drawUiText("Dev Highscore: " + this.highscoreDev + "s", [10, 10], 5);
    this.buttons.forEach(button => button.draw());
  }

  displayTimer() {
    let x = width * 0.95;
    let y = height * 0.05;
    let textSizeValue = width * 0.02;
    textAlign(RIGHT, TOP);
    textSize(textSizeValue);
    fill(255);
    noStroke();
    text(this.timer.getTime() + "s", x, y);
    if (this.timer.getTime() > this.highscore) {
      this.highscore = this.timer.getTime();
    }
  }

  drawUiText(textText = "Text", pos = [50, 25], size = 20) {
    let w = size * width * 0.01;
    let h = size * height * 0.01;
    textAlign(CENTER, CENTER);
    textSize(h * 0.5);
    fill(255);
    noStroke();
    text(
      textText,
      pos[0] * width * 0.01,
      pos[1] * height * 0.01
    );
  }
}

class Card {
  constructor(cardTyp, title, description, playerRef) {
    this.cardTyp = cardTyp;
    this.title = title;
    this.description = description;
    this.pos = [0, 0];
    this.size = [100, 100];
    this.enabled = false;
    this.playerRef = playerRef;
  }

  enable(pos, size) {
    this.enabled = true;
    this.pos = pos;
    this.size = size;
  }

  update() {
    if (!this.enabled) return;
    if (this.playerRef.ui.getState() !== posibleUistates.levelup) return;
    let [x, y] = this.pos;
    let [w, h] = this.size;
    fill(proteinColors.black);
    noStroke();
    let cornerRadius = 0.02 * width;
    rect(x, y, w, h, cornerRadius);
    fill(proteinColors.blue);
    textSize(0.03 * width);
    textAlign(CENTER, TOP);
    text(this.title, x + w / 2, y + 0.05 * height);
    textSize(0.025 * width);
    text(this.description, x + w / 2, y + 0.12 * height);
    switch (this.cardTyp) {
      case cardTyps.speeder:
        this.drawSpeederIcon(x, y, w, h);
        break;
      case cardTyps.eater:
        this.drawEaterIcon(x, y, w, h);
        break;
    }
  }

  drawSpeederIcon(x, y, w, h) {
    fill(proteinColors.green);
    ellipse(x + w / 2, y + h / 2, 0.05 * width, 0.05 * width);
  }

  drawEaterIcon(x, y, w, h) {
    fill(proteinColors.red);
    rect(x + w / 2 - 0.025 * width, y + h / 2 - 0.025 * width, 0.05 * width, 0.05 * width);
  }

  checkClicked(mx, my) {
    if (!this.enabled) return false;
    if (this.playerRef.ui.getState() !== posibleUistates.levelup) return false;
    let [x, y] = this.pos;
    let [w, h] = this.size;
    if (mx >= x && mx <= x + w && my >= y && my <= y + h) {
      this.activate();
      return true;
    }
    return false;
  }

  activate() {
    switch (this.cardTyp) {
      case cardTyps.speeder:
        this.playerRef.addProtein(proteinTyps.speeder);
        break;
      case cardTyps.eater:
        this.playerRef.addProtein(proteinTyps.eater);
        break;
    }
    this.playerRef.ui.setState(posibleUistates.game);
  }

  drawBorder() {
    let [x, y] = this.pos;
    let [w, h] = this.size;
    noFill();
    stroke(proteinColors.blue);
    strokeWeight(2);
    let cornerRadius = 0.02 * width;
    rect(x, y, w, h, cornerRadius);
  }
}
