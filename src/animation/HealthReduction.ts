/**
 * HealthReduction.js
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */
import { Timer } from "../system/Timer";
import { Utils } from "../system/Utils";
import { Graphics } from "../system/Graphics"; // Assuming Graphics utilities are in a module
//import { CanvasRenderingContext2D } from "canvas"; // For browser environment typings

/**
 * Toast message that displays floating text/icons (e.g., health reduction, notifications)
 */
export class ToastMessage {
    public finished: boolean = false;
    private color: string;
    private pos: { x: number; y: number };
    private message: string | number;
    private speed: number;
    private box: HTMLCanvasElement;
    private timer: Timer;
    private onFinishFunc?: () => void;

    /**
     * Pre-renders a health box for numerical messages
     */
    private preRenderNumberBox(): HTMLCanvasElement {
        const width = 39;
        const height = 18;

        return Graphics.preRenderer.render((ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = "#1A1110";
            ctx.strokeStyle = "#EEE";
            Graphics.roundRect(ctx, 0, 0, width, height, 4).fill();
            Graphics.roundRect(ctx, 0, 0, width, height, 4).stroke();
        }, width, height);
    }

    /**
     * Pre-renders a message box for textual content
     */
    private preRenderMessageBox(): HTMLCanvasElement {
        const width = (this.message.toString().length + 1) * 10; // Add padding
        const height = 20;

        return Graphics.preRenderer.render((ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = "#1A1110";
            ctx.strokeStyle = "#EEE";
            ctx.font = "bold 16.5px Sans-Serif";
            ctx.textAlign = "center";

            Graphics.roundRect(ctx, 0, 0, width, height, 4).fill();
            Graphics.roundRect(ctx, 0, 0, width, height, 4).stroke();

            ctx.fillStyle = this.color;
            ctx.fillText(this.message.toString(), width / 2, 15);
        }, width, height);
    }

    /**
     * Creates a new toast message
     * @param position Initial screen position
     * @param message Text or number to display
     * @param color Color for the message text
     * @param duration Time in ms before fading out
     * @param speed Vertical float speed
     */
    constructor(
        position: { x: number; y: number },
        message: string | number,
        color: string,
        duration: number = 2700,
        speed: number = 0.7
    ) {
        this.pos = { x: position.x, y: position.y };
        this.message = message;
        this.color = color;
        this.speed = speed;

        // Choose appropriate rendering style
        if (Utils.isNumber(message)) {
            this.message = Math.floor(Number(message));
            this.box = this.preRenderNumberBox();
        } else {
            this.box = this.preRenderMessageBox();
        }

        // Center horizontally and offset vertically
        this.pos.x -= this.box.width / 2;
        this.pos.y -= this.box.height * 2;

        this.timer = new Timer(duration);
    }

    /**
     * Draws the toast message on canvas
     */
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.box, this.pos.x, this.pos.y);
        ctx.fillStyle = this.color;

        if (typeof this.message === "number") {
            ctx.fillText(
                this.message.toString(),
                this.pos.x + this.box.width / 2,
                this.pos.y + this.box.height / 1.4
            );
        }
    }

    /**
     * Registers a callback to execute when animation finishes
     */
    onFinish(callback: () => void): void {
        this.onFinishFunc = callback;
    }

    /**
     * Updates animation state
     */
    update(): void {
        this.timer.update();

        if (this.timer.hasTimePeriodPassed()) {
            this.finished = true;
            this.onFinishFunc?.();
        }

        this.pos.y -= this.speed;
    }
}