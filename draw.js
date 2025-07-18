class DrawHandler{
    constructor(){
        this.proteins = [];
    }

    draw() {
        this.proteins.forEach(protein => {
            let pos = protein.pos.getRealPos();
            let sized = protein.sized; 
            let realSize = (sized / 100) * min(width, height);
            
            fill(proteinColors.membrane);
            noStroke();
            circle(pos[0], pos[1], realSize * 5);
        });


        this.proteins.forEach(protein => {
            let pos = protein.pos.getRealPos();
            let sized = protein.sized;
            let realSize = (sized/100) * min(width, height);


            fill(proteinColors.background);
            noStroke();
            circle(pos[0], pos[1], realSize*4.3);
        });

        this.proteins.forEach(protein => {
            let pos = protein.pos.getRealPos();
            let sized = protein.sized;
            let realSize = (sized/100) * min(width, height);


            fill(protein.color);
            noStroke();
            circle(pos[0], pos[1], realSize);
        });
        
        fill(255);
        textSize((1/100) * width);
        textAlign(LEFT, TOP);
        this.proteins.forEach(protein => {
            let pos = protein.pos.getRealPos();
            let sized = protein.sized;
            let realSize = (sized / 100) * min(width, height);
            let slaveStatus = protein.hasMaster() ? "slave: yes" : "slave: no";
            text(
                `width: ${width}\nsized: ${sized}\nrealSize: ${realSize.toFixed(2)}\n${slaveStatus}`,
                pos[0] + 10,
                pos[1] + 30
            );
        });

        

        this.proteins = [];
    }

    addToDraw(protein){
        this.proteins.push(protein)
    }
}
