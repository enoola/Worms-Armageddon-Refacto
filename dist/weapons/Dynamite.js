import { b2Vec2 } from "@box2d/core";
import { ThrowableWeapon } from "./ThrowableWeapon";
import { Sprites } from "@/animation/SpriteDefinitions";
import { AssetManager } from "@/system/AssetManager";
import { Physics } from "@/system/Physics";
import { Utilies } from "@/system/Utilies";
import { GameInstance } from "@/GameInstance";
/**
 * Dynamite class
 *
 * A weapon that explodes after a delay, causing terrain deformation and damage.
 */
export class Dynamite extends ThrowableWeapon {
    constructor(ammo) {
        // Clone the takeOutDynamite animation and reverse it
        const modifiedSpriteDef = Object.assign({}, Sprites.worms.takeOutDynamite);
        modifiedSpriteDef.frameY = modifiedSpriteDef.frameCount ? modifiedSpriteDef.frameCount - 1 : 0;
        super("Dynamite", ammo, Sprites.weaponIcons.dynamite, Sprites.weapons.dynamite, Sprites.worms.takeOutDynamite, modifiedSpriteDef);
        this.explosionRadius = 100;
        this.effectedRadius = Physics.pixelToMeters(this.explosionRadius * 1.8);
        this.explosiveForce = 95;
        this.requiresAiming = false;
    }
    /**
     * Plays worm voice sound before throwing
     */
    playWormVoice() {
        Utilies.pickRandomSound(["laugh"]).play();
    }
    /**
     * Sets up physics body at worm's position with no initial force
     */
    setupDirectionAndForce(worm) {
        var _a;
        const initialPosition = worm.body.GetPosition();
        this.setupPhysicsBodies(initialPosition, new b2Vec2(0, 0));
        // Prevent rotation
        (_a = this.body) === null || _a === void 0 ? void 0 : _a.SetFixedRotation(true);
    }
    /**
     * Updates the dynamite's state
     */
    update() {
        var _a;
        if (this.getIsActive()) {
            (_a = this.sprite) === null || _a === void 0 ? void 0 : _a.update();
            AssetManager.getSound("fuse").play();
            super.update();
        }
    }
    onExplosion() {
        const position = this.body.GetPosition();
        const pixelPos = Physics.vectorMetersToPixels(position);
        Effects.explosion(position, this.explosionRadius, this.effectedRadius, this.explosiveForce, this.maxDamage, this.worm);
        GameInstance.particleEffectMgmt.add(new ParticleEffect(pixelPos.x, pixelPos.y));
        this.setIsActive(false);
    }
}
