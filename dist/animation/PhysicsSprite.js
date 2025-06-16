import { b2Vec2 } from "@box2d/core";
import { Sprite } from "@/animation/Sprite";
/**
 * PhysicsSprite
 *
 * A sprite that also moves based on physics (velocity, acceleration)
 */
export class PhysicsSprite extends Sprite {
    constructor(initialPos, initialVelocity, spriteDef) {
        super(spriteDef);
        this.position = initialPos.Clone();
        this.velocity = initialVelocity.Clone();
        this.acc = new b2Vec2(0, 0);
    }
    draw(ctx, x = this.position.x, y = this.position.y) {
        super.draw(ctx, x, y);
    }
    physics() {
        const t = 0.016; // Fixed time step (approx 60fps)
        const g = new b2Vec2(0, 9.81); // Gravity
        const at = g.Clone();
        this.velocity.Add(at);
        const vt = this.velocity.Clone();
        vt.Multiply(t);
        this.position.Add(vt);
    }
    update() {
        this.physics();
        super.update();
    }
}
