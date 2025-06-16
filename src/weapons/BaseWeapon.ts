import { Settings } from "@/Settings";
import { Worm } from "@/Worm";
import { SpriteDefinition } from "@/animation/SpriteDefinitions";
import { AssetManager } from "@/system/AssetManager";
import { ForceIndicator } from "@/physics/ForceIndicator";
import { Logger } from "@/utils/logger";

/**
 * BaseWeapon class
 * 
 * Base class for all weapons in the game
 */
export class BaseWeapon {
    ammo!: number;
    name!: string;
    iconImage!: HTMLImageElement;
    isActive = false;
    worm!: Worm;
    takeOutAnimations!: SpriteDefinition;
    takeAimAnimations!: SpriteDefinition;
    forceIndicator: ForceIndicator;

    requiresAiming = true;

    constructor(
        name: string,
        ammo: number,
        iconSprite: SpriteDefinition,
        takeOutAnimation: SpriteDefinition,
        takeAimAnimation: SpriteDefinition
    ) {
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
    getForceIndicator(): ForceIndicator {
        return this.forceIndicator;
    }

    /**
     * Get whether the weapon is active
     */
    getIsActive(): boolean {
        return this.isActive;
    }

    /**
     * Set whether the weapon is active
     */
    setIsActive(val: boolean): void {
        this.isActive = val;
    }

    /**
     * Deactivates the weapon
     */
    deactivate(): void {
        this.setIsActive(false);
        Logger.debug(`${this.name} was deactivated`);
    }

    /**
     * Activates the weapon on a worm
     */
    activate(worm: Worm): void {
        if (this.ammo > 0 && !this.getIsActive()) {
            this.setIsActive(true);
            this.ammo--;
            this.worm = worm;

            if (Settings.DEVELOPMENT_MODE || Settings.LOG) {
                Logger.debug(`${this.name} was activated`);
            }
        } else {
            AssetManager.getSound("cantclickhere").play();
        }
    }

    /**
     * Updates the weapon's logic
     */
    update(): void {
        // To be overridden by subclasses
    }

    /**
     * Draws the weapon
     */
    draw(ctx: CanvasRenderingContext2D): void {
        // To be overridden by subclasses
    }
}