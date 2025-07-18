class Enemy_handler {
    constructor(drawHandler, player_ref) {
        this.drawHandler = drawHandler; // drawHandler speichern
        this.player = player_ref;
        this.enemys = [];
        this.enemySpawnrate = 0.01 * globalSetting.ememySpawnrateBeginning;
        this.enemysSpawned = 1;
    }

    update() {
        this.add_enemys();

        this.enemys.forEach(enemy => enemy.update(this.enemys));
    }

    add_enemy(pos = [0, 0]) {
        this.enemys.push(new Enemy(this.drawHandler, pos, this.player, this));
    }

    add_enemys() {
        this.enemySpawnrate += 0.000003 * globalSetting.ememySpawnrateIncrese;
        if (random() < this.enemySpawnrate) {
            const playerPos = this.player.pos.getPos();

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
            this.enemysSpawned++;
        }
    }

    destroyEnemy(enemy_ref) {
        this.enemys = this.enemys.filter(enemy => enemy !== enemy_ref);
    }

    getEnemysNumber(){
        return this.enemysSpawned;
    }
}

class Enemy {
    constructor(drawHandler, pos = [0, 0], player, enemyHandler) {
        this.enemyHandler = enemyHandler;
        this.drawHandler = drawHandler;
        this.player = player;

        this.core = new Protein(drawHandler, proteinColors.red, globalSetting.enemySize);
        this.pos = new Position(pos);
        this.core.setPos(this.pos.getPos());

        this.dirForce = [0, 0];
        this.speed = 0.03;
        this.tempSpeedMod = 1;

        this.proteins = [];
        while (random() < 0.2+(this.enemyHandler.getEnemysNumber()*0.001*globalSetting.enemyGroth)){
            this.proteins.push(new Protein(this.drawHandler, proteinColors.red, 1.2, this, 2, this.pos.getPos(), proteinTyps.speeder));
        
        }
        
    }

    update(enemys) {
        this.tempSpeedMod = 1;

        const moveVector = [this.dirForce[0] * this.speed * this.tempSpeedMod, this.dirForce[1] * this.speed * this.tempSpeedMod];


        this.proteins.forEach(protein => {
            protein.updatePosAsProtein(moveVector, this.proteins);
            protein.update();
            protein.draw();
        });

        this.calDirForce(enemys);

        this.pos.move([
            this.dirForce[0] * this.speed * this.tempSpeedMod,
            this.dirForce[1] * this.speed * this.tempSpeedMod
        ]);

        this.core.setPos(this.pos.getPos());
        this.core.draw();

        let playerPos = this.player.pos.getPos();
        let myPos = this.pos.getPos();

        let dx = playerPos[0] - myPos[0];
        let dy = playerPos[1] - myPos[1];
        let dist = Math.hypot(dx, dy);

        const touchDist = 1;
        const maxDist = 120;

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

            let safeDist = 5 * globalSetting.enemySepDistace;
            if (dist < safeDist && dist > 0) {
                let repelStrength = 1;
                let force = (safeDist - dist) / safeDist * repelStrength;

                dx /= dist;
                dy /= dist;

                dir[0] += dx * force;
                dir[1] += dy * force;
            }
        });

        let finalLength = Math.hypot(dir[0], dir[1]);
        if (finalLength > 0) {
            dir = [dir[0] / finalLength, dir[1] / finalLength];
        }

        this.dirForce = dir;
    }

    destroyUreSelf() {
        this.enemyHandler.destroyEnemy(this);
    }

    addSpeedMod() {
        this.tempSpeedMod += 0.5;
    }
}
