

class Player{
    constructor(drawHandler, ui){
        this.ui = ui
        this.ui.sendPlayerRef(this);
        this.drawHandler = drawHandler;
        this.core = new Protein(drawHandler, proteinColors.nucleus, globalSetting.playerSize)
        this.pos = new Position([50, 25])
        this.speed = [0, 0]
        this.accel = 0.01 * globalSetting.playerspeed;

        //upgrade modiviers permanent but tempory mods no need to change these
        this.tempSpeedMod = 1; 
        this.tempEatCapasity = 0;
        this.eaterOpenToEat = 0;

        this.slaves = [];
        this.proteins = [];

        this.level = 1;
        this.levelTrashhold = globalSetting.levelTrashholdBeginning; 
        this.levelTrashholdIncrese = globalSetting.levelTrashholdIncrese;



        this.addProtein(proteinTyps.speeder);
        

        }

        update(){
            

            this.slaves.forEach(slave => {
                slave.updatePosAsSlave(this.speed, this.slaves,this.proteins);
                slave.draw();
            });

            this.tempSpeedMod = 1;
            //this.tempEatCapasity = 0;

            this.proteins.forEach(protein => {
                protein.updatePosAsProtein(this.speed, this.proteins);
                protein.update();
                protein.draw();
            });

            this.leveling();

            this.core.setPos(this.pos.getPos());
            this.core.draw();
            this.speed[0] *= 0.93;
            this.speed[1] *= 0.93;
            this.pos.move(this.speed, this.tempSpeedMod);
            this.drawHandler.setPlayerPos(this.pos.getPos());
            
        }

        move(){
            let up = keyIsDown(87); //W
            let down = keyIsDown(83); //S
            let left = keyIsDown(65); //A
            let right = keyIsDown(68); //D

        
            if (up && !left && !right && !down) {
                this.speed[1] -= this.accel;
            }
            else if (down && !left && !right && !up) {
                this.speed[1] += this.accel;
            }
            else if (left && !up && !down && !right) {
                this.speed[0] -= this.accel;
            }
            else if (right && !up && !down && !left) {
                this.speed[0] += this.accel;
            }
            else if (up && left && !right && !down) {
                let v = this.accel / Math.sqrt(2);
                this.speed[0] -= v;
                this.speed[1] -= v;
            }
            else if (up && right && !left && !down) {
                let v = this.accel / Math.sqrt(2);
                this.speed[0] += v;
                this.speed[1] -= v;
            }
            else if (down && left && !right && !up) {
                let v = this.accel / Math.sqrt(2);
                this.speed[0] -= v;
                this.speed[1] += v;
            }
            else if (down && right && !left && !up) {
                let v = this.accel / Math.sqrt(2);
                this.speed[0] += v;
                this.speed[1] += v;
            }
            else if ((up && down) || (left && right)) {
            }
        }

        addSlave(slave){
            this.slaves.push(slave);
        }


        leveling(){
            if(this.slaves.length > this.levelTrashhold){
                this.level++;
                this.levelTrashhold += this.levelTrashholdIncrese;
                this.slaves.splice(-this.levelTrashhold);
                this.ui.setState(posibleUistates.levelup);
            }
        }

        addSpeedMod(){
            this.tempSpeedMod += 0.5;
        }

        addEaterMod(){
            this.tempEatCapasity += 1;
        }

        addProtein(proteintyp = proteinTyps.speeder){
            if (proteintyp == proteinTyps.speeder){
                this.proteins.push(new Protein(this.drawHandler, proteinColors.green, 1.2, this, 2, this.pos.getPos(), proteinTyps.speeder))
            }
            else if (proteintyp == proteinTyps.eater){
                this.proteins.push(new Protein(this.drawHandler, proteinColors.purple, 1.8, this, 2, this.pos.getPos(), proteinTyps.eater))
            }
            else{
                this.proteins.push(new Protein(this.drawHandler, proteinColors.green, 1.2, this, 2, this.pos.getPos(), proteinTyps.speeder))
            
            }
            
        
        }

        enemyTouch(enemy_ref){
            if(this.tempEatCapasity > 0){
                this.tempEatCapasity--;
                enemy_ref.destroyUreSelf();
            } else {
                this.ui.setState(posibleUistates.gameover);
            }
        }



        isOpenToEate(){
            if(this.eaterOpenToEat > 0){
                this.eaterOpenToEat--;
                return true;
            }
            else {
                return false;
            }
        }
}
