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
        this.aminos = [];
        for (let i = 0; i < 100; i++) {
            addAminoAcid(this.drawHandler, [randomInt(0, 100), randomInt(0, 50)], false, this)  
        }
    }

    update(){
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

      this.aminos.splice(i, 1); // <-- entfernt das Element aus dem Array
    }
  }
}}


    addSlave(amino){
        this.aminos.push(amino)
    }
}