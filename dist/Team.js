import { Worm } from "./animation/Worm";
import { WeaponManager } from "./weapons/WeaponManager";
import { Utilies } from "./system/Utils";
import { Game } from "./Game";
import { Physics } from "./system/Physics";
import { Sprites } from "./animation/SpriteDefinitions";
import { AssetManager } from "./system/AssetManager";
export class Team {
    constructor(gameInstance, playerId) {
        this.gameInstance = gameInstance;
        this.color = Utilies.pickUnqine(["#FA6C1D", "#12AB00", "#B46DD2", "#B31A35", "#23A3C6", "#9A4C44"], "colors");
        this.graveStone = Utilies.pickUnqine(["grave1", "grave2", "grave3", "grave4", "grave5", "grave6"], "gravestones");
        this.name = "Team " + Team.teamCount;
        this.teamId = playerId;
        Team.teamCount++;
        this.weaponManager = new WeaponManager();
        this.currentWorm = 0;
        this.initalNumberOfWorms = 4;
        this.worms = new Array(this.initalNumberOfWorms);
        for (let i = 0; i < this.initalNumberOfWorms; i++) {
            const tmp = Game.map.getNextSpawnPoint();
            this.worms[i] = new Worm(this, tmp.x, tmp.y);
        }
    }
    getTeamNetData() {
        const packet = {};
        for (const w in this.worms) {
            packet[w] = this.worms[w].getWormNetData();
        }
        return packet;
    }
    setTeamNetData(packetStream) {
        var _a;
        for (const w in packetStream) {
            (_a = this.worms[w]) === null || _a === void 0 ? void 0 : _a.setWormNetData(packetStream[w]);
        }
    }
    getPercentageHealth() {
        let totalHealth = 0;
        for (const worm of this.worms) {
            totalHealth += worm.health;
        }
        return totalHealth / this.initalNumberOfWorms;
    }
    areAllWormsDead() {
        for (const worm of this.worms) {
            if (!worm.isDead) {
                return false;
            }
        }
        return true;
    }
    getCurrentWorm() {
        return this.worms[this.currentWorm];
    }
    nextWorm() {
        this.currentWorm = (this.currentWorm + 1) % this.worms.length;
        if (this.worms[this.currentWorm].isDead) {
            this.nextWorm();
        }
        else {
            this.worms[this.currentWorm].activeWorm();
        }
    }
    getWeaponManager() {
        return this.weaponManager;
    }
    setCurrentWorm(wormIndex) {
        this.currentWorm = wormIndex;
    }
    getWorms() {
        return this.worms;
    }
    celebrate() {
        for (const worm of this.worms) {
            worm.setSpriteDef(Sprites.worms.weWon, true);
        }
        const pos = Physics.metersToPixelsVec(this.worms[0].body.GetPosition());
        this.gameInstance.camera.panToPosition(pos);
        AssetManager.getSound("victory").play(1, 15);
        AssetManager.getSound("Ireland").play(1, 16);
    }
    update() {
        for (const worm of this.worms) {
            worm.update();
        }
    }
    draw(ctx) {
        for (const worm of this.worms) {
            worm.draw(ctx);
        }
    }
}
Team.teamCount = 0;
