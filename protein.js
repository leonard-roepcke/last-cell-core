/*
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
  navi: "#807538",
  membrane: "#E0E8D9",     
  cytoplasm: "#DFF0E2",    
  background: "#F5F5F0",   
  screen: "#E8EDEE",       
  nucleus: "#D1C4E9",  
};
*/

let proteinColors = {
  blue: "#6ECFF6",
  green: "#A8E6CF",
  black: "#0A0A0A",
  pink: "#F8BBD0",
  purple: "#CBAACB",
  "blue-ish": "#9EE7E2",
  fade: "#B5C9F0",
  red: "#FF6B6B",
  "green-ish": "#C0F5B5",
  navi: "#F4E285",
  membrane: "#D3E8FF",
  cytoplasm: "#B6D7A8",
  nucleus: "#E7D2F9",
  background: "#000000",
  screen: "#121212"
};


class Protein{
    constructor(drawHandler, color=proteinColors.black, sized=20, master=false){
        this.drawHandler = drawHandler;
        this.pos = new Position();
        this.color = color;
        this.sized = sized;
        this.master = master;

        //slave traids
        this.optimalDistance = 4;
        this.slaveStrength = 0.35;
    }

    draw(){
        fill(this.color);
        stroke("#000000");
        strokeWeight(0);
        this.drawHandler.addToDraw(this);
        //circle(this.pos.getRealPos()[0], this.pos.getRealPos()[1], this.sized)
    }

    setPos(pos=[0, 0]){
        this.pos.setPos(pos);
    }

    move(delta=[0, 0]){
        this.pos.move(delta);
    }

    setMaster(master){
        this.master = master;
    }

    updatePosAsSlave() {
        let masterPos = this.master.pos.getPos();
        let myPos = this.pos.getPos();

        let dir = [
            masterPos[0] - myPos[0],
            masterPos[1] - myPos[1]
        ];

        let dist = Math.hypot(dir[0], dir[1]);

        let delta = dist - this.optimalDistance;

        if (dist > 0) {
            dir = [dir[0] / dist, dir[1] / dist];
        }

        if (delta < 0) {
            dir = [-dir[0], -dir[1]];
            delta = Math.abs(delta);
        }

        let force = [
            dir[0] * delta * this.slaveStrength,  
            dir[1] * delta * this.slaveStrength
        ];

        this.pos.move(force);

        this.pos.setPos(this.pos.getPos());
    }
}


class Position{
    constructor(pos=[0, 0]){
        this.pos = pos;
        this.realPos;
        this.setRealPos();
    }

    setPos(pos=[0, 0]){
        this.pos = pos;
        this.setRealPos();
    }

    move(delta = [0, 0]) {
        this.pos[0] += delta[0];
        this.pos[1] += delta[1];
        this.setRealPos();
    }

    getPos(){
        return this.pos;
    }

    setRealPos() {
        this.realPos = [
            (this.pos[0]/100) * width,
            (this.pos[1]/50) * height
        ];
    }

    getRealPos(){
        return this.realPos;
    }
}