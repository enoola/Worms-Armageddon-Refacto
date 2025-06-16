import { b2Vec2 } from "@box2d/core";
import { Sprite } from "@/animation/Sprite";
import { SpriteDefinition } from "@/animation/SpriteDefinitions";

/**
 * PhysicsSprite
 * 
 * A sprite that also moves based on physics (velocity, acceleration)
 */
export class PhysicsSprite extends Sprite {
    velocity: b2Vec2;
    position: b2Vec2;
    acc: b2Vec2;

    constructor(initialPos: b2Vec2, initialVelocity: b2Vec2, spriteDef: SpriteDefinition) {
        super(spriteDef);
        this.position = initialPos.Clone();
        this.velocity = initialVelocity.Clone();
        this.acc = new b2Vec2(0, 0);
    }

    draw(ctx: CanvasRenderingContext2D, x: number = this.position.x, y: number = this.position.y): void {
        super.draw(ctx, x, y);
    }

    physics(): void {
        const t = 0.016; // Fixed time step (approx 60fps)
        const g = new b2Vec2(0, 9.81); // Gravity

        const at = g.Clone();
        this.velocity.Add(at);

        const vt = this.velocity.Clone();
        vt.Multiply(t);
        this.position.Add(vt);
    }

    update(): void {
        this.physics();
        super.update();
    }
}