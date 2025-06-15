/**
 * @namespace Physics
 * @description Manages world, gravity, raycasting, contact listeners, etc.
 * @author qwenola
 * @version 1.0.0
 * @date 20250613
 */
import { b2Vec2, b2World, b2DebugDraw, b2ContactListener, b2AABB, b2RayCastInput, b2RayCastOutput, } from "../types/box2d-imports";
// Re-export Box2D for convenience
export { Box2D } from "../types/box2d-imports";
/**
 * Physics namespace/module
 * Manages world, gravity, raycasting, contact listeners, etc.
 */
export const Physics = {
    worldScale: 30,
    //world: null as b2World | null,
    world: typeof b2World,
    //debugDraw: null as b2DebugDraw | null,
    debugDraw: b2DebugDraw,
    fastAcessList: [],
    /**
     * Initialize physics world and debug draw
     */
    init(ctx) {
        if (this.world)
            return;
        this.world = new b2World(new b2Vec2(0, 10), true); // gravity + allow sleep
        this.debugDraw = new b2DebugDraw();
        this.debugDraw.SetSprite(ctx);
        this.debugDraw.SetDrawScale(this.worldScale);
        this.debugDraw.SetFillAlpha(0.3);
        this.debugDraw.SetLineThickness(1.0);
        this.debugDraw.SetFlags(b2DebugDraw.e_jointBit | b2DebugDraw.e_shapeBit);
        this.world.SetDebugDraw(this.debugDraw);
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
        this.world.SetContactListener(listener);
    },
    /**
     * Add body to fast access list
     */
    addToFastAcessList(body) {
        this.fastAcessList.push(body);
    },
    /**
     * Remove body from fast access list
     */
    removeToFastAcessList(body) {
        const index = this.fastAcessList.indexOf(body);
        if (index > -1) {
            this.fastAcessList.splice(index, 1);
        }
    },
    /**
     * Check if contact involves both types
     */
    isCollisionBetweenTypes(objType1, objType2, contact) {
        const obj1 = contact.GetFixtureA().GetBody().GetUserData();
        const obj2 = contact.GetFixtureB().GetBody().GetUserData();
        return ((obj1 instanceof objType1 || obj1 instanceof objType2) &&
            (obj2 instanceof objType1 || obj2 instanceof objType2));
    },
    /**
     * Raycast utility
     */
    shotRay(startPiontInMeters, endPiontInMeters) {
        const input = new b2RayCastInput();
        const output = new b2RayCastOutput();
        let intersectionPoint = new b2Vec2();
        let closestFraction = 1;
        let bodyFound = false;
        const extendedEnd = b2Vec2.Make(endPiontInMeters.x * 30, endPiontInMeters.y * 30);
        extendedEnd.Add(startPiontInMeters);
        input.p1 = startPiontInMeters;
        input.p2 = extendedEnd;
        input.maxFraction = 1;
        for (let b = this.world.GetBodyList(); b; b = b.GetNext()) {
            for (let f = b.GetFixtureList(); f; f = f.GetNext()) {
                if (!f.RayCast(output, input))
                    continue;
                if (output.fraction < closestFraction && output.fraction > 0.001) {
                    closestFraction = output.fraction;
                    intersectionPoint = b2Vec2.Make(startPiontInMeters.x + closestFraction * (extendedEnd.x - startPiontInMeters.x), startPiontInMeters.y + closestFraction * (extendedEnd.y - startPiontInMeters.y));
                    bodyFound = true;
                }
            }
        }
        return bodyFound ? intersectionPoint : null;
    },
    /**
     * Apply function to objects within radius
     */
    applyToNearByObjects(epicenter, effectedRadius, funcToApplyToEach) {
        const aabb = new b2AABB();
        aabb.lowerBound.Set(epicenter.x - effectedRadius, epicenter.y - effectedRadius);
        aabb.upperBound.Set(epicenter.x + effectedRadius, epicenter.y + effectedRadius);
        this.world.QueryAABB((fixture) => {
            funcToApplyToEach(fixture, epicenter);
            return true;
        }, aabb);
    },
    /**
     * Convert pixels to meters
     */
    pixelToMeters(pixels) {
        return pixels / this.worldScale;
    },
    /**
     * Convert meters to pixels
     */
    metersToPixels(meters) {
        return meters * this.worldScale;
    },
    /**
     * Vector conversion helpers
     */
    vectorPixelToMeters(vPixels) {
        return new b2Vec2(vPixels.x / this.worldScale, vPixels.y / this.worldScale);
    },
    vectorMetersToPixels(vMeters) {
        return new b2Vec2(vMeters.x * this.worldScale, vMeters.y * this.worldScale);
    },
    bodyToDrawingPixelCoordinates(body) {
        const pos = body.GetPosition();
        const radius = body.GetFixtureList().GetShape().GetRadius();
        return this.vectorMetersToPixels(new b2Vec2(pos.x - radius, pos.y - radius));
    },
};
