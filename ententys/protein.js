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

const proteinColors = {
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

const proteinTyps = {
    amino:"amino",
    speeder:"speeder",
    eater:"eater",
    //shooter:"shooter",

}


class Protein{
    constructor(drawHandler, color=proteinColors.black, sized=0.5, master=null, distace=1.5, pos=[0,0], typ=proteinTyps.amino){
        this.typ = typ;
        this.drawHandler = drawHandler;
        this.pos = new Position(pos);
        this.color = color;
        this.sized = sized;
        this.master = master;
        this.delTag = false;

        //slave traids
        this.optimalDistance = distace;
        this.slaveStrength = 0.35;


        //eater traids
        this.eaterReloteTime = globalSetting.eaterReloteTime;
        this.eaterReloteTimer = 0;
        
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

    update(){
        switch(this.typ){
            case proteinTyps.speeder:
                this.updateAsSpeeder();
                break;

            case proteinTyps.eater:
                this.updateAsEater();
                break;
        }
    }

    updateAsSpeeder(){
        this.master.addSpeedMod();
    }

    updateAsEater(){
        if(this.eaterReloteTimer == 0){
            this.master.tempEatCapasity++;
            this.eaterReloteTimer = this.eaterReloteTime;
        } else {
            this.eaterReloteTimer--;
        }
    }



    updatePosAsSlave(speed, slaves, proteins = []) {
        if (typeof speed === 'number') {
            speed = [speed, speed];
        }
        if (!Array.isArray(speed) || speed.length !== 2 || speed.some(isNaN)) {
            console.warn("Ungültiger Speed-Wert", speed);
            return;
        }

        if (!this.master || !this.master.pos || !this.master.pos.getPos) return;

        let target = this.master.pos.getPos();
        if (target.some(isNaN)) return;

        let myPos = this.pos.getPos();
        if (myPos.some(isNaN)) return;

        let adjusted = [speed[0] * 0.90, speed[1] * 0.90];

        let targets = [this.master, ...proteins];
        let minDist = Infinity;

        targets.forEach(protein => {
            if (protein === this || !protein.pos || !protein.pos.getPos) return;
            let pPos = protein.pos.getPos();
            if (pPos.some(isNaN)) return;

            let dx = pPos[0] - myPos[0];
            let dy = pPos[1] - myPos[1];
            let d = Math.hypot(dx, dy);

            if (d < minDist) {
                minDist = d;
                target = pPos;
            }
        });

        let dir = [
            target[0] - myPos[0],
            target[1] - myPos[1]
        ];

        let dist = Math.hypot(dir[0], dir[1]);
        let delta = dist - this.optimalDistance * 1.5;

        if (dist > 0) {
            dir = [dir[0] / dist, dir[1] / dist];
        }

        if (Math.abs(delta) > 0.1) {
            let force = delta * (this.slaveStrength * 0.5);
            adjusted[0] += dir[0] * force;
            adjusted[1] += dir[1] * force;
        }

        for (let i = 0; i < slaves.length; i++) {
            let slave = slaves[i];
            if (slave === this || !slave.pos || !slave.pos.getPos) continue;
            let otherPos = slave.pos.getPos();
            if (otherPos.some(isNaN)) continue;

            let dx = myPos[0] - otherPos[0];
            let dy = myPos[1] - otherPos[1];
            let d = Math.hypot(dx, dy);

            let safeDist = this.optimalDistance * 1.5; 

            if (d < safeDist && d > 0) {
                let repel = (safeDist - d) / safeDist * 0.7;
                dx /= d;
                dy /= d;
                adjusted[0] += dx * repel;
                adjusted[1] += dy * repel;
            }
        }

        let len = Math.hypot(adjusted[0], adjusted[1]);
        let maxForce = 1.5;
        if (len > maxForce) {
            adjusted[0] = (adjusted[0] / len) * maxForce;
            adjusted[1] = (adjusted[1] / len) * maxForce;
        }

        if (adjusted.some(isNaN)) {
            console.warn("NaN in adjusted delta", adjusted, { myPos, target });
            return;
        }

        this.pos.move(adjusted);
    }



    updatePosAsProtein(speed, slaves) {
        let masterPos = this.master.pos.getPos();
        let myPos = this.pos.getPos();

        let adjusted = [speed[0] * 0.90, speed[1] * 0.90];

        let dir = [
            masterPos[0] - myPos[0],
            masterPos[1] - myPos[1]
        ];

        let dist = Math.hypot(dir[0], dir[1]);
        let delta = dist - this.optimalDistance * 1.5;

        if (dist > 0) {
            dir = [dir[0] / dist, dir[1] / dist];
        }

        if (Math.abs(delta) > 0.1) {
            let force = delta * (this.slaveStrength * 0.5);
            adjusted[0] += dir[0] * force;
            adjusted[1] += dir[1] * force;
        }

        for (let i = 0; i < slaves.length; i++) {
            let slave = slaves[i];
            if (slave === this) break;

            let otherPos = slave.pos.getPos();
            let dx = myPos[0] - otherPos[0];
            let dy = myPos[1] - otherPos[1];
            let d = Math.hypot(dx, dy);

            let safeDist = this.optimalDistance * 1.8;

            if (d < safeDist && d > 0) {
                let repel = (safeDist - d) / safeDist * 0.7;
                dx /= d;
                dy /= d;
                adjusted[0] += dx * repel;
                adjusted[1] += dy * repel;
            }
        }

        let len = Math.hypot(adjusted[0], adjusted[1]);
        let maxForce = 1.5;
        if (len > maxForce) {
            adjusted[0] = (adjusted[0] / len) * maxForce;
            adjusted[1] = (adjusted[1] / len) * maxForce;
        }

        // NEU: Failsafe -> Wenn zu weit weg, dann sofort ran teleportieren
        let screenLimit = Math.min(width, height) * 0.5; // Halber Bildschirm (oder passe an)
        if (dist > screenLimit) {
            // Leicht versetzt teleportieren
            let offsetX = random(-5, 5);
            let offsetY = random(-5, 5);
            this.pos.setPos([masterPos[0] + offsetX, masterPos[1] + offsetY]);
        } else {
            this.pos.move(adjusted);
        }
    }


    hasMaster(){
        return !!this.master;
    }

    getRadius(){
        return this.sized/2;
    }

    setDelTag(){
        this.delTag = true;
    }

    getDelTag(){
        return this.delTag;
    }

}


class Position {
    constructor(pos = [0, 0]) {
        this.setPos(pos, true);
    }

    setPos(pos = [0, 0], fromConstructor = false) {
        let [x, y] = pos;

        if (!Array.isArray(pos) || pos.length < 2) {
            console.error("setPos: Ungültiges Position-Array:", pos);
            x = 0;
            y = 0;
        }

        x = Number(x);
        y = Number(y);

        if (Number.isNaN(x) || Number.isNaN(y)) {
            console.error("setPos: NaN-Werte erkannt bei:", pos);
            x = 0;
            y = 0;
        }

        if (fromConstructor) {
            this.pos = [x + 1, y + 1];
        } else {
            this.pos = [x, y];
        }

        this.setRealPos();
    }

    move(delta = [0, 0], tempSpeedMod = 1) {
        if (!Array.isArray(delta) || delta.length < 2) {
            console.error("move: Ungültiges Delta-Array:", delta);
            delta = [0, 0];
        }

        let dx = Number(delta[0]);
        let dy = Number(delta[1]);

        if (Number.isNaN(dx) || Number.isNaN(dy)) {
            console.error("move: NaN in Delta erkannt:", delta);
            console.trace();
            dx = 0;
            dy = 0;
        }

        dx *= tempSpeedMod;
        dy *= tempSpeedMod;

        this.pos[0] += dx;
        this.pos[1] += dy;

        if (Number.isNaN(this.pos[0]) || Number.isNaN(this.pos[1])) {
            console.error("move: Position wurde NaN nach Bewegung:", this.pos, "Delta war:", delta);
            this.pos = [0, 0];
        }

        this.setRealPos();
    }

    getPos() {
        return this.pos;
    }

    setRealPos() {
        const [x, y] = this.pos;

        if (typeof width !== "number" || typeof height !== "number") {
            console.error("setRealPos: width oder height nicht definiert:", { width, height });
        }

        this.realPos = [
            (x / 100) * width,
            (y / 50) * height
        ];

        if (this.realPos.some(n => Number.isNaN(n))) {
            console.error("setRealPos: NaN in realPos berechnet aus", this.pos);
        }
    }

    getRealPos() {
        return this.realPos;
    }
}
