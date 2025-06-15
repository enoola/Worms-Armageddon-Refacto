import { AssetManager } from "../system/AssetManager";
export class Sprite {
    constructor(spriteDef, noLoop = false) {
        this.finished = false;
        this.noLoop = false;
        this.lastUpdateTime = 0;
        this.accumulateDelta = 0;
        this.isSpriteLocked = false;
        this.onFinishFunc = null;
        this.frameIncremeter = 1;
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
    setSpriteDef(spriteDef, lockSprite = false, noLoop = false) {
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
