import { BaseWeapon } from "./BaseWeapon";
import { Worm } from "../Worm";
import { SpriteDefinition } from "../animation/SpriteDefinitions";
import { Sprite } from "../animation/Sprite";
import { Physics } from "../system/Physics";
import { Controls } from "../system/Controls"; // You'll need to create this or import it
import { keyboard } from "../system/keyboard";
import { Utils } from "../system/Utils";
import { Client } from "../networking/Client";
import { Events } from "../networking/Events";
import { InstructionChain } from "../networking/InstructionChain";

import { b2Vec2 } from "../types/box2d-imports";

export class JetPack extends BaseWeapon {
    thrusterScaler: number;
    bottomFlame: Sprite;
    sideFlame: Sprite;
    forceDir: b2Vec2;

    fuel: number;
    readonly INITIAL_FUEL: number;

    constructor(ammo: number) {
        super("Jet Pack", ammo, Sprites.weaponIcons.jetPack, Sprites.worms.takeOutJetPack, Sprites.worms.defualtJetPack);

        this.thrusterScaler = 0.15 * Worm.DENSITY;
        this.forceDir = new b2Vec2(0, 0);
        this.bottomFlame = new Sprite(Sprites.weapons.jetPackFlamesDown);
        this.sideFlame = new Sprite(Sprites.weapons.jetPackFlamesSide);

        // No requirement for crosshairs aiming
        this.requiresAiming = false;

        this.INITIAL_FUEL = 20;
        this.fuel = this.INITIAL_FUEL;
    }

    activate(worm: Worm): void {
        if (this.getIsActive()) {
            this.setIsActive(false);
        } else {
            super.activate(worm);
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.isActive) {
            if (this.forceDir.y !== 0) {
                const pos = Physics.vectorMetersToPixels(this.worm.body.GetPosition());
                pos.x -= this.bottomFlame.getImage().width / 2 + this.worm.direction * 10;
                pos.y -= 4;
                this.bottomFlame.draw(ctx, pos.x, pos.y);
            }

            if (this.forceDir.x !== 0) {
                const pos = Physics.vectorMetersToPixels(this.worm.body.GetPosition());
                pos.x -= this.worm.direction * 13;
                pos.y -= 15;

                ctx.save();
                ctx.translate(pos.x, pos.y);

                if (this.worm.direction === Worm.DIRECTION.right) {
                    ctx.scale(-1, 1); // Flip sprite
                }

                this.sideFlame.draw(ctx, 0, 0);
                ctx.restore();
            }

            const pos = Physics.vectorMetersToPixels(this.worm.body.GetPosition());
            ctx.save();
            ctx.translate(pos.x, pos.y);

            // Draw fuel indicator
            ctx.drawImage(ThrowableWeapon.numberBox, 30, -40);
            ctx.fillStyle = "rgba(255,0,0,255)";
            ctx.fillText(Math.floor(this.fuel).toString(), 42, -20);
            ctx.restore();

            this.forceDir = new b2Vec2(0, 0);
        }
    }

    up(): void {
        this.forceDir.y = -1;
    }

    left(): void {
        this.forceDir.x = -1.2;
        this.worm.direction = Worm.DIRECTION.left;
    }

    right(): void {
        this.forceDir.x = 1.2;
        this.worm.direction = Worm.DIRECTION.right;
    }

    deactivate(): void {
        this.setIsActive(false);
        this.fuel = this.INITIAL_FUEL;
        super.deactivate();
    }

    update(): void {
        if (this.fuel <= 0) {
            this.deactivate();
            Client.sendImmediately(
                Events.client.CURRENT_WORM_ACTION,
                new InstructionChain("getWeapon.deactivate")
            );
        }

        if (this.isActive) {
            if (keyboard.isKeyDown(Controls.aimUp.keyboard)) {
                this.up();
                Client.sendImmediately(
                    Events.client.CURRENT_WORM_ACTION,
                    new InstructionChain("getWeapon.up")
                );
            }

            if (keyboard.isKeyDown(Controls.walkLeft.keyboard)) {
                this.left();
                Client.sendImmediately(
                    Events.client.CURRENT_WORM_ACTION,
                    new InstructionChain("getWeapon.left")
                );
            }

            if (keyboard.isKeyDown(Controls.walkRight.keyboard)) {
                this.right();
                Client.sendImmediately(
                    Events.client.CURRENT_WORM_ACTION,
                    new InstructionChain("getWeapon.right")
                );
            }

            if (this.forceDir.Length() > 0) {
                Utilies.pickRandomSound(["JetPackLoop1", "JetPackLoop2"]).play();
                this.fuel -= 0.09;
                this.forceDir.Multiply(this.thrusterScaler);
                this.worm.body.ApplyImpulse(this.forceDir, this.worm.body.GetWorldCenter());
            }

            this.worm.setSpriteDef(Sprites.worms.defualtJetPack);
            this.worm.finished = true;

            if (this.forceDir.y !== 0) {
                this.bottomFlame.update();
            }

            if (this.forceDir.x !== 0) {
                this.sideFlame.update();
            }
        }
    }
}