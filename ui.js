let posibleUistates = {
    start: "start",
    game: "game",
    levelup: "levelup",
    gameover: "gameover",
}

let cardTyps = {
    speeder: "speeder",
}

class Ui {
    constructor(canvas) {
        this.state = posibleUistates.game;
        this.cards = [];
        this.playerRef = null;
        this.canvas = canvas;
        
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

        let cardWidth = (20 / 100) * width;
        let cardHeight = (40 / 50) * height;
        let gap = (5 / 100) * width;

        let centerX = width / 2;
        let centerY = height / 2;

        let totalWidth = 3 * cardWidth + 2 * gap;
        let startX = centerX - totalWidth / 2;
        let y = centerY - cardHeight / 2;

        for (let i = 0; i < 3; i++) {
            let card = new Card(cardTyps.speeder, `Speeder ${i + 1}`, "++speed", this.playerRef);
            let x = startX + i * (cardWidth + gap);
            card.enable([x, y], [cardWidth, cardHeight]);
            this.cards.push(card);
        }
    }

    drawLevelup() {
        fill(proteinColors.blue);
        textSize((5 / 100) * width);
        textAlign(CENTER, BOTTOM);
        text("LEVEL UP", width / 2, (10 / 100) * height);

        this.cards.forEach(card => card.update());
    }

    drawGameover(){
        fill(proteinColors.blue);
        textSize((5 / 100) * width);
        textAlign(CENTER, BOTTOM);
        text("Game Over", width / 2, (50 / 100) * height);
    }
}

class Card {
    constructor(cardTyp = cardTyps.speeder, title = "Speeder", description = "++speed", playerRef) {
        this.cardTyp = cardTyp;
        this.title = title;
        this.description = description;
        this.pos = [0, 0];
        this.size = [width / 4, height / 4];
        this.enabled = false;
        this.playerRef = playerRef;
    }

    enable(pos = [0, 0], size = [width / 4, height / 4]) {
        this.enabled = true;
        this.pos = pos;
        this.size = size;
    }

    update() {
        if (!this.enabled) return;

        if (this.playerRef.ui.getState() !== posibleUistates.levelup) return;

        switch (this.cardTyp) {
            case cardTyps.speeder:
                this.updateAsSpeeder();
                break;
        }
    }

    updateAsSpeeder() {
        let [x, y] = this.pos;
        let [w, h] = this.size;

        fill(proteinColors.cytoplasm);
        strokeWeight(0);
        let cornerRadius = (2 / 100) * width;
        rect(x, y, w, h, cornerRadius);

        fill(proteinColors.black);
        textSize((3 / 100) * width);
        textAlign(CENTER, TOP);
        text(this.title, x + w / 2, y + (5 / 100) * height);

        textSize((2.5 / 100) * width);
        text(this.description, x + w / 2, y + (12 / 100) * height);
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
            }
            this.playerRef.ui.setState(posibleUistates.game);
            return true;
        }
        return false;
    }
}
