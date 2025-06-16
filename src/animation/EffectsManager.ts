/**
 * ParticleEffectManager.js
 * This simply manages an arrray of particle effects, updates and draws them 
 * once the effect it complete it will be removed from the collection
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */

import { Utils } from "@/system/Utils";
import { ParticleEffect } from "./ParticleEffect";

class EffectsManager
{

    particleEffects: ParticleEffect[];

    constructor ()
    {
        this.particleEffects = [];
    }

    add(effect: ParticleEffect) : void
    {
        this.particleEffects.push(effect);
    }

    stopAll() : void
    {
        for (var i = this.particleEffects.length - 1; i >= 0; i--)
        {
            this.particleEffects[i].finished = true;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void
    {
        for (var i = this.particleEffects.length - 1; i >= 0; i--)
        {
            this.particleEffects[i].draw(ctx);
        }
    }

    areAllAnimationsFinished() : boolean
    {
        return (this.particleEffects.length == 0);
    }

    update()
    {
        for (var i = this.particleEffects.length - 1; i >= 0; i--)
        {
            this.particleEffects[i].update();

            //TODO deleting while looping??
            if (this.particleEffects[i].finished == true)
            {
                Utils.deleteFromCollection(this.particleEffects, i);
            }

        }


    }


}