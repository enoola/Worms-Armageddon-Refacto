import { SpriteDefinition } from "./SpriteDefinitions";
import { AssetManager } from "./system/AssetManager";

export class Sprite {
    spriteDef!: SpriteDefinition;
    currentFrameY!: number;
    finished = false;
    noLoop = false;
    lastUpdateTime = 0;
    accumulateDelta = 0;
    isSpriteLocked = false;
    onFinishFunc: (() => void) | null = null;
    frameHeight!: number;
    image!: HTMLImageElement;
    frameIncremeter = 1;

    constructor(spriteDef: SpriteDefinition, noLoop = false) {
        this.lastUpdateTime = Date.now();
        this.setSpriteDef(spriteDef);
        this.noLoop = noLoop;
    }

    update(): void {
        if (this.finished) return;

        const delta = Date.now() - this.lastUpdateTime;

        this.accumulateDelta += delta;

        if (this.accumulateDelta > this.spriteDef.msPerFrame) {
            this.accumulateDelta = 0;
            this.currentFrameY += this.frameIncremeter;

            if (this.currentFrameY >= this.spriteDef.frameCount) {
                if (this.noLoop) {
                    this.finished = true;
                    if (this.onFinishFunc) {
                        this.onFinishFunc();
                        this.onFinishFunc = null;
                        return;
                    }
                }

                this.currentFrameY = this.spriteDef.frameY; // reset to start
            }

            this.lastUpdateTime = Date.now();
        }
    }

    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        const tmpCurrentFrameY = Math.floor(this.currentFrameY);
        if (tmpCurrentFrameY >= 0) {
            ctx.drawImage(
                this.image,
                0, tmpCurrentFrameY * this.frameHeight, this.image.width, this.frameHeight,
                Math.floor(x),
                Math.floor(y),
                this.image.width,
                this.frameHeight
            );
        }
    }

    getImage(): HTMLImageElement {
        return this.image;
    }

    getCurrentFrame(): number {
        return this.currentFrameY;
    }

    setCurrentFrame(frame: number): void {
        if (frame >= 0 && frame < this.spriteDef.frameCount) {
            this.currentFrameY = frame;
        }
    }

    getFrameHeight(): number {
        return this.frameHeight;
    }

    getFrameWidth(): number {
        return this.image.width;
    }

    getTotalFrames(): number {
        return this.spriteDef.frameCount;
    }

    setSpriteDef(spriteDef: SpriteDefinition, lockSprite = false, noLoop = false): void {
        if (spriteDef !== this.spriteDef) {
            if (!this.isSpriteLocked) {
                this.noLoop = noLoop;
                this.finished = false;
                this.spriteDef = spriteDef;
                this.currentFrameY = spriteDef.frameY;
                this.isSpriteLocked = lockSprite;

                this.image = AssetManager.getImage(spriteDef.imageName);
                this.frameHeight = this.image.height / spriteDef.frameCount;
            }
        }

        if (this.spriteDef === spriteDef) {
            this.isSpriteLocked = lockSprite;
        }
    }
}