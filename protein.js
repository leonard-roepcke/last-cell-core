let proteinColors = {
  blue: "#4DCCDF",
  green: "#79DB42",
  black: "#462B23",
  pink: "#DB8993",
  purple: "#A74BBA",
  "blue-ish": "#235145",
  fade: "#CAC6F0",
  red: "#C43639",
  "green-ish": "#8EC783",
  navi: "#807538"
};

class Protein{
    constructor(color=proteinColors.black, sized=20){
        this.pos = new Position();
        this.color = color;
        this.sized = sized;
    }

    draw(){
        fill(this.color);
        stroke("#000000");
        strokeWeight(0);
        circle(this.pos.getPos()[0], this.pos.getPos()[1], this.sized)
    }

    setPos(pos=[0, 0]){
        this.pos.setPos(pos);
    }

    move(delta=[0, 0]){
        this.pos.move(delta);
    }
}


class Position{
    constructor(pos=[0, 0]){
        this.pos = pos
    }

    setPos(pos=[0, 0]){
        this.pos = pos
    }

    move(delta = [0, 0]) {
    this.pos[0] += delta[0];
    this.pos[1] += delta[1];
  }

    getPos(){
        return this.pos;
    }
}