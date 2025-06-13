import { Sprite } from "./animation/Sprite";
import { worms } from "./animation/SpriteDefinitions";
import { Team } from "./Team";
import { Physics } from "./system/Physics";
import { AssetManager } from "./system/AssetManager";
import { WormAnimationManger } from "./WormAnimationManger";
import { Target } from "./Target";
import { Timer } from "./system/Timer";

export class Worm extends Sprite {
    static DENSITY = 10.0;
    static DIRECTION = {
        left: -1,
        right: 1
    };

    body: any;
    fixture: any;
    direction!: number;
    speed!: number;
    canJump = 0;
    name!: string;
    damageTake = 0;
    health!: number;

    nameBox!: HTMLCanvasElement;
    healthBox!: HTMLCanvasElement;
    arrow: any;
    team!: Team;
    footSensor: any;
    stateAnimationMgmt!: WormAnimationManger;
    target!: Target;
    isDead = false;
    soundDelayTimer!: Timer;
    fallHeight!: number;

    constructor(team: Team, x: number, y: number) {
        super(worms.idle1);

        this.name = "Test Worm";
        this.health = 80;

        x = Physics.pixelToMeters(x);
        y = Physics.pixelToMeters(y);

        const img = AssetManager.getImage(this.spriteDef.imageName);
        const circleRadius = (img.width / 2) / Physics.worldScale;

        const fixDef = new b2FixtureDef();
        fixDef.density = Worm.DENSITY;
        fixDef.friction = 1.0;
        fixDef.restitution = 0.1;
        fixDef.shape = new b2CircleShape(circleRadius);
        fixDef.shape.SetLocalPosition(new b2Vec2(0, -circleRadius));

        const bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(x, y);

        this.fixture = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);
        this.body = this.fixture.GetBody();

        this.body.SetFixedRotation(true);
        this.body.SetSleepingAllowed(false);
        this.direction = 1;
        this.speed = 1.2;

        // Setup foot sensor
        const footFixDef = new b2FixtureDef();
        footFixDef.shape = new b2PolygonShape();
        footFixDef.shape.SetAsBox(circleRadius / 2, circleRadius / 4);
        footFixDef.isSensor = true;
        this.footSensor = this.body.CreateFixture(footFixDef);

        this.body.SetUserData(this);
        this.stateAnimationMgmt = new WormAnimationManger(this);
        this.target = new Target(this);
        this.soundDelayTimer = new Timer(200);
        this.fallHeight = this.body.GetPosition().y;

        Physics.addToFastAccessList(this.body);
    }

    preRendering(): void {
        const nameBoxWidth = this.name.length * 10;
        const healthBoxWidth = 39;
        const healthBoxHeight = 18;

        this.nameBox = document.createElement("canvas");
        this.nameBox.width = nameBoxWidth;
        this.nameBox.height = 20;

        const nameCtx = this.nameBox.getContext("2d")!;
        nameCtx.fillStyle = "#1A1110";
        nameCtx.strokeStyle = "#eee";
        nameCtx.font = "bold 16.5px Sans-Serif";
        nameCtx.textAlign = "center";
        nameCtx.fillRect(0, 0, nameBoxWidth, 20);
        nameCtx.strokeRect(0, 0, nameBoxWidth, 20);
        nameCtx.fillStyle = this.team.color;
        nameCtx.fillText(this.name, nameBoxWidth / 2, 15);

        this.healthBox = document.createElement("canvas");
        this.healthBox.width = healthBoxWidth;
        this.healthBox.height = healthBoxHeight;

        const healthCtx = this.healthBox.getContext("2d")!;
        healthCtx.fillStyle = "#1A1110";
        healthCtx.strokeStyle = "#eee";
        healthCtx.font = "bold 16.5px Sans-Serif";
        healthCtx.textAlign = "center";
        healthCtx.fillRect(0, 0, healthBoxWidth, healthBoxHeight);
        healthCtx.strokeRect(0, 0, healthBoxWidth, healthBoxHeight);
        healthCtx.fillStyle = this.team.color;
        healthCtx.fillText(Math.floor(this.health).toString(), healthBoxWidth / 2, healthBoxHeight - 3);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const radius = this.fixture.GetShape().GetRadius() * Physics.worldScale;
        const pos = Physics.metersToPixelsVec(this.body.GetPosition());

        ctx.save();
        ctx.translate(pos.x, pos.y);

        ctx.save();
        if (this.direction === Worm.DIRECTION.right) {
            ctx.scale(-1, 1);
        }

        super.draw(ctx, -this.getFrameWidth() / 2, -this.getFrameHeight() / 1.5);
        ctx.restore();

        if (!this.isDead) {
            const nameBoxX = -radius * this.name.length / 2.6;
            const nameBoxY = -radius * 6;
            ctx.drawImage(this.nameBox, nameBoxX, nameBoxY);
            ctx.drawImage(this.healthBox, -radius * 1.5, -radius * 4);
        }

        ctx.restore();
    }
}