import { Sprite } from "@/animation/Sprite";
import { b2Vec2 } from "@box2d/core";
import { Sprites } from "@/animation/SpriteDefinitions";
import { Particle } from "@/animation/Particle";
import { Utils } from "@/system/Utils";
/**
 * ParticleEffect class
 *
 * Creates and manages visual particle effects like explosions and animated sprites
 */
export class ParticleEffect {
    constructor(gameInstance, x, y) {
        this.finished = false;
        this.onFinished = null;
        this.gameInstance = gameInstance;
        this.x = x;
        this.y = y;
        this.eclipse = new Sprite(Sprites.particleEffects.eclipse, true);
        this.circle = new Sprite(Sprites.particleEffects.cirlce1, true);
        this.word = new Sprite(Sprites.particleEffects.wordBiff, true);
        const image = this.eclipse.getImage();
        this.center = new b2Vec2(image.width / 2, this.eclipse.getFrameHeight() / 2);
        this.particles = [];
        // Create particles around the effect center
        for (let p = 9; p >= 0; p--) {
            const position = new b2Vec2(x + this.center.x, y + this.center.y);
            const velocity = new b2Vec2(Utils.random(-300, 300), Utils.random(-500, 0));
            this.particles.push(new Particle(position, velocity));
        }
    }
    draw(ctx) {
        ctx.save();
        // Center on effect origin
        ctx.translate(-this.eclipse.getImage().width / 2, -this.eclipse.getFrameHeight() / 2);
        // Draw particles
        for (const particle of this.particles) {
            particle.draw(ctx);
        }
        // Draw animated effects
        this.circle.drawOnCenter(ctx, this.x, this.y, this.eclipse);
        this.word.drawOnCenter(ctx, this.x, this.y, this.eclipse);
        // Draw base sprite if not finished
        if (!this.eclipse.finished) {
            this.eclipse.draw(ctx, this.x, this.y);
        }
        ctx.restore();
    }
    update() {
        var _a;
        this.eclipse.update();
        this.circle.update();
        this.word.update();
        // Update all particles
        for (const particle of this.particles) {
            particle.update();
        }
        // Mark effect as finished when first particle finishes
        this.finished = ((_a = this.particles[0]) === null || _a === void 0 ? void 0 : _a.finished) || true;
        if (this.finished && this.onFinished) {
            this.onFinished();
        }
    }
    onAnimationFinish(func) {
        this.onFinished = func;
    }
}
