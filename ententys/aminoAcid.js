function addAminoAcid(drawHandler, pos=[0, 0], master, aminoHandler=false){
    //i can be used also from other classes not from AminoHandler but master class
    //neads to implement addSlave() that beckoms the objekt and add its to the list.
    pos[0]+=1;
    pos[1]+=1;
    
    if (master == false){
        let slave = new Protein(drawHandler, proteinColors.navi, 0.3, false, 0.5)
        slave.pos.setPos(pos)
        aminoHandler.addSlave(slave)
    }
    else{
        let slave = new Protein(drawHandler, proteinColors.navi, 0.3, master, 0.5)
        slave.pos.setPos(pos)
        master.addSlave(slave)
    }
    
    
}

class AminoHandler{
    constructor(drawHandler, player){
        this.drawHandler = drawHandler;
        this.player = player;
        this.aminoSpawrate = 0.07;
        this.aminos = [];
        for (let i = 0; i < 100; i++) {
            addAminoAcid(this.drawHandler, [randomInt(-200, 200), randomInt(-100, 100)], false, this)  
        }
    }

    update(){
        this.addAminoAcids();
        for (let i = this.aminos.length - 1; i >= 0; i--) {
            let amino = this.aminos[i];
            amino.draw();
            if (!amino.hasMaster()) {
                let playerPos = this.player.pos.getPos();
                let aminoPos = amino.pos.getPos();
                let playerRad = this.player.core.getRadius();

                let dx = playerPos[0] - aminoPos[0];
                let dy = playerPos[1] - aminoPos[1];
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < playerRad * 2.7) {
                this.player.addSlave(amino);
                amino.master = this.player;

                this.aminos.splice(i, 1); 
                }
                let maxDist = 120;
                if (distance > maxDist) {
                    const minOffset = 50;
                    const maxOffset = 150;
                    let side = floor(random(4));
                    let offsetX = 0, offsetY = 0;

                    switch (side) {
                        case 0: offsetX = -random(minOffset, maxOffset); offsetY = random(-maxOffset, maxOffset); break;
                        case 1: offsetX = random(minOffset, maxOffset); offsetY = random(-maxOffset, maxOffset); break;
                        case 2: offsetX = random(-maxOffset, maxOffset); offsetY = -random(minOffset, maxOffset); break;
                        case 3: offsetX = random(-maxOffset, maxOffset); offsetY = random(minOffset, maxOffset); break;
                    }

                    amino.pos.setPos([playerPos[0] + offsetX, playerPos[1] + offsetY]);
                }
            }
        }
    }



    addSlave(amino){
        this.aminos.push(amino)
    }


    addAminoAcids() {
        this.aminoSpawrate += 0.000000;
        if (random() < this.aminoSpawrate) {
            const playerPos = this.player.pos.getPos();

            const viewWidth = 100;
            const viewHeight = 50;

            const minOffset = 50; 
            const maxOffset = 150; 

            let side = floor(random(4)); 

            let offsetX = 0;
            let offsetY = 0;

            switch (side) {
            case 0: 
                offsetX = -random(minOffset, maxOffset);
                offsetY = random(-maxOffset, maxOffset);
                break;
            case 1: 
                offsetX = random(minOffset, maxOffset);
                offsetY = random(-maxOffset, maxOffset);
                break;
            case 2: 
                offsetX = random(-maxOffset, maxOffset);
                offsetY = -random(minOffset, maxOffset);
                break;
            case 3: 
                offsetX = random(-maxOffset, maxOffset);
                offsetY = random(minOffset, maxOffset);
                break;
            }

            const spawnX = playerPos[0] + offsetX;
            const spawnY = playerPos[1] + offsetY;

            addAminoAcid(this.drawHandler, [spawnX, spawnY], false, this);
        }
    }
}