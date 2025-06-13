// box2d-imports.ts
const Box2D = window['Box2D'];

export const b2Vec2 = Box2D.Common.Math.b2Vec2;
export const b2BodyDef = Box2D.Dynamics.b2BodyDef;
export const b2Body = Box2D.Dynamics.b2Body;
export const b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
export const b2Fixture = Box2D.Dynamics.b2Fixture;
export const b2World = Box2D.Dynamics.b2World;
export const b2MassData = Box2D.Collision.Shapes.b2MassData;
export const b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
export const b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
export const b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
export const b2AABB = Box2D.Collision.b2AABB;
export const b2ContactListener = Box2D.Dynamics.b2ContactListener;
export const b2RayCastInput = Box2D.Collision.b2RayCastInput;
export const b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
export const b2RayCastOutput = Box2D.Collision.b2RayCastOutput;
export const b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
export const b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;
export const b2SimplexVertex = Box2D.Collision.b2SimplexVertex;
export const b2WorldManifold = Box2D.Collision.b2WorldManifold;
export const b2Shape = Box2D.Collision.Shapes.b2Shape;