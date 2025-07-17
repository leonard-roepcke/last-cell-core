accel = 0.26;

class Player{
    constructor(){
        this.core = new Protein(undefined, 30)
        this.pos = new Position([windowResized()[0]/2, windowResized()[1]/2])
        this.speed = [0, 0]
    }

    update(){
        this.core.setPos(this.pos.getPos())
        this.core.draw()
        this.speed[0] *= 0.93;
        this.speed[1] *= 0.93;
        this.pos.move(this.speed)
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
}