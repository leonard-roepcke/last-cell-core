let posibleUistates = {
    start: "start",
    game: "game",
    levelup: "levelup",
    gameover: "gameover",
};

let cardTyps = {
    speeder: "speeder",
};

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

        // ALLES in Pixeln
        let cardWidth = 0.2 * width;  // 20% der Breite in Pixel
        let cardHeight = 0.8 * height; // 80% der Höhe in Pixel
        let gap = 0.05 * width; // 5% der Breite in Pixel

        let centerX = width / 2;
        let centerY = height / 2;

        let totalWidth = 3 * cardWidth + 2 * gap;
        let startX = centerX - totalWidth / 2;
        let y = centerY - cardHeight / 2;

        for (let i = 0; i < 3; i++) {
            let x = startX + i * (cardWidth + gap);
            let card = new Card(
                cardTyps.speeder,
                `Speeder ${i + 1}`,
                "++speed",
                this.playerRef
            );
            card.enable([x, y], [cardWidth, cardHeight]); // direkt in Pixeln
            this.cards.push(card);
        }
    }

    drawLevelup() {
        fill(proteinColors.blue);
        textSize(0.05 * width); // 5% der Breite
        textAlign(CENTER, BOTTOM);
        text("LEVEL UP", width / 2, 0.1 * height);

        this.cards.forEach(card => card.update());
    }

    drawGameover() {
        fill(proteinColors.blue);
        textSize(0.05 * width);
        textAlign(CENTER, BOTTOM);
        text("Game Over", width / 2, 0.5 * height);
    }
}

class Card {
    constructor(cardTyp, title, description, playerRef) {
        this.cardTyp = cardTyp;
        this.title = title;
        this.description = description;
        this.pos = [0, 0]; // in Pixel
        this.size = [100, 100]; // in Pixel
        this.enabled = false;
        this.playerRef = playerRef;
    }

    enable(pos, size) {
        this.enabled = true;
        this.pos = pos;   // [x, y] in Pixel
        this.size = size; // [w, h] in Pixel
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
        let cornerRadius = 0.02 * width; // 2% der Breite
        rect(x, y, w, h, cornerRadius);

        fill(proteinColors.black);
        textSize(0.03 * width);
        textAlign(CENTER, TOP);
        text(this.title, x + w / 2, y + 0.05 * height);

        textSize(0.025 * width);
        text(this.description, x + w / 2, y + 0.12 * height);
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
