import { AssetManager } from "@/system/AssetManager";
/**
 * Sprite class
 *
 * Manages animation of sprites — typically a base class for Worms, Weapons, etc.
 */
export class Sprite {
    constructor(spriteDef, noLoop = false) {
        this.finished = false;
        this.noLoop = false;
        this.lastUpdateTime = 0;
        this.accumulateDelta = 0;
        this.isSpriteLocked = false;
        this.onFinishFunc = null;
        this.frameIncrementer = 1;
        this.lastUpdateTime = Date.now();
        this.setSpriteDef(spriteDef);
        this.noLoop = noLoop;
    }
    update() {
        if (this.finished)
            return;
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
    drawOnCenter(ctx, x, y, spriteToCenterOn) {
        if (!this.finished) {
            ctx.save();
            ctx.translate((spriteToCenterOn.getImage().width - this.getImage().width) / 2, (spriteToCenterOn.getFrameHeight() - this.getFrameHeight()) / 2);
            this.draw(ctx, x, y);
            ctx.restore();
        }
    }
    /**
     * Draws the current frame of the sprite at given coordinates
     */
    draw(ctx, x, y) {
        const tmpCurrentFrameY = Math.floor(this.currentFrameY);
        if (tmpCurrentFrameY >= 0) {
            ctx.drawImage(this.image, 0, tmpCurrentFrameY * this.frameHeight, this.image.width, this.frameHeight, Math.floor(x), Math.floor(y), this.image.width, this.frameHeight);
        }
    }
    getImage() {
        return this.image;
    }
    getCurrentFrame() {
        return this.currentFrameY;
    }
    setCurrentFrame(frame) {
        if (frame >= 0 && frame < this.spriteDef.frameCount) {
            this.currentFrameY = frame;
        }
    }
    getFrameHeight() {
        return this.frameHeight;
    }
    getFrameWidth() {
        return this.image.width;
    }
    getTotalFrames() {
        return this.spriteDef.frameCount;
    }
    /**
     * Allows for func to be called once this sprite animation has finished
     */
    onAnimationFinish(func) {
        if (!this.isSpriteLocked) {
            this.onFinishFunc = func;
        }
    }
    /**
     * Set new sprite definition
     */
    setSpriteDef(spriteDef, lockSprite = false, noLoop = false) {
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
    swapSpriteSheet(spriteSheet) {
        const currentFrame = this.getCurrentFrame();
        this.setSpriteDef(spriteSheet);
        this.setCurrentFrame(currentFrame);
        this.finished = true; // Prevent animation
    }
    setNoLoop(noLoop) {
        this.noLoop = noLoop;
    }
}
