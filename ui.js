let posibleUistates = {
    start: "start",
    game: "game",
    levelup: "levelup",
}
class Ui{
    constructor(){
        this.state = posibleUistates.game;
    }

    getState(){
        return this.state;
    }

    setState(state){
        this.state = state;
    }

    drawLevelup() {
    let cardWidth = (20 / 100) * width;
    let cardHeight = (40 / 50) * height;

    let gap = (5 / 100) * width;

    let centerX = width / 2;
    let centerY = height / 2;

    let totalWidth = 3 * cardWidth + 2 * gap;

    let startX = centerX - totalWidth / 2;
    let y = centerY - cardHeight / 2;

    let cornerRadius = (2 / 100) * width; // Eckenradius hängt von width ab

    for (let i = 0; i < 3; i++) {
        let x = startX + i * (cardWidth + gap);
        fill(proteinColors.cytoplasm);
        rect(x, y, cardWidth, cardHeight, cornerRadius);
    }

    fill(proteinColors.blue);
    textSize((5 / 100) * width);
    textAlign(CENTER, BOTTOM);

    let textOffset = (5 / 100) * height; // Abstand zum Kartenblock relativ zu height
    text("LEVEL UP", centerX, y);
    }

}