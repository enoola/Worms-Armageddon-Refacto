/**
 * @namespace WormDataPacket
 * @description to make 
 * @author qwenola
 * @version 1.0.0
 * @date 20250613
 */

import { Worm } from "../Worm" 


export class WormDataPacket {
    name;
    position;

    constructor(worm: Worm) {
        this.name = worm.name;
        this.position = worm.body.GetPosition();
    }

    override(worm: Worm) {
        worm.name = this.name;
        worm.body.SetPosition(new b2Vec2(this.position.x, this.position.y));
        worm.preRendering(); // Regenerate their names
    }
}