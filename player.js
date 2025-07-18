accel = 0.03;

class Player{
    constructor(drawHandler){
        this.drawHandler = drawHandler;
        this.core = new Protein(drawHandler, proteinColors.nucleus, 1.5)
        this.pos = new Position([50, 50])
        this.speed = [0, 0]

        this.slaves = [];

        this.level = 1;
        this.levelTrashhold = 5;
        this.levelTrashholdIncrese = 4
        }

    update(){
        this.core.setPos(this.pos.getPos())
        this.core.draw()
        this.speed[0] *= 0.93;
        this.speed[1] *= 0.93;
        this.pos.move(this.speed)

        this.slaves.forEach(slave => {
            slave.updatePosAsSlave(this.speed, this.slaves);
            slave.draw();
        });

        this.leveling();
        
    }

    move(){
        let up = keyIsDown(87);    // W
        let down = keyIsDown(83);  // S
        let left = keyIsDown(65);  // A
        let right = keyIsDown(68); // D

    
        if (up && !left && !right && !down) {
            this.speed[1] -= accel;
        }
        else if (down && !left && !right && !up) {
            this.speed[1] += accel;
        }
        else if (left && !up && !down && !right) {
            this.speed[0] -= accel;
        }
        else if (right && !up && !down && !left) {
            this.speed[0] += accel;
        }
        else if (up && left && !right && !down) {
            let v = accel / Math.sqrt(2);
            this.speed[0] -= v;
            this.speed[1] -= v;
        }
        else if (up && right && !left && !down) {
            let v = accel / Math.sqrt(2);
            this.speed[0] += v;
            this.speed[1] -= v;
        }
        else if (down && left && !right && !up) {
            let v = accel / Math.sqrt(2);
            this.speed[0] -= v;
            this.speed[1] += v;
        }
        else if (down && right && !left && !up) {
            let v = accel / Math.sqrt(2);
            this.speed[0] += v;
            this.speed[1] += v;
        }
        else if ((up && down) || (left && right)) {
        }
    }

    addSlave(slave){
        this.slaves.push(slave)
    }


    leveling(){
        if(this.slaves.length > this.levelTrashhold){
            this.level++;
            this.levelTrashhold += this.levelTrashholdIncrese;
            this.slaves.splice(-this.levelTrashhold);
        }
    }
}
