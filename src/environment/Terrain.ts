import { b2Vec2, b2FixtureDef, b2BodyDef, b2PolygonShape, b2Body, b2AABB } from "@box2d/core";
import { Physics } from "@/system/Physics";
import { Utilies } from "@/system/Utilies";
import { TerrainBoundary } from "./TerrainBoundary";
import { Waves } from "./Waves";
import { GameInstance } from "@/GameInstance";

/**
 * Terrain class
 * 
 * Handles terrain physics, rendering, and dynamic deformations (e.g., explosions).
 */
export class Terrain {
    drawingCanvas: HTMLCanvasElement;
    drawingCanvasContext: CanvasRenderingContext2D;
    bufferCanvas: HTMLCanvasElement;
    bufferCanvasContext: CanvasRenderingContext2D;
    world: any;
    scale: number;
    terrainData: ImageData;
    Offset: b2Vec2;
    wave: Waves;
    boundary: TerrainBoundary;
    deformTerrainBatchList: Array<{ xPos: number; yPos: number; radius: number; width?: number }> = [];

    TERRAIN_RECT_HEIGHT: number;

    constructor(canvas: HTMLCanvasElement, terrainImage: HTMLImageElement, world: any, scale: number) {
        this.world = world;
        this.scale = scale;
        this.Offset = new b2Vec2(2300, 1300);

        this.drawingCanvas = canvas;
        this.drawingCanvasContext = this.drawingCanvas.getContext("2d")!;

        this.TERRAIN_RECT_HEIGHT = 5;

        // Create offscreen buffer canvas
        this.bufferCanvas = document.createElement("canvas");
        this.bufferCanvas.width = this.Offset.x + (terrainImage.width * 1.5);
        this.bufferCanvas.height = this.Offset.y + (terrainImage.height * 1.5);
        this.boundary = new TerrainBoundary(this.bufferCanvas.width + this.Offset.x, this.bufferCanvas.height + 100);

        this.bufferCanvasContext = this.bufferCanvas.getContext("2d")!;
        if (!this.bufferCanvasContext) throw new Error("Failed to get canvas context");

        // Draw terrain image onto buffer canvas
        this.bufferCanvasContext.fillStyle = "rgba(0,0,0,255)";
        this.bufferCanvasContext.drawImage(
            terrainImage,
            this.Offset.x,
            this.Offset.y,
            this.bufferCanvas.width - this.Offset.x,
            this.bufferCanvas.height - this.Offset.y
        );

        // Store pixel data for dynamic modifications
        this.terrainData = this.bufferCanvasContext.getImageData(
            this.Offset.x,
            this.Offset.y,
            this.bufferCanvas.width - this.Offset.x,
            this.bufferCanvas.height - this.Offset.y
        );

        // Setup physics from image data
        this.createTerrainPhysics(
            0, 0,
            this.bufferCanvas.width - this.Offset.x,
            this.bufferCanvas.height - this.Offset.y,
            this.terrainData.data,
            this.world,
            this.scale
        );

        // Set composite mode for terrain cutting
        this.bufferCanvasContext.globalCompositeOperation = "destination-out";

        // Initialize wave effects
        this.wave = new Waves();
    }

    getWidth(): number {
        return this.boundary.worldWidth;
    }

    getHeight(): number {
        return this.boundary.worldHeight;
    }

    /**
     * Creates static Box2D bodies based on image pixel data
     */
    createTerrainPhysics(x: number, y: number, width: number, height: number, data: Uint8ClampedArray, world: any, worldScale: number): void {
        const theAlphaByte = 3;
        const rectheight = this.TERRAIN_RECT_HEIGHT;

        // Setup shared fixture definition
        const fixDef = new b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 1.0;
        fixDef.restitution = 0.0;
        fixDef.shape = new b2PolygonShape();

        const bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_staticBody;

        let bodiesCreated = 0;

        // Helper to create terrain block
        const makeBlock = (xPos: number, yPos: number, rectWidth: number): void => {
            const halfWidth = (rectWidth / worldScale) / 2;
            const halfHeight = (rectheight / worldScale) / 2;

            fixDef.shape.SetAsBox(halfWidth, halfHeight);

            bodyDef.position.Set(
                ((xPos / 4) - rectWidth / 2) / worldScale + offset.x,
                ((yPos - rectheight) / worldScale + offset.y)
            );

            const body = world.CreateBody(bodyDef);
            body.CreateFixture(fixDef);
            body.SetUserData(this);
            bodiesCreated++;
        };

        const offset = Physics.vectorPixelToMeters(this.Offset);

        // Loop through pixel data to generate terrain blocks
        for (let yPos = y; yPos <= height; yPos += rectheight) {
            let rectWidth = 0;

            for (let xPos = x; xPos <= width; xPos += 4) {
                const pixelIndex = xPos + yPos * width;

                if (data[pixelIndex + theAlphaByte] === 255) {
                    rectWidth++;
                } else if (rectWidth > 1) {
                    makeBlock(xPos - rectWidth * 4, yPos, rectWidth * 4);
                    rectWidth = 0;
                }
            }

            // If we ended the row with a block, create it
            if (rectWidth > 1) {
                makeBlock(width, yPos, rectWidth * 4);
                rectWidth = 0;
            }
        }

        console.log(`Terrain bodies created: ${bodiesCreated}`);
    }

