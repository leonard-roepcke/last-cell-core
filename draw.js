class DrawHandler{
    constructor(){
        this.proteins = [];
    }

    draw() {
        this.proteins.forEach(protein => {
            let pos = protein.pos.getRealPos();
            let size = protein.sized;

            fill(proteinColors.membrane);
            noStroke();
            circle(pos[0], pos[1], size*3.5);
        });


        this.proteins.forEach(protein => {
            let pos = protein.pos.getRealPos();
            let size = protein.sized;

            fill(proteinColors.background);
            noStroke();
            circle(pos[0], pos[1], size*3);
        });

        this.proteins.forEach(protein => {
            let pos = protein.pos.getRealPos();
            let size = protein.sized;

            fill(protein.color);
            noStroke();
            circle(pos[0], pos[1], size);
        });

        this.proteins = [];
    }

    addToDraw(protein){
        this.proteins.push(protein)
    }
}