class DrawHandler {
    constructor() {
        this.proteins = [];
        this.cameraPos = [0, 0]; 
        this.playerPos = [0, 0];
    }

    draw() {
        
        this.cameraPos[0] = (this.cameraPos[0] * 10 + this.playerPos[0]) / 11;
        this.cameraPos[1] = (this.cameraPos[1] * 10 + this.playerPos[1]) / 11;

        this.camX = this.cameraPos[0] - 50; 
        this.camY = this.cameraPos[1] - 25; 

        this.proteins.forEach(protein => {
            this.drawCircle(protein, proteinColors.membrane, 8);
        });
        this.proteins.forEach(protein => {
            this.drawCircle(protein, proteinColors.background, 6);
        });
        this.proteins.forEach(protein => {
            this.drawCircle(protein, protein.color, 1);
        });

        this.proteins = [];
    }

    drawCircle(protein, fillColor, scaleFactor) {
        let pos = protein.pos.getPos();
        let sized = protein.sized;
        let realSize = (sized / 100) * min(width, height) * scaleFactor;

        let screenX = (pos[0] - this.camX) * (width / 100);
        let screenY = (pos[1] - this.camY) * (height / 50);

        fill(fillColor);
        noStroke();
        circle(screenX, screenY, realSize);
    }

    addToDraw(protein) {
        this.proteins.push(protein);
    }

    setPlayerPos(pos) {
        this.playerPos = pos;
    }
}
