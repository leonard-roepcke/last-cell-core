class Enemy_handler {
    constructor(drawHandler, player_ref) {
        this.player = player_ref;
        this.enemys = [];
        this.ememySpawnrate = 0.01 * globalSetting.ememySpawnrateBeginning;
    }

    update() {
        
        this.add_enemys();

        this.enemys.forEach(enemy => enemy.update(this.enemys));
    }

    add_enemy(pos = [0, 0]) {
        this.enemys.push(new Enemy(drawHandler, pos, this.player, this));
    }

    add_enemys() {
        this.ememySpawnrate += 0.000003 * globalSetting.ememySpawnrateIncrese;
        if (random() < this.ememySpawnrate) {
            const playerPos = this.player.pos.getPos();

            const viewWidth = 100;
            const viewHeight = 50;

            const minOffset = 50; 
            const maxOffset = 150; 

            let side = floor(random(4)); 

            let offsetX = 0;
            let offsetY = 0;

            switch (side) {
            case 0: 
                offsetX = -random(minOffset, maxOffset);
                offsetY = random(-maxOffset, maxOffset);
                break;
            case 1: 
                offsetX = random(minOffset, maxOffset);
                offsetY = random(-maxOffset, maxOffset);
                break;
            case 2: 
                offsetX = random(-maxOffset, maxOffset);
                offsetY = -random(minOffset, maxOffset);
                break;
            case 3: 
                offsetX = random(-maxOffset, maxOffset);
                offsetY = random(minOffset, maxOffset);
                break;
            }

            const spawnX = playerPos[0] + offsetX;
            const spawnY = playerPos[1] + offsetY;

            this.add_enemy([spawnX, spawnY]);
        }
    }

    destroyEnemy(enemy_ref) {
        this.enemys = this.enemys.filter(enemy => enemy !== enemy_ref);
    }


}

class Enemy {
    constructor(drawHandler, pos = [0, 0], player, enemyHandler) {
        this.enemyHandler = enemyHandler;
        this.drawHandler = drawHandler;
        this.player = player;
        this.core = new Protein(drawHandler, proteinColors.red, 1);
        this.core.setPos(pos);
        this.pos = new Position(pos);
        this.dirForce = [0, 0];
        this.speed = 0.03;
    }

    update(enemys) {
        this.calDirForce(enemys);
        this.pos.move([this.dirForce[0] * this.speed, this.dirForce[1] * this.speed]);
        this.core.setPos(this.pos.getPos());
        this.core.draw();

        let playerPos = this.player.pos.getPos();
        let myPos = this.pos.getPos();

        let dx = playerPos[0] - myPos[0];
        let dy = playerPos[1] - myPos[1];
        let dist = Math.hypot(dx, dy);

        let touchDist = 1; 
        let maxDist = 120;

        if (dist < touchDist) {
            if (typeof this.player.enemyTouch === "function") {
                this.player.enemyTouch(this);
            }
        }

        if (dist > maxDist) {
        const minOffset = 50;
        const maxOffset = 150;
        let side = floor(random(4));
        let offsetX = 0, offsetY = 0;

        switch (side) {
            case 0: offsetX = -random(minOffset, maxOffset); offsetY = random(-maxOffset, maxOffset); break;
            case 1: offsetX = random(minOffset, maxOffset); offsetY = random(-maxOffset, maxOffset); break;
            case 2: offsetX = random(-maxOffset, maxOffset); offsetY = -random(minOffset, maxOffset); break;
            case 3: offsetX = random(-maxOffset, maxOffset); offsetY = random(minOffset, maxOffset); break;
        }

        this.pos.setPos([playerPos[0] + offsetX, playerPos[1] + offsetY]);
    }

        this.pos.setRealPos();
    }


    calDirForce(enemys) {
        let playerPos = this.player.pos.getPos();
        let myPos = this.pos.getPos();

        let dir = [
            playerPos[0] - myPos[0],
            playerPos[1] - myPos[1]
        ];

        let attractLength = Math.hypot(dir[0], dir[1]);
        if (attractLength > 0) {
            dir = [dir[0] / attractLength, dir[1] / attractLength];
        }

        enemys.forEach(enemy => {
            if (enemy === this) return;

            let enemyPos = enemy.pos.getPos();
            let dx = myPos[0] - enemyPos[0];
            let dy = myPos[1] - enemyPos[1];
            let dist = Math.hypot(dx, dy);

            let safeDist = 5;
            if (dist < safeDist && dist > 0) {
                let repelStrength = 1;
                let force = (safeDist - dist) / safeDist * repelStrength;

                dx /= dist;
                dy /= dist;

                dir[0] += dx * force;
                dir[1] += dy * force;
            }
        });

        this.dirForce = dir;
    }

    destroyUreSelf(){
        this.enemyHandler.destroyEnemy(this);
    }
}
