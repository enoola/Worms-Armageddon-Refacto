import { b2Vec2, b2BodyDef, b2Body, b2Fixture,b2FixtureDef, b2CircleShape, b2BodyType } from "@box2d/core";
import { Physics } from "@/system/Physics";
import { Sprite } from "@/animation/Sprite";
import { SpriteDefinition } from "@/animation/SpriteDefinitions";
import { BaseWeapon } from "./BaseWeapon";
import { AssetManager } from "@/system/AssetManager";
import { Effects } from "@/animation/Effects";
import { Game } from "@/Game";
import { Worm } from "@/Worm";
import { Timer } from "@/system/Timer";
import { Utils } from "@/system/Utils";
import { Logger } from "@/utils/logger";
import { Graphics } from "@/system/Graphics";
import { Dynamite } from "./Dynamite";

/**
 * ThrowableWeapon class
 * 
 * Base class for weapons like grenades and bombs that can be thrown.
 */
export class ThrowableWeapon extends BaseWeapon {
    static DENSITY = 50;

    body!: b2Body;
    fixture!: b2Fixture;
    hasImpacted = 0;
    impactSound = "GRENADEIMPACT";
    detonationTimer: Timer;
    effectedRadius!: number;
    explosiveForce!: number;
    sprite!: Sprite;
    explosionRadius!: number;
    maxDamage!: number;

    // Pre-rendered timer box for countdown
    static preRender(): HTMLCanvasElement {
        const timerBoxWidth = 20;
        const timerBoxHeight = 22;
        const canvas = document.createElement("canvas");
        canvas.width = timerBoxWidth + 3;
        canvas.height = timerBoxHeight + 3;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#1A1110";
        ctx.strokeStyle = "#eee";
        Graphics.roundRect(ctx, 0, 0, timerBoxWidth, timerBoxHeight, 4).fill();
        Graphics.roundRect(ctx, 0, 0, timerBoxWidth, timerBoxHeight, 4).stroke();
        return canvas;
    }

    static numberBox: HTMLCanvasElement = ThrowableWeapon.preRender();

    constructor(
        name: string,
        ammo: number,
        iconSpriteDef: SpriteDefinition,
        weaponSpriteDef: SpriteDefinition,
        takeOutAnimation: SpriteDefinition,
        public takeAimAnimations: SpriteDefinition
    ) {
        super(name, ammo, iconSpriteDef, takeOutAnimation, weaponSpriteDef);
        this.sprite = new Sprite(weaponSpriteDef);
        this.explosionRadius = 40;
        this.effectedRadius = Physics.pixelToMeters(50);
        this.explosiveForce = 50;
        this.maxDamage = 30;
        this.detonationTimer = new Timer(5000);
        this.impactSound = "GRENADEIMPACT";
    }

    /**
     * What happens when the weapon collides with something
     */
    beginContact(contact: any): void {
        if (this.hasImpacted === 0) {
            AssetManager.getSound(this.impactSound).play(0.6);
        }
        this.hasImpacted++;
    }

    /**
     * What happens when the weapon stops colliding
     */
    endContact(contact: any): void {
        this.hasImpacted--;
    }

    /**
     * Deactivates the weapon and logs it
     */
    deactivate(): void {
        Logger.debug(`${this.name} was deactivated`);
        this.setIsActive(false);
        super.deactivate();
    }

    /**
     * Sets up physics body for the weapon
     */
    setupPhysicsBodies(initialPosition: b2Vec2, initialVelocity: b2Vec2): void {
        const image = this.sprite.getImage();

        //const fixDef = new b2FixtureDef();
        const fixDef: b2FixtureDef = {   
            density: ThrowableWeapon.DENSITY,
            friction: 3.5,
            restitution: 0.6,
            shape: new b2CircleShape((image.width / 4) / Physics.worldScale)
        }
        //const bodyDef = new b2BodyDef();
        const bodyDef: b2BodyDef = {
            type: b2BodyType.b2_dynamicBody,
            position: initialPosition.Clone()
        }

        if (!(this instanceof Dynamite)) {
            bodyDef.angle = Utils.vectorToAngle(initialVelocity);
        }

        this.fixture = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);
        this.body = this.fixture.GetBody();
        this.body.SetLinearVelocity(initialVelocity.Clone());

        if (!(this instanceof Dynamite)) {
            // Visual hack - simulate air resistance by adding angular velocity
            const angularVelocity = initialVelocity.x >= 0 ? 0.7 : -0.7;
            this.body.SetAngularVelocity(angularVelocity);
        }

        this.body.SetUserData(this);
        Physics.addToFastAccessList(this.body);
    }

    /**
     * Gets direction from target and creates physics body
     */
    setupDirectionAndForce(worm: Worm): void {
        const initialVelocity = worm.target.getTargetDirection().Clone();
        initialVelocity.SelfMulScalar(1.5);

        const initialPosition = worm.body.GetPosition().Clone();
        initialPosition.SelfAdd(initialVelocity);

        initialVelocity.SelfMulScalar(this.forceIndicator.getForce());

        this.setupPhysicsBodies(initialPosition, initialVelocity);
    }

    /**
     * Plays worm voice sound
     */
    playWormVoice(): void {
        Utilies.pickRandomSound(["watchthis", "fire", "grenade", "incoming", "laugh"]).play();
    }

    /**
     * Activates the weapon and throws it
     */
    activate(worm: Worm): void {
        if (this.ammo > 0 && !this.getIsActive()) {
            this.detonationTimer.reset();
            this.playWormVoice();
            super.activate(worm);
            this.setupDirectionAndForce(worm);
        } else {
            AssetManager.getSound("cantclickhere").play();
        }
    }

    /**
     * Detonates the weapon after timer ends
     */
    detonate(): void {
        GameInstance.state.triggerNextTurn();
        const animation = Effects.explosion(
            this.body.GetPosition(),
            this.explosionRadius,
            this.effectedRadius,
            this.explosiveForce,
            this.maxDamage,
            this.worm
        );

        Physics.removeFromFastAccessList(this.body);
        Physics.world.DestroyBody(this.body);
        this.deactivate();
        this.worm.team.weaponManager.getListOfWeapons()[6]?.deactivate();
    }

    /**
     * Updates the weapon state
     */
    update(): void {
        if (this.getIsActive()) {
            if (this.detonationTimer.hasTimePeriodPassed()) {
                this.detonate();
            }
            this.detonationTimer.update();
        }
    }

    /**
     * Draws the weapon and countdown
     */
    draw(ctx: CanvasRenderingContext2D): void {
        if (this.getIsActive()) {
            ctx.save();
            const wormPosInPixels = Physics.vectorMetersToPixels(this.body.GetPosition());

            ctx.translate(wormPosInPixels.x, wormPosInPixels.y);
            ctx.save();
            ctx.rotate(this.body.GetAngle());

            const radius = this.fixture.GetShape().GetRadius() * 2 * Physics.worldScale;

            this.sprite.draw(ctx, -radius, -radius);
            ctx.restore();

            ctx.drawImage(ThrowableWeapon.numberBox, 10, -40);
            ctx.fillStyle = "rgba(255,0,0,255)";

            let secondsLeft = Math.floor(this.detonationTimer.getTimeLeftInSec() / 10);
            if (secondsLeft < 0) secondsLeft = 0;

            ctx.fillText(secondsLeft.toString(), 22, -22);
            ctx.restore();
        }
    }
}