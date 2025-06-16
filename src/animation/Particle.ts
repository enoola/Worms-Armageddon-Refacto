import { b2Vec2 } from "@box2d/core"
import { PhysicsSprite } from "@/animation/PhysicsSprite";
import { Sprites } from "@/animation/SpriteDefinitions";
import { AssetManager } from "@/system/AssetManager";
import { Utils } from "@/system/Utils";
import { Game } from "@/Game";
import { GameInstance } from "@/GameInstance";

/**
 * Particle class
 * 
 * A small animated object affected by physics (e.g., flames, smoke)
 */
export class Particle extends PhysicsSprite {
    constructor(initialPos: b2Vec2, initialVelocity: b2Vec2, spriteDef = Sprites.particleEffects.flame1) {
        super(initialPos, initialVelocity, spriteDef);
        this.setNoLoop(true);
    }
}

/**
 * Cloud class
 * 
 * A special particle that floats across the sky and loops
 */
export class Cloud extends PhysicsSprite {
    constructor() {
        const initialPos = new b2Vec2(
            Utils.random(0, GameInstance.getInstance().camera.levelWidth),
            Utils.random(GameInstance.getInstance().terrain.Offset.y - 900, GameInstance.getInstance().terrain.Offset.y - 220)
        );

        const initialVelocity = new b2Vec2(
            Utils.random(3, 7) * 0.4,
            0
        );

        const spriteDef = Utils.pickRandom([
            Sprites.particleEffects.cloudl,
            Sprites.particleEffects.cloudm,
            Sprites.particleEffects.clouds
        ]);

        super(initialPos, initialVelocity, spriteDef);
    }

    /**
     * Override physics method to disable physics for clouds
     */
    physics(): void {
        // intentionally empty - clouds don't use physics
    }

    /**
     * Update cloud position with wrap-around behavior
     */
    update(): void {
        // Handle animation loop
        if (this.getCurrentFrame() >= this.getTotalFrames() - 1) {
            this.setCurrentFrame(this.getTotalFrames() - 1);
            this.frameIncrementer *= -1;
        } else if (this.getCurrentFrame() <= 0) {
            this.setCurrentFrame(0);
            this.frameIncrementer *= -1;
        }

        // Update animation
        super.update();

        // Move cloud based on velocity
        this.position.x += this.velocity.x;

        // Wrap around screen
        if (this.position.x > GameInstance.getInstance().camera.levelWidth) {
            this.position.x = 0;
        }
    }
}