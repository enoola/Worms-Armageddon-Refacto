/**
 * WorldBoundary.js
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */
//<reference path="../system/Physics.ts"/>
//<reference path="../system/Utils.ts" />
//<reference path="Terrain.ts" />

import { Physics } from "@/system/Physics";
import { b2Body, b2BodyType, b2FixtureDef, b2PolygonShape } from "@box2d/core";

export class TerrainBoundary
{
    worldWidth;
    worldHeight;

    outerWorldWidth: number = 0;
    outerWorldHeight: number = 0;
    
    constructor (worldWidth: number,worldHeight:number)
    {

        this.worldWidth = worldWidth; 
        this.worldHeight = worldHeight;

        var topPositionY = Physics.pixelToMeters(worldHeight / 5);
        var sidesPositionX =  Physics.pixelToMeters(worldWidth / 5);

        //Bottom
        var fixDef: b2FixtureDef = {
            density: 1.0,
            friction: 1.0,
            restitution: 0.0,
            shape: (new b2PolygonShape()).SetAsBox(Physics.pixelToMeters(worldWidth) + sidesPositionX * 2, 0.5),
        }
        //fixDef.shape= new b2PolygonShape();
        //fixDef.shape.SetAsBox(Physics.pixelToMeters(worldWidth) + sidesPositionX * 2, 0.5);

       var bodyDef: b2BodyDef = {
            type: b2BodyType.b2_dynamicBody,            
            position.x: -sidesPositionX,
            position.y: Physics.pixelToMeters(worldHeight),
       }
       var bottom = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody();
       bottom.SetUserData(this);

        
        // Top 
       bodyDef.position.x = -sidesPositionX;
       bodyDef.position.y = -topPositionY;
       fixDef.shape.SetAsBox( Physics.pixelToMeters(worldWidth)+sidesPositionX*2, 0.5);

       var body = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody();
       body.SetUserData(null);


       // left 
       bodyDef.position.x = -sidesPositionX;
       bodyDef.position.y = -topPositionY;
       fixDef.shape.SetAsBox( 0.5,  Physics.pixelToMeters(worldHeight)+topPositionY);

       body = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody();


        // right
       bodyDef.position.x = Physics.pixelToMeters(worldWidth)+sidesPositionX;
       bodyDef.position.y = -topPositionY;
       fixDef.shape.SetAsBox( 0.5,  Physics.pixelToMeters(worldHeight)+topPositionY);

       body = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody();


    }


       // What happens when a worm collies with another object
    beginContact(contact)
    {
        var obj1 = contact.GetFixtureA().GetBody().GetUserData();
        var obj2 = contact.GetFixtureB().GetBody().GetUserData();

        if (obj1 instanceof Worm)
        {
            obj1.hit(obj1.getHealth());

        }else if (obj2 instanceof Worm)
        {
            obj2.hit(obj2.getHealth());
        }
    }

 
}