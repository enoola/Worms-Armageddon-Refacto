import { Physics } from "@/system/Physics";
import { BaseWeapon } from "./BaseWeapon";
import { Sprites } from "@/animation/SpriteDefinitions";
import { AssetManager } from "@/system/AssetManager";
import { Timer } from "@/system/Timer";
import { GameInstance } from "@/GameInstance";
import { Logger } from "@/utils/logger";
/**
 * Drill class
 *
 * A weapon that allows worms to drill through terrain and damage nearby worms.
 */
export class Drill extends BaseWeapon {
    constructor(ammo) {
        super("Drill", ammo, Sprites.weaponIcons.drill, Sprites.worms.takeOutDrill, Sprites.worms.drilling);
        this.timeBetweenExplosionsTimer = new Timer(450);
        this.useDurationTimer = new Timer(5200);
        // Disable aiming since drill is automatic
        this.requiresAiming = false;
    }
    activate(worm) {
        if (this.ammo > 0) {
            super.activate(worm);
            this.useDurationTimer.reset();
            this.timeBetweenExplosionsTimer.reset();
            this.worm.setSpriteDef(this.takeAimAnimations, true, false);
            return true;
        }
        else {
            return false;
        }
    }
    deactivate() {
        this.setIsActive(false);
        Logger.debug("Drill deactived");
        this.worm.setSpriteDef(this.takeAimAnimations, false); // Unlock sprite
    }
    update() {
        if (this.getIsActive()) {
            const weaponUseDuration = this.useDurationTimer.hasTimePeriodPassed();
            if (weaponUseDuration) {
                this.deactivate();
            }
            AssetManager.getSound("drill").play();
            if (this.timeBetweenExplosionsTimer.hasTimePeriodPassed()) {
                const wormPos = this.worm.body.GetPosition();
                const pixelPos = Physics.vectorMetersToPixels(wormPos);
                GameInstance.terrain.addToDeformBatch(pixelPos.x, pixelPos.y, 25);
            }
            this.useDurationTimer.update();
            this.timeBetweenExplosionsTimer.update();
        }
    }
}
