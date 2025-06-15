/**
 * @namespace TeamDataPacket
 * @description Handles te
 * @author qwenola
 * @version 1.0.0
 * @date 20250613
 */
import { WormDataPacket } from "../WormDataPacket";
export class TeamDataPacket {
    constructor(team) {
        this.graveStone = team.graveStone;
        this.name = team.name;
        this.color = team.color;
        this.wormsDataPacket = [];
        for (const w in team.worms) {
            this.wormsDataPacket.push(new WormDataPacket(team.worms[w]));
        }
    }
    override(team) {
        team.name = this.name;
        team.graveStone = this.graveStone;
        team.color = this.color;
        for (let w in this.wormsDataPacket) {
            this.wormsDataPacket[w].override(team.getWorms()[w]);
        }
    }
}
