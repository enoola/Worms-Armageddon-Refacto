//Refacto on Physics legacy invocation
//replacement of: declare var Box2D;
//                //Global defining of shortened names for box2d types
//                var b2Vec2 = Box2D.Common.Math.b2Vec2,
//declare const Box2D: any;

interface Window {
    readonly Box2D: any; // Replace with more specific type if available
}