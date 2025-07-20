
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


class Ui {
    constructor(canvas) {
        this.state = posibleUistates.gameover;
        this.cards = [];
        this.playerRef = null;
        this.canvas = canvas;

        this.timer = new Timer();
        this.timer.start();

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

        let cardWidth = 0.2 * width;   // 20% der Breite
        let cardHeight = 0.6 * height; // 60% der Höhe
        let gap = 0.05 * width;        // 5% Abstand

        let centerX = width / 2;
        let centerY = height / 2;

        let totalWidth = 3 * cardWidth + 2 * gap;
        let startX = centerX - totalWidth / 2;
        let y = centerY - cardHeight / 2;

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

    drawGame(){
        this.displayTimer();
    }

    drawLevelup() {
        fill(proteinColors.blue);
        textSize(0.05 * width);
        textAlign(CENTER, BOTTOM);
        text("LEVEL UP", width / 2, 0.1 * height);

        this.cards.forEach(card => card.update());
    }

    drawGameover() {
        this.drawUiText("Last Cell Core", [50, 14], 30);
        this.drawUiButton("Play", [50, 32]);
        this.drawUiButton("Sound", [5, 4], [8,5]);

    }

    displayTimer(){
        let x = width * 0.95;   
        let y = height * 0.05;  

        
        let textSizeValue = width * 0.02; 

        textAlign(RIGHT, TOP);
        textSize(textSizeValue);
        fill(255); 
        noStroke();
        
        text(this.timer.getTime() + "s", x, y);

    }
 
    drawUiButton(buttonText = "Button", pos = [50, 25], size = [20, 10]) {
       
        let w = size[0] * width * 0.01;
        let h = size[1] * height * 0.01;
        let x = pos[0] * width * 0.01 - w / 2;
        let y = pos[1] * height * 0.01 - h / 2;

        let hovered = (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h);

        let scale = hovered ? 1.1 : 1.0;

        let scaledW = w * scale;
        let scaledH = h * scale;
        let scaledX = pos[0] * width * 0.01 - scaledW / 2;
        let scaledY = pos[1] * height * 0.01 - scaledH / 2;

        fill(proteinColors.blue);
        rect(scaledX, scaledY, scaledW, scaledH, 0.05 * width);

        this.drawUiText(buttonText, pos, size[1] * scale);
    }


    drawUiText(textText="Text",pos=[50, 25],size=20){
        let w = size * width * 0.01;
        let h = size * height * 0.01;
        let x = pos[0] * width * 0.01 - w/2;
        let y = pos[1] * height * 0.01 - h/2;
        

        
        textAlign(CENTER, CENTER);
        textSize(h * 0.5);
        fill(255);
        
        noStroke();
        
        text(textText, x + w / 2, y + h / 2);

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
        strokeWeight(0);
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
            switch (this.cardTyp) {
                case cardTyps.speeder:
                    this.playerRef.addProtein(proteinTyps.speeder);
                    break;
                case cardTyps.eater:
                    this.playerRef.addProtein(proteinTyps.eater);
                    break;
            }
            this.playerRef.ui.setState(posibleUistates.game);
            return true;
        }
        return false;
    }

    
}







