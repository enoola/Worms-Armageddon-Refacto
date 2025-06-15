/**
 * @namespace WormDataPacket
 * @description to make
 * @author qwenola
 * @version 1.0.0
 * @date 20250613
 */
import { b2Vec2 } from "./types/box2d-imports";
export class WormDataPacket {
    constructor(worm) {
        this.name = worm.name;
        this.position = worm.body.GetPosition();
    }
    override(worm) {
        worm.name = this.name;
        worm.body.SetPosition(new b2Vec2(this.position.x, this.position.y));
        worm.preRendering(); // Regenerate their names
    }
}
