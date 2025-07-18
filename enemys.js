class Enemy_handler {
    constructor(drawHandler, player_ref) {
        this.player = player_ref;
        this.enemys = [];
        for (let i = 0; i < 3; i++) {
            this.add_enemy([10, i * 10 + 5]);
        }
    }

    update() {
        this.enemys.forEach(enemy => enemy.update(this.enemys));
    }

    add_enemy(pos = [0, 0]) {
        this.enemys.push(new Enemy(drawHandler, pos, this.player));
    }
}

class Enemy {
    constructor(drawHandler, pos = [0, 0], player) {
        this.drawHandler = drawHandler;
        this.player = player;
        this.core = new Protein(drawHandler, proteinColors.red);
        this.core.setPos(pos);
        this.pos = new Position(pos);
        this.dirForce = [0, 0];
        this.speed = 0.07;
    }

    update(enemys) {
        this.calDirForce(enemys);
        this.pos.move([this.dirForce[0] * this.speed, this.dirForce[1] * this.speed]);
        this.core.setPos(this.pos.getPos());
        this.core.draw();
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
}
