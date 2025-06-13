/**
 * @class Camera
 * @description Camera class controls the viewport
 * @author qwenola
 * @version 1.0.0
 * @date 20250613
 */

import { b2Vec2 } from "./box2d-imports";
//import type { b2Vec2 as b2Vec2Type } from '../types/box2d-types'; // Optional if you're using ambient declarations


export class Camera {
    position!: b2Vec2;
    levelWidth: number;
    levelHeight: number;
    vpWidth: number;
    vpHeight: number;

    panPosition!: b2Vec2;
    panSpeed: number;
    toPanOrNotToPan: boolean;

    constructor(levelWidth: number, levelHeight: number, vpWidth: number, vpHeight: number) {
        this.levelWidth = levelWidth;
        this.levelHeight = levelHeight;
        this.vpWidth = vpWidth;
        this.vpHeight = vpHeight;

        this.position = new b2Vec2(0, 0);
        this.panPosition = new b2Vec2(0, 0);

        this.panSpeed = 6.1;
        this.toPanOrNotToPan = false;
    }

    update(): void {
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

    cancelPan(): void {
        this.toPanOrNotToPan = false;
    }

    panToPosition(vector: b2Vec2): void {
        const target = new b2Vec2(vector.x - this.vpWidth / 2, vector.y - this.vpHeight / 2);
        const currentPos = this.position.Clone(); // assuming Clone() is available in b2Vec2
        currentPos.Subtract(target); // or currentPos.SelfSubtract(target)
        const diff = currentPos.Length() / 25;

        this.panSpeed = diff;
        this.panPosition = target;
        this.toPanOrNotToPan = true;
    }

    getX(): number {
        return this.position.x;
    }

    getY(): number {
        return this.position.y;
    }

    setX(x: number): boolean {
        if (this.vpWidth + x <= this.levelWidth && x >= 0) {
            this.position.x = x;
            return true;
        }
        return false;
    }

    setY(y: number): boolean {
        if (this.vpHeight + y <= this.levelHeight && y >= 0) {
            this.position.y = y;
            return true;
        }
        return false;
    }

    incrementX(x: number): boolean {
        return this.setX(this.position.x + x);
    }

    incrementY(y: number): boolean {
        return this.setY(this.position.y + y);
    }
}