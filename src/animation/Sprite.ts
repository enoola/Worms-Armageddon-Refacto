import { AssetManager } from "@/system/AssetManager";
import { SpriteDefinition } from "@/animation/SpriteDefinitions";

/**
 * Sprite class
 * 
 * Manages animation of sprites — typically a base class for Worms, Weapons, etc.
 */
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
    frameIncrementer = 1;

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
            this.currentFrameY += this.frameIncrementer;

            if (this.currentFrameY >= this.spriteDef.frameCount) {
                if (this.noLoop) {
                    this.finished = true;
                    if (this.onFinishFunc) {
                        this.onFinishFunc();
                        this.onFinishFunc = null;
                        return;
                    }
                }
                this.currentFrameY = this.spriteDef.frameY || 0;
            }

            this.lastUpdateTime = Date.now();
        }
    }

    /**
     * Draws this sprite at the center of another sprite
     */
    drawOnCenter(ctx: CanvasRenderingContext2D, x: number, y: number, spriteToCenterOn: Sprite): void {
        if (!this.finished) {
            ctx.save();
            ctx.translate(
                (spriteToCenterOn.getImage().width - this.getImage().width) / 2,
                (spriteToCenterOn.getFrameHeight() - this.getFrameHeight()) / 2
            );
            this.draw(ctx, x, y);
            ctx.restore();
        }
    }

    /**
     * Draws the current frame of the sprite at given coordinates
     */
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
        if (frame >= 0 && frame < this.spriteDef.frameCount!) {
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
        return this.spriteDef.frameCount!;
    }

    /**
     * Allows for func to be called once this sprite animation has finished
     */
    onAnimationFinish(func: () => void): void {
        if (!this.isSpriteLocked) {
            this.onFinishFunc = func;
        }
    }

    /**
     * Set new sprite definition
     */
    setSpriteDef(spriteDef: SpriteDefinition, lockSprite = false, noLoop = false): void {
        if (spriteDef !== this.spriteDef) {
            if (!this.isSpriteLocked) {
                this.noLoop = noLoop;
                this.finished = false;
                this.spriteDef = spriteDef;
                this.currentFrameY = spriteDef.frameY || 0;
                this.isSpriteLocked = lockSprite;

                this.image = AssetManager.getImage(spriteDef.imageName);
                this.frameHeight = this.image.height / (spriteDef.frameCount || 1);
            }
        }

        if (this.spriteDef === spriteDef) {
            this.isSpriteLocked = lockSprite;
        }
    }

    /**
     * Swap sprite sheet but keep current frame
     */
    swapSpriteSheet(spriteSheet: SpriteDefinition): void {
        const currentFrame = this.getCurrentFrame();
        this.setSpriteDef(spriteSheet);
        this.setCurrentFrame(currentFrame);
        this.finished = true; // Prevent animation
    }

    setNoLoop( noLoop: boolean) {
        this.noLoop = noLoop;
    }
}