import { b2Vec2 } from "@box2d/core";
import { Worm } from "@/Worm";
import { Physics } from "@/system/Physics";
import { Sprite } from "@/animation/Sprite";
import { AssetManager } from "@/system/AssetManager";
import { Utils } from "@/system/Utils";
import { Sprites } from "@/animation/SpriteDefinitions";

/**
 * ForceIndicator class
 * 
 * Visualizes and manages the force meter for throwables like grenades
 */
export class ForceIndicator {
    private forcePercentage = 1;
    private forceMax: number;
    private sprite: Sprite;
    private needReRender = true;
    private renderCanvas: HTMLCanvasElement | null = null;

    constructor(forceMax: number) {
        this.forceMax = forceMax;
        this.sprite = new Sprite(Sprites.particleEffects.blob);
        this.needReRender = true;
    }

    /**
     * Some weapons don't require a force indicator
     */
    isRequired(): boolean {
        return this.forceMax !== 0;
    }

    /**
     * Draws the force indicator near the worm
     */
    draw(ctx: CanvasRenderingContext2D, worm: Worm): void {
        if (!this.isCharging() || !this.isRequired()) return;

        if (this.needReRender) {
            const spriteHeight = this.sprite.getFrameHeight();
            const width = this.sprite.getFrameWidth();
            const height = 200;

            this.renderCanvas = document.createElement("canvas");
            this.renderCanvas.width = width;
            this.renderCanvas.height = height;

            const rctx = this.renderCanvas.getContext("2d");
            if (!rctx) return;

            rctx.clearRect(0, 0, width, height);

            // Render force indicator
            const framesToShow = Math.min(this.sprite.getTotalFrames(), 100);
            for (let i = 0; i < (this.forcePercentage / 100) * framesToShow; i++) {
                this.sprite.setCurrentFrame(i);
                this.sprite.draw(rctx, 0, height - (i * 2));
            }

            this.needReRender = false;
        }

        if (!this.renderCanvas) return;

        const radius = worm.fixture?.GetShape()?.GetRadius() * Physics.worldScale;
        const wormPos = Physics.vectorMetersToPixels(worm.body?.GetPosition());
        const targetDir = worm.target?.getTargetDirection()?.Clone() || new b2Vec2(0, 0);

        targetDir.SelfMulScalar(16);
        targetDir.SelfAdd(wormPos);

        ctx.save();
        ctx.translate(targetDir.x, targetDir.y);
        ctx.rotate(Utils.vectorToAngle(worm.target.getTargetDirection().Clone()) + Utils.toRadians(-90));
        ctx.drawImage(this.renderCanvas, -radius, -radius, this.renderCanvas.width, this.renderCanvas.height);
        ctx.restore();
    }

    /**
     * Increases force percentage while charging
     */
    charge(rate: number): boolean {
        if (!this.isRequired()) return false;

        AssetManager.getSound("THROWPOWERUP").play();
        this.forcePercentage += rate;
        this.sprite.setCurrentFrame(this.sprite.getCurrentFrame() + 0.4);
        this.needReRender = true;

        if (this.forcePercentage > 100) {
            this.forcePercentage = 100;
            return true;
        }

        return false;
    }

    /**
     * Returns true if currently charging
     */
    isCharging(): boolean {
        return this.forcePercentage > 1;
    }

    /**
     * Sets max force limit
     */
    setMaxForce(forceScalerMax: number): void {
        this.forceMax = forceScalerMax;
    }

    /**
     * Resets the force indicator
     */
    reset(): void {
        if (!this.isRequired()) return;

        this.forcePercentage = 1;
        AssetManager.getSound("THROWPOWERUP").pause();
        AssetManager.getSound("THROWRELEASE").play();

        const renderCtx = this.renderCanvas?.getContext("2d");
        if (renderCtx) {
            renderCtx.clearRect(0, 0, this.renderCanvas!.width, this.renderCanvas!.height);
        }

        this.sprite.setCurrentFrame(0);
    }

    /**
     * Returns force as a scalar (0 to forceMax)
     */
    getForce(): number {
        return (this.forcePercentage / 100) * this.forceMax;
    }
}

/*
* usage example:
import { ForceIndicator } from "@/weapons/ForceIndicator";
import { Worm } from "@/animation/Worm";

const worm = new Worm(Sprites.worms.idle1);
const forceIndicator = new ForceIndicator(50); // Max force = 50

forceIndicator.draw(context, worm);
forceIndicator.charge(2);
console.log("Current force:", forceIndicator.getForce());
*/