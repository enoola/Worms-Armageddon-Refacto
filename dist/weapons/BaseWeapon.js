import { Settings } from "@/Settings";
import { AssetManager } from "@/system/AssetManager";
import { ForceIndicator } from "@/physics/ForceIndicator";
import { Logger } from "@/utils/logger";
/**
 * BaseWeapon class
 *
 * Base class for all weapons in the game
 */
export class BaseWeapon {
    constructor(name, ammo, iconSprite, takeOutAnimation, takeAimAnimation) {
        this.isActive = false;
        this.requiresAiming = true;
        this.name = name;
        this.ammo = ammo;
        this.takeOutAnimations = takeOutAnimation;
        this.takeAimAnimations = takeAimAnimation;
        // Load weapon icon
        this.iconImage = AssetManager.getImage(iconSprite.imageName);
        // Initialize force indicator
        this.forceIndicator = new ForceIndicator(0);
    }
    /**
     * Returns the current force indicator
     */
    getForceIndicator() {
        return this.forceIndicator;
    }
    /**
     * Get whether the weapon is active
     */
    getIsActive() {
        return this.isActive;
    }
    /**
     * Set whether the weapon is active
     */
    setIsActive(val) {
        this.isActive = val;
    }
    /**
     * Deactivates the weapon
     */
    deactivate() {
        this.setIsActive(false);
        Logger.debug(`${this.name} was deactivated`);
    }
    /**
     * Activates the weapon on a worm
     */
    activate(worm) {
        if (this.ammo > 0 && !this.getIsActive()) {
            this.setIsActive(true);
            this.ammo--;
            this.worm = worm;
            if (Settings.DEVELOPMENT_MODE || Settings.LOG) {
                Logger.debug(`${this.name} was activated`);
            }
        }
        else {
            AssetManager.getSound("cantclickhere").play();
        }
    }
    /**
     * Updates the weapon's logic
     */
    update() {
        // To be overridden by subclasses
    }
    /**
     * Draws the weapon
     */
    draw(ctx) {
        // To be overridden by subclasses
    }
}
