function addAminoAcid(drawHandler, pos=[0, 0], master, aminoHandler=false){
    //i can be used also from other classes not from AminoHandler but master class
    //neads to implement addSlave() that beckoms the objekt and add its to the list.
    pos[0]+=1;
    pos[1]+=1;
    
    if (master == false){
        let slave = new Protein(drawHandler, proteinColors.navi, 0.3, false)
        slave.pos.setPos(pos)
        aminoHandler.addSlave(slave)
    }
    else{
        let slave = new Protein(drawHandler, proteinColors.navi, 0.3, master)
        slave.pos.setPos(pos)
        master.addSlave(slave)
    }
    
    
}

class AminoHandler{
    constructor(drawHandler, player){
        this.drawHandler = drawHandler;
        this.player = player;
        this.aminos = [];
        for (let i = 0; i < 20; i++) {
            addAminoAcid(this.drawHandler, [randomInt(0, 100), randomInt(0, 50)], false, this)  
        }
    }

    update(){
        this.aminos.forEach(amino => {
            amino.draw();
            if (!amino.hasMaster()) {
                let playerPos = this.player.pos.getPos();
                let aminoPos = amino.pos.getPos();
                let playerRad = this.player.core.getRadius();

                let dx = playerPos[0] - aminoPos[0];
                let dy = playerPos[1] - aminoPos[1];
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < playerRad*2) {
                    this.player.addSlave(amino);
                    amino.master = this.player
                }
            }
        });
    }

    addSlave(amino){
        this.aminos.push(amino)
    }
}