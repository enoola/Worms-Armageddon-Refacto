import { b2Vec2, b2Body } from "@box2d/core";
import { ThrowableWeapon } from "./ThrowableWeapon";
import { Sprites } from "@/animation/SpriteDefinitions";
import { AssetManager } from "@/system/AssetManager";
import { Physics } from "@/system/Physics";
import { Utilies } from "@/system/Utilies";
import { Worm } from "@/animation/Worm";
import { GameInstance } from "@/GameInstance";
import { Logger } from "@/utils/logger";

/**
 * Dynamite class
 * 
 * A weapon that explodes after a delay, causing terrain deformation and damage.
 */
export class Dynamite extends ThrowableWeapon {
    explosionRadius: number;
    effectedRadius: number;
    explosiveForce: number;

    constructor(ammo: number) {
        // Clone the takeOutDynamite animation and reverse it
        const modifiedSpriteDef = { ...Sprites.worms.takeOutDynamite };
        modifiedSpriteDef.frameY = modifiedSpriteDef.frameCount ? modifiedSpriteDef.frameCount - 1 : 0;

        super(
            "Dynamite",
            ammo,
            Sprites.weaponIcons.dynamite,
            Sprites.weapons.dynamite,
            Sprites.worms.takeOutDynamite,
            modifiedSpriteDef
        );

        this.explosionRadius = 100;
        this.effectedRadius = Physics.pixelToMeters(this.explosionRadius * 1.8);
        this.explosiveForce = 95;
        this.requiresAiming = false;
    }

    /**
     * Plays worm voice sound before throwing
     */
    playWormVoice(): void {
        Utilies.pickRandomSound(["laugh"]).play();
    }

    /**
     * Sets up physics body at worm's position with no initial force
     */
    setupDirectionAndForce(worm: Worm): void {
        const initialPosition = worm.body.GetPosition();
        this.setupPhysicsBodies(initialPosition, new b2Vec2(0, 0));

        // Prevent rotation
        this.body?.SetFixedRotation(true);
    }

    /**
     * Updates the dynamite's state
     */
    update(): void {
        if (this.getIsActive()) {
            this.sprite?.update();
            AssetManager.getSound("fuse").play();

            super.update();
        }
    }
 
    onExplosion(): void {
        const position = this.body.GetPosition();
        const pixelPos = Physics.vectorMetersToPixels(position);
        
        Effects.explosion(
            position,
            this.explosionRadius,
            this.effectedRadius,
            this.explosiveForce,
            this.maxDamage,
            this.worm
        );
    
        GameInstance.particleEffectMgmt.add(new ParticleEffect(pixelPos.x, pixelPos.y));
        this.setIsActive(false);
    }
}