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
/**
 * Toast message that displays floating text/icons (e.g., health reduction, notifications)
 */
export class ToastMessage {
    /**
     * Pre-renders a health box for numerical messages
     */
    preRenderNumberBox() {
        const width = 39;
        const height = 18;
        return Graphics.preRenderer.render((ctx) => {
            ctx.fillStyle = "#1A1110";
            ctx.strokeStyle = "#EEE";
            Graphics.roundRect(ctx, 0, 0, width, height, 4).fill();
            Graphics.roundRect(ctx, 0, 0, width, height, 4).stroke();
        }, width, height);
    }
    /**
     * Pre-renders a message box for textual content
     */
    preRenderMessageBox() {
        const width = (this.message.toString().length + 1) * 10; // Add padding
        const height = 20;
        return Graphics.preRenderer.render((ctx) => {
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
    constructor(position, message, color, duration = 2700, speed = 0.7) {
        this.finished = false;
        this.pos = { x: position.x, y: position.y };
        this.message = message;
        this.color = color;
        this.speed = speed;
        // Choose appropriate rendering style
        if (Utils.isNumber(message)) {
            this.message = Math.floor(Number(message));
            this.box = this.preRenderNumberBox();
        }
        else {
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
    draw(ctx) {
        ctx.drawImage(this.box, this.pos.x, this.pos.y);
        ctx.fillStyle = this.color;
        if (typeof this.message === "number") {
            ctx.fillText(this.message.toString(), this.pos.x + this.box.width / 2, this.pos.y + this.box.height / 1.4);
        }
    }
    /**
     * Registers a callback to execute when animation finishes
     */
    onFinish(callback) {
        this.onFinishFunc = callback;
    }
    /**
     * Updates animation state
     */
    update() {
        var _a;
        this.timer.update();
        if (this.timer.hasTimePeriodPassed()) {
            this.finished = true;
            (_a = this.onFinishFunc) === null || _a === void 0 ? void 0 : _a.call(this);
        }
        this.pos.y -= this.speed;
    }
}
