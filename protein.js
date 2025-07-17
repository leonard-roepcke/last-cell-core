class Protein{
    constructor(){
        this.pos = new Position();
    }

    draw(){
        circle(this.pos.x, this.pos.y, 100)
    }

    setPos(x = 0, y = 0){
        this.pos.setPos(x, y);
    }
}

class Position{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    setPos(x, y){
        this.x = x;
        this.y = y;
    }
}