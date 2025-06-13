import { Worm } from "./animation/Worm";
import { WeaponManager } from "./weapons/WeaponManager";
import { BounceArrow } from "./animation/BounceArrow";
import { Utilies } from "./system/Utils";
import { Game } from "./Game";
import { Physics } from "./system/Physics";
import { Sprites } from "./animation/SpriteDefinitions";
import { AssetManager } from "./system/AssetManager";

export class Team {
    worms: Worm[];
    currentWorm: number;
    weaponManager: WeaponManager;
    color!: string;
    name!: string;
    graveStone!: string;
    teamId: number;
    initalNumberOfWorms: number;

    static teamCount = 0;

    constructor(playerId: number) {
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

    getTeamNetData(): { [key: number]: any } {
        const packet: { [key: number]: any } = {};
        for (const w in this.worms) {
            packet[w] = this.worms[w].getWormNetData();
        }
        return packet;
    }

    setTeamNetData(packetStream: { [key: number]: any }): void {
        for (const w in packetStream) {
            this.worms[w]?.setWormNetData(packetStream[w]);
        }
    }

    getPercentageHealth(): number {
        let totalHealth = 0;
        for (const worm of this.worms) {
            totalHealth += worm.health;
        }
        return totalHealth / this.initalNumberOfWorms;
    }

    areAllWormsDead(): boolean {
        for (const worm of this.worms) {
            if (!worm.isDead) {
                return false;
            }
        }
        return true;
    }

    getCurrentWorm(): Worm {
        return this.worms[this.currentWorm];
    }

    nextWorm(): void {
        this.currentWorm = (this.currentWorm + 1) % this.worms.length;

        if (this.worms[this.currentWorm].isDead) {
            this.nextWorm();
        } else {
            this.worms[this.currentWorm].activeWorm();
        }
    }

    getWeaponManager(): WeaponManager {
        return this.weaponManager;
    }

    setCurrentWorm(wormIndex: number): void {
        this.currentWorm = wormIndex;
    }

    getWorms(): Worm[] {
        return this.worms;
    }

    celebrate(): void {
        for (const worm of this.worms) {
            worm.setSpriteDef(Sprites.worms.weWon, true);
        }

        const pos = Physics.metersToPixelsVec(this.worms[0].body.GetPosition());
        GameInstance.camera.panToPosition(pos);

        AssetManager.getSound("victory").play(1, 15);
        AssetManager.getSound("Ireland").play(1, 16);
    }

    update(): void {
        for (const worm of this.worms) {
            worm.update();
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for (const worm of this.worms) {
            worm.draw(ctx);
        }
    }
}

export class TeamDataPacket {
    wormsDataPacket: WormDataPacket[];
    name!: string;
    graveStone!: string;
    color!: string;

    constructor(team: Team) {
        this.graveStone = team.graveStone;
        this.name = team.name;
        this.color = team.color;
        this.wormsDataPacket = [];

        for (const w in team.worms) {
            this.wormsDataPacket.push(new WormDataPacket(team.worms[w]));
        }
    }

    override(team: Team): void {
        team.name = this.name;
        team.graveStone = this.graveStone;
        team.color = this.color;

        for (let w in this.wormsDataPacket) {
            this.wormsDataPacket[w].override(team.getWorms()[w]);
        }
    }
}