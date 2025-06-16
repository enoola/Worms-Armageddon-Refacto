import { b2BodyType } from "@box2d/core";
import * as Utils from "@/system/Utils";
import { AssetManager } from "@/system/AssetManager";
import { Physics } from "@/system/Physics";
import { Worm } from "./animation/Worm";
import { ParticleEffect } from "@/animation/ParticleEffect";
/**
 * Effects namespace/module
 * Handles explosion logic, force application, and particle effects
 */
export const Effects = {
    /**
     * Creates an explosion effect and applies physics damage
     */
    explosion(epicenter, explosionRadius, effectedRadius, explosiveForce, maxDamage, entityThatCausedExplosion = null, soundEffectToPlay = null, particleEffectType = ParticleEffect) {
        // Default sound
        if (!soundEffectToPlay) {
            soundEffectToPlay = AssetManager.getSound(`explosion${Utils.random(1, 3)}`);
        }
        const posX = Physics.metersToPixels(Math.floor(epicenter.x));
        const posY = Physics.metersToPixels(Math.floor(epicenter.y));
        GameInstance.terrain.addToDeformBatch(posX, posY, explosionRadius);
        // Apply force and damage to nearby bodies
        Physics.applyToNearByObjects(epicenter, effectedRadius, (fixture, epicenter) => {
            try {
                const body = fixture.GetBody();
                // Skip static bodies
                //if (body.GetType() === b2Body.b2_staticBody) return;
                if (body.GetType() === b2BodyType.b2_staticBody)
                    return;
                const userData = body.GetUserData();
                if (!userData)
                    return;
                // Apply force only to worms
                if (userData instanceof Worm) {
                    const direction = body.GetPosition().Copy();
                    direction.Subtract(epicenter);
                    const forceVec = direction.Copy();
                    const distanceFromEpicenter = Math.max(0, (effectedRadius - direction.Length()) / effectedRadius);
                    fixture.GetBody().GetUserData().hit(maxDamage * distanceFromEpicenter, entityThatCausedExplosion);
                    forceVec.Normalize();
                    forceVec.Multiply(explosiveForce * distanceFromEpicenter);
                    // Reduce vertical force for dead worms
                    if (userData.isDead) {
                        forceVec.x = 0;
                        forceVec.y /= 10;
                    }
                    body.ApplyImpulse(forceVec, body.GetPosition());
                }
            }
            catch (e) {
                console.warn("Error in explosion physics", e);
            }
        });
        // Play sound
        if (soundEffectToPlay) {
            soundEffectToPlay.play();
        }
        // Create particle animation
        const particleAnimation = new particleEffectType(posX, posY);
        GameInstance.particleEffectMgmt.add(particleAnimation);
        return particleAnimation;
    }
};
