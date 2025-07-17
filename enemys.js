class Enemy_handler{
    constructor(player_ref){
        this.player = player_ref;
        this.enemys = [];
        for (let i = 0; i < 10; i++) {
            this.add_enemy([10, i*10+ 5])
        }
    }

    update(){
        this.enemys.forEach(enemy => enemy.update())
    }

    add_enemy(pos=[0, 0]){
        this.enemys.push(new Enemy(pos, this.player))
    }
}

class Enemy{
    constructor(pos=[0, 0], player){
        this.player = player
        this.core = new Protein(proteinColors.red);
        this.core.setPos(pos);
        this.pos = new Position(pos);
        this.dirForce = [0, 0]
        this.speed = 0.07
    }

    update(){
        this.calDirForce();
        this.pos.move(this.dirForce);
        this.core.setPos(this.pos.getPos());
        this.core.draw();
    }

    calDirForce() {
        let playerPos = this.player.pos.getPos(); 
        let myPos = this.pos.getPos();      

        let dir = [
            playerPos[0] - myPos[0],
            playerPos[1] - myPos[1]
        ];

        let length = Math.hypot(dir[0], dir[1]) / this.speed;

        if (length > 0) {
            dir = [dir[0] / length, dir[1] / length];
        }

        this.dirForce = dir;
    }   
}