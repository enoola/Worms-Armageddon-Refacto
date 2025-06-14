
//extracted from Teams.ts

import { Team } from "../Team";
import { WormDataPacket } from "../WormDataPacket";

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