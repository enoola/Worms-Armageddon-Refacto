//import { SpriteDefinitions } from "../animation/SpriteDefinitions.ts"
import { AssetManager } from "../system/AssetManager.ts";
import { ForceIndicator } from "ForceIndicator.ts";
class BaseWeapon {
    constructor(name, ammo, iconSprite, takeOutAnimation, takeAimAnimation) {
        this.name = name;
        this.ammo = ammo;
        this.takeOutAnimations = takeOutAnimation;
        this.takeAimAnimations = takeAimAnimation;
        //Setup the icon used in the weapon menu
        this.iconImage = AssetManager.getImage(iconSprite.imageName);
        this.requiresAiming = true;
        this.setIsActive(false);
        this.forceIndicator = new ForceIndicator(0);
    }
    getForceIndicator() {
        return this.forceIndicator;
    }
    getIsActive() { return this.isActive; }
    setIsActive(val) { this.isActive = val; }
    deactivate() {
    }
    activate(worm) {
        this.setIsActive(true);
        this.ammo--;
        this.worm = worm;
        Logger.debug(this.name + " was activated ");
    }
    update() { }
    draw(ctx) { }
}