    /**
     * Queue terrain deformation (e.g., explosion)
     */
    addToDeformBatch(x: number, y: number, r: number): void {
        this.deformTerrainBatchList.push({ xPos: x, yPos: y, radius: r });
    }

    addRectToDeformBatch(x: number, y: number, w: number, h: number): void {
        this.deformTerrainBatchList.push({ xPos: x, yPos: y, radius: h, width: w });
    }

    /**
     * Process all queued terrain deformations
     */
    deformRegionBatch(): void {
        if (this.deformTerrainBatchList.length === 0) return;

        const angle = Math.PI * 2;

        // Apply all deformations to buffer canvas
        this.bufferCanvasContext.beginPath();
        for (const tmp of this.deformTerrainBatchList) {
            if (tmp.width) {
                this.bufferCanvasContext.fillRect(
                    tmp.xPos - tmp.width / 2,
                    tmp.yPos,
                    tmp.width,
                    tmp.radius
                );
            } else {
                this.bufferCanvasContext.arc(
                    tmp.xPos,
                    tmp.yPos,
                    tmp.radius,
                    0,
                    angle,
                    true
                );
            }
        }
        this.bufferCanvasContext.closePath();
        this.bufferCanvasContext.fill();

        // Update terrain data from modified buffer canvas
        this.terrainData = this.bufferCanvasContext.getImageData(
            this.Offset.x,
            this.Offset.y,
            this.bufferCanvas.width - this.Offset.x,
            this.bufferCanvas.height - this.Offset.y
        );

        // For each deformation, update physics
        for (const tmp of this.deformTerrainBatchList) {
            const normalizedRadius = Math.floor(tmp.radius / this.TERRAIN_RECT_HEIGHT) * this.TERRAIN_RECT_HEIGHT;
            const y = Math.floor(tmp.yPos / this.TERRAIN_RECT_HEIGHT) * this.TERRAIN_RECT_HEIGHT;

            // Bounding box for terrain modification
            const aabb = new b2AABB();
            aabb.lowerBound.Set(
                0,
                Physics.pixelToMeters(y - normalizedRadius)
            );
            aabb.upperBound.Set(
                Physics.pixelToMeters(this.bufferCanvas.width),
                Physics.pixelToMeters(y + normalizedRadius)
            );

            // Remove old terrain bodies in area
            Physics.world.QueryAABB((fixture: any) => {
                const body = fixture.GetBody();
                if (body.GetType() === b2Body.b2_staticBody && body.GetUserData() instanceof Terrain) {
                    this.world.DestroyBody(body);
                }
                return true;
            }, aabb);

            // Recreate terrain physics for this area
            this.createTerrainPhysics(
                0, // x start
                Physics.metersToPixels(aabb.lowerBound.y) - this.Offset.y, // y start
                this.bufferCanvas.width, // width
                Physics.metersToPixels(aabb.upperBound.y) + (this.TERRAIN_RECT_HEIGHT * 2) - this.Offset.y, // height
                this.terrainData.data,
                this.world,
                this.scale
            );
        }

        // Clear batch list
        this.deformTerrainBatchList = [];
    }

    update(): void {
        if (this.deformTerrainBatchList.length > 0) {
            this.deformRegionBatch();
        }
        this.wave.update();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const y = GameInstance.camera.getY();
        const x = GameInstance.camera.getX();
        const w = this.drawingCanvas.width;
        const h = this.drawingCanvas.height;

        // Draw buffer canvas to screen with camera offset
        ctx.drawImage(
            this.bufferCanvas,
            x,
            y,
            w,
            h,
            0,
            -5,
            w,
            h
        );
    }
}