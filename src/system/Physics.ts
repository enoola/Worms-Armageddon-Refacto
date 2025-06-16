/**
 * @namespace Physics
 * @description Manages world, gravity, raycasting, contact listeners, etc.
 * @author qwenola
 * @version 1.0.0
 * @date 20250613
 */

import { b2DebugDraw } from "@box2d/debug-draw";
import {
  b2Vec2,
  b2BodyDef,
  b2Body,
  b2FixtureDef,
  b2World,
  b2ContactListener,
  b2AABB,
  b2RayCastInput,
  b2RayCastOutput,
  b2DistanceJointDef,
  b2RevoluteJointDef,
  b2WorldManifold,
  b2Shape,
} from "@box2d/core";



import { Utils } from "./Utils";
import { Settings } from "../Settings";
import { Logger } from "../utils/logger";

// Re-export Box2D for convenience
//export { Box2D } from "../types/box2d-imports";


/**
 * Physics namespace/module
 * Manages world, gravity, raycasting, contact listeners, etc.
 */
export namespace Physics {
    export const worldScale = 30;

    let world: b2World | null = null;
    let debugDraw: b2DebugDraw | null = null;
    const fastAccessList: b2Body[] = [];

    /**
     * Initialize physics world and debug draw
     */
    export function init(ctx: CanvasRenderingContext2D): void {
        if (world) return;


        world = b2World.Create(new b2Vec2(0, 10)); // gravity + allow sleep

        debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(ctx);
        debugDraw.SetDrawScale(worldScale);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_jointBit | b2DebugDraw.e_shapeBit);

        world.SetDebugDraw(debugDraw);

        const listener = new b2ContactListener();

        listener.BeginContact = (contact: b2Contact) => {
            const userDataA = contact.GetFixtureA().GetBody().GetUserData();
            const userDataB = contact.GetFixtureB().GetBody().GetUserData();

            if (userDataA?.beginContact) userDataA.beginContact(contact);
            if (userDataB?.beginContact) userDataB.beginContact(contact);
        };

        listener.EndContact = (contact: { x: number, y: number }) => {
            const userDataA = contact.GetFixtureA().GetBody().GetUserData();
            const userDataB = contact.GetFixtureB().GetBody().GetUserData();

            if (userDataA?.endContact) userDataA.endContact(contact);
            if (userDataB?.endContact) userDataB.endContact(contact);
        };

        listener.PostSolve = (contact: { x: number, y: number }, impulse) => {
            const userDataA = contact.GetFixtureA().GetBody().GetUserData();
            const userDataB = contact.GetFixtureB().GetBody().GetUserData();

            if (userDataA?.postSolve) userDataA.postSolve(contact, impulse);
            if (userDataB?.postSolve) userDataB.postSolve(contact, impulse);
        };

        listener.PreSolve = (contact) => {
            const userDataA = contact.GetFixtureA().GetBody().GetUserData();
            const userDataB = contact.GetFixtureB().GetBody().GetUserData();

            if (userDataA?.preSolve) userDataA.preSolve(contact);
            if (userDataB?.preSolve) userDataB.preSolve(contact);
        };

        world.SetContactListener(listener);
    };

    /**
     * Add body to fast access list
     */
    export function addToFastAcessList(body: b2Body): void {
        fastAccessList.push(body);
    };

    /**
     * Remove body from fast access list
     */
    export function removeToFastAcessList(body: typeof b2Body): void {
        const index = fastAccessList.indexOf(body);
        if (index > -1) {
            fastAccessList.splice(index, 1);
        }
    },

    /**
     * Check if contact involves both types
     */
    export function isCollisionBetweenTypes(objType1: any, objType2: any, contact: any): boolean {
        const obj1 = contact.GetFixtureA().GetBody().GetUserData();
        const obj2 = contact.GetFixtureB().GetBody().GetUserData();

        return (
            (obj1 instanceof objType1 || obj1 instanceof objType2) &&
            (obj2 instanceof objType1 || obj2 instanceof objType2)
        );
    },

    /**
     * Raycast utility
     */
    export function shotRay(startPiontInMeters: typeof b2Vec2, endPiontInMeters: typeof b2Vec2): typeof b2Vec2 | null {
        const input = new b2RayCastInput();
        const output = new b2RayCastOutput();
        let intersectionPoint = new b2Vec2();
        let closestFraction = 1;
        let bodyFound = false;

        const extendedEnd = new b2Vec2(endPiontInMeters.x * 30, endPiontInMeters.y * 30);
        extendedEnd.Add(startPiontInMeters);

        input.p1 = startPiontInMeters;
        input.p2 = extendedEnd;
        input.maxFraction = 1;

        for (let b = world!.GetBodyList(); b; b = b.GetNext()) {
            for (let f = b.GetFixtureList(); f; f = f.GetNext()) {
                if (!f.RayCast(output, input)) continue;

                if (output.fraction < closestFraction && output.fraction > 0.001) {
                    closestFraction = output.fraction;
                    intersectionPoint = new b2Vec2 (
                        startPiontInMeters.x + closestFraction * (extendedEnd.x - startPiontInMeters.x),
                        startPiontInMeters.y + closestFraction * (extendedEnd.y - startPiontInMeters.y)
                    );
                    bodyFound = true;
                }
            }
        }

        return bodyFound ? intersectionPoint : null;
    }

    /**
     * Apply function to objects within radius
     */
    export function applyToNearByObjects(epicenter: typeof b2Vec2, effectedRadius: number, funcToApplyToEach: (fixture: any, epicenter: typeof b2Vec2) => void): void {
        const aabb = new b2AABB();
        aabb.lowerBound.Set(epicenter.x - effectedRadius, epicenter.y - effectedRadius);
        aabb.upperBound.Set(epicenter.x + effectedRadius, epicenter.y + effectedRadius);

        world!.QueryAABB((fixture) => {
            funcToApplyToEach(fixture, epicenter);
            return true;
        }, aabb);
    }

    /**
     * Convert pixels to meters
     */
    export function pixelToMeters(pixels: number): number {
        return pixels / worldScale;
    }

    /**
     * Convert meters to pixels
     */
    export function metersToPixels(meters: number): number {
        return meters * worldScale;
    }

    /**
     * Vector conversion helpers
     */
    export function vectorPixelToMeters(vPixels: typeof b2Vec2): typeof b2Vec2 {
        return new b2Vec2(vPixels.x / worldScale, vPixels.y / worldScale);
    }

    export function vectorMetersToPixels(vMeters: b2Vec2): b2Vec2 {
        return new b2Vec2(vMeters.x * worldScale, vMeters.y * worldScale);
    }

   export function bodyToDrawingPixelCoordinates(body: typeof b2Body): typeof b2Vec2 {
        const pos = body.GetPosition();
        const radius = body.GetFixtureList().GetShape().GetRadius();
        return vectorMetersToPixels(new b2Vec2(pos.x - radius, pos.y - radius));
    }
  };
