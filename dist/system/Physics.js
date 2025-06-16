/**
 * @namespace Physics
 * @description Manages world, gravity, raycasting, contact listeners, etc.
 * @author qwenola
 * @version 1.0.0
 * @date 20250613
 */
import { b2Vec2, b2World, b2ContactListener, b2AABB, b2RayCastInput, b2RayCastOutput, } from "@box2d/core";
import { b2DebugDraw } from "@box2d/debug-draw";
// Re-export Box2D for convenience
//export { Box2D } from "../types/box2d-imports";
/**
 * Physics namespace/module
 * Manages world, gravity, raycasting, contact listeners, etc.
 */
export var Physics;
(function (Physics) {
    Physics.worldScale = 30;
    let world = null;
    let debugDraw = null;
    const fastAccessList = [];
    /**
     * Initialize physics world and debug draw
     */
    function init(ctx) {
        if (world)
            return;
        world = b2World.Create(new b2Vec2(0, 10)); // gravity + allow sleep
        debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(ctx);
        debugDraw.SetDrawScale(Physics.worldScale);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_jointBit | b2DebugDraw.e_shapeBit);
        world.SetDebugDraw(debugDraw);
        const listener = new b2ContactListener();
        listener.BeginContact = (contact) => {
            const userDataA = contact.GetFixtureA().GetBody().GetUserData();
            const userDataB = contact.GetFixtureB().GetBody().GetUserData();
            if (userDataA === null || userDataA === void 0 ? void 0 : userDataA.beginContact)
                userDataA.beginContact(contact);
            if (userDataB === null || userDataB === void 0 ? void 0 : userDataB.beginContact)
                userDataB.beginContact(contact);
        };
        listener.EndContact = (contact) => {
            const userDataA = contact.GetFixtureA().GetBody().GetUserData();
            const userDataB = contact.GetFixtureB().GetBody().GetUserData();
            if (userDataA === null || userDataA === void 0 ? void 0 : userDataA.endContact)
                userDataA.endContact(contact);
            if (userDataB === null || userDataB === void 0 ? void 0 : userDataB.endContact)
                userDataB.endContact(contact);
        };
        listener.PostSolve = (contact, impulse) => {
            const userDataA = contact.GetFixtureA().GetBody().GetUserData();
            const userDataB = contact.GetFixtureB().GetBody().GetUserData();
            if (userDataA === null || userDataA === void 0 ? void 0 : userDataA.postSolve)
                userDataA.postSolve(contact, impulse);
            if (userDataB === null || userDataB === void 0 ? void 0 : userDataB.postSolve)
                userDataB.postSolve(contact, impulse);
        };
        listener.PreSolve = (contact) => {
            const userDataA = contact.GetFixtureA().GetBody().GetUserData();
            const userDataB = contact.GetFixtureB().GetBody().GetUserData();
            if (userDataA === null || userDataA === void 0 ? void 0 : userDataA.preSolve)
                userDataA.preSolve(contact);
            if (userDataB === null || userDataB === void 0 ? void 0 : userDataB.preSolve)
                userDataB.preSolve(contact);
        };
        world.SetContactListener(listener);
    }
    Physics.init = init;
    ;
    /**
     * Add body to fast access list
     */
    function addToFastAcessList(body) {
        fastAccessList.push(body);
    }
    Physics.addToFastAcessList = addToFastAcessList;
    ;
    /**
     * Remove body from fast access list
     */
    function removeToFastAcessList(body) {
        const index = fastAccessList.indexOf(body);
        if (index > -1) {
            fastAccessList.splice(index, 1);
        }
    }
    Physics.removeToFastAcessList = removeToFastAcessList;
    /**
     * Check if contact involves both types
     */
    function isCollisionBetweenTypes(objType1, objType2, contact) {
        const obj1 = contact.GetFixtureA().GetBody().GetUserData();
        const obj2 = contact.GetFixtureB().GetBody().GetUserData();
        return ((obj1 instanceof objType1 || obj1 instanceof objType2) &&
            (obj2 instanceof objType1 || obj2 instanceof objType2));
    }
    Physics.isCollisionBetweenTypes = isCollisionBetweenTypes;
    /**
     * Raycast utility
     */
    function shotRay(startPiontInMeters, endPiontInMeters) {
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
        for (let b = world.GetBodyList(); b; b = b.GetNext()) {
            for (let f = b.GetFixtureList(); f; f = f.GetNext()) {
                if (!f.RayCast(output, input))
                    continue;
                if (output.fraction < closestFraction && output.fraction > 0.001) {
                    closestFraction = output.fraction;
                    intersectionPoint = new b2Vec2(startPiontInMeters.x + closestFraction * (extendedEnd.x - startPiontInMeters.x), startPiontInMeters.y + closestFraction * (extendedEnd.y - startPiontInMeters.y));
                    bodyFound = true;
                }
            }
        }
        return bodyFound ? intersectionPoint : null;
    }
    Physics.shotRay = shotRay;
    /**
     * Apply function to objects within radius
     */
    function applyToNearByObjects(epicenter, effectedRadius, funcToApplyToEach) {
        const aabb = new b2AABB();
        aabb.lowerBound.Set(epicenter.x - effectedRadius, epicenter.y - effectedRadius);
        aabb.upperBound.Set(epicenter.x + effectedRadius, epicenter.y + effectedRadius);
        world.QueryAABB((fixture) => {
            funcToApplyToEach(fixture, epicenter);
            return true;
        }, aabb);
    }
    Physics.applyToNearByObjects = applyToNearByObjects;
    /**
     * Convert pixels to meters
     */
    function pixelToMeters(pixels) {
        return pixels / Physics.worldScale;
    }
    Physics.pixelToMeters = pixelToMeters;
    /**
     * Convert meters to pixels
     */
    function metersToPixels(meters) {
        return meters * Physics.worldScale;
    }
    Physics.metersToPixels = metersToPixels;
    /**
     * Vector conversion helpers
     */
    function vectorPixelToMeters(vPixels) {
        return new b2Vec2(vPixels.x / Physics.worldScale, vPixels.y / Physics.worldScale);
    }
    Physics.vectorPixelToMeters = vectorPixelToMeters;
    function vectorMetersToPixels(vMeters) {
        return new b2Vec2(vMeters.x * Physics.worldScale, vMeters.y * Physics.worldScale);
    }
    Physics.vectorMetersToPixels = vectorMetersToPixels;
    function bodyToDrawingPixelCoordinates(body) {
        const pos = body.GetPosition();
        const radius = body.GetFixtureList().GetShape().GetRadius();
        return vectorMetersToPixels(new b2Vec2(pos.x - radius, pos.y - radius));
    }
    Physics.bodyToDrawingPixelCoordinates = bodyToDrawingPixelCoordinates;
})(Physics || (Physics = {}));
;
