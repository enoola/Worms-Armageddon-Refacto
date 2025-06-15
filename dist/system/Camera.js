/**
 * @class Camera
 * @description Camera class controls the viewport
 * @author qwenola
 * @version 1.0.0
 * @date 20250613
 */
import { b2Vec2 } from "../types/box2d-imports";
//import type { b2Vec2 as b2Vec2Type } from '../types/box2d-types'; // Optional if you're using ambient declarations
export class Camera {
    constructor(levelWidth, levelHeight, vpWidth, vpHeight) {
        this.levelWidth = levelWidth;
        this.levelHeight = levelHeight;
        this.vpWidth = vpWidth;
        this.vpHeight = vpHeight;
        this.position = new b2Vec2(0, 0);
        this.panPosition = new b2Vec2(0, 0);
        this.panSpeed = 6.1;
        this.toPanOrNotToPan = false;
    }
    update() {
        if (this.toPanOrNotToPan) {
            if (this.panPosition.x > this.position.x) {
                this.incrementX(this.panSpeed);
            }
            if (this.panPosition.x < this.position.x) {
                this.incrementX(-this.panSpeed);
            }
            if (this.panPosition.y > this.position.y) {
                this.incrementY(this.panSpeed);
            }
            if (this.panPosition.y < this.position.y) {
                this.incrementY(-this.panSpeed);
            }
        }
    }
    cancelPan() {
        this.toPanOrNotToPan = false;
    }
    panToPosition(vector) {
        const target = new b2Vec2(vector.x - this.vpWidth / 2, vector.y - this.vpHeight / 2);
        const currentPos = this.position.Clone(); // assuming Clone() is available in b2Vec2
        currentPos.Subtract(target); // or currentPos.SelfSubtract(target)
        const diff = currentPos.Length() / 25;
        this.panSpeed = diff;
        this.panPosition = target;
        this.toPanOrNotToPan = true;
    }
    getX() {
        return this.position.x;
    }
    getY() {
        return this.position.y;
    }
    setX(x) {
        if (this.vpWidth + x <= this.levelWidth && x >= 0) {
            this.position.x = x;
            return true;
        }
        return false;
    }
    setY(y) {
        if (this.vpHeight + y <= this.levelHeight && y >= 0) {
            this.position.y = y;
            return true;
        }
        return false;
    }
    incrementX(x) {
        return this.setX(this.position.x + x);
    }
    incrementY(y) {
        return this.setY(this.position.y + y);
    }
}
