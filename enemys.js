enemy_speed = 1

class Enemy_handler{
    constructor(){
        this.enemys = [];
        for (let i = 0; i < 10; i++) {
            this.add_enemy([10, i*60+ 40])
        }
    }

    update(){
        this.enemys.forEach(enemy => enemy.update())
    }

    add_enemy(pos=[0, 0]){
        this.enemys.push(new Enemy(pos))
    }
}

class Enemy{
    constructor(pos=[0, 0]){
        this.core = new Protein(proteinColors.red);
        this.core.setPos(pos);
        this.pos = new Position(pos);
        this.speed = [0, 0];
    }

    update(){
        
        this.pos.move([1, 0]);
        this.core.setPos(this.pos.getPos());
        this.core.draw();
    }
}