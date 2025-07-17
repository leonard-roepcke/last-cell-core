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
    constructor(color=proteinColors.black){
        this.pos = new Position();
        this.color = color
    }

    draw(){
        fill(this.color);
        stroke("#000000");
        strokeWeight(0);
        circle(this.pos.x, this.pos.y, 100)
    }

    setPos(x = 0, y = 0){
        this.pos.setPos(x, y);
    }

    move(x=0, y=0){
        this.pos.move(x, y);
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

    move(x, y){
        this.x += x;
        this.y += y;
    }
}