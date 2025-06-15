/**
 * Drill.js
 * This class manages the Drill tool which the worm
 * can use to drill down into the terrain and also hurt other worms.
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */
import { Physics } from "../system/Physics";
import { Timer } from "../system/Timer";
import { BaseWeapon } from "./BaseWeapon";
class Drill extends BaseWeapon {
    constructor(ammo, name = "Drill", icon = Sprites.weaponIcons.drill, takeOutAnimation = Sprites.worms.takeOutDrill, actionAnimation = Sprites.worms.drilling) {
        super("Drill", // Weapon name
        ammo, // ammo
        icon, //Icon for menu
        takeOutAnimation, //animation fro worm taking out drill
        actionAnimation //animation fro worm taking out drill
        );
        this.worm = null;
        this.timeBetweenExploisionsTimer = new Timer(450);
        this.useDurationTimer = new Timer(5200);
        // No requirement for crosshairs aiming
        this.requiresAiming = false;
    }
    activate(worm) {
        if (this.ammo > 0) {
            super.activate(worm);
            this.useDurationTimer.reset();
            this.timeBetweenExploisionsTimer.reset();
            this.worm.setSpriteDef(this.takeAimAnimations, true, false);
            return true;
        }
        else {
            return false;
        }
    }
    deactivate() {
        this.setIsActive(false);
        Logger.debug(" deactivedate ");
        this.worm.setSpriteDef(this.takeAimAnimations, false); //unlocks sprite
        //this.worm.setSpriteDef(Sprites.worms.idle1);
    }
    update() {
        if (this.getIsActive()) {
            var weaponUseDuration = this.useDurationTimer.hasTimePeriodPassed();
            if (weaponUseDuration) {
                this.deactivate();
            }
            AssetManager.getSound("drill").play();
            if (this.timeBetweenExploisionsTimer.hasTimePeriodPassed()) {
                GameInstance.terrain.addToDeformBatch(Physics.metersToPixels(this.worm.body.GetPosition().x), Physics.metersToPixels(this.worm.body.GetPosition().y), 25);
            }
            this.useDurationTimer.update();
            this.timeBetweenExploisionsTimer.update();
        }
    }
}
