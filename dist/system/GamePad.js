/**
 * GamePad.ts
 *
 * Handles gamepad input using the Gamepad API.
 * Also includes touch controls (TwinStickControls) for mobile devices.
 */
import { AssetManager } from "./AssetManager";
export class GamePad {
    constructor() {
        this.isConnected = false;
        this.padNumber = 0;
    }
    connect() {
        try {
            navigator.getGamepads();
        }
        catch (e) {
            return false;
        }
        const gamepadSupportAvailable = !!navigator.getGamepads ||
            !!navigator.gamepads ||
            navigator.gamepads[0] !== undefined;
        if (gamepadSupportAvailable && !this.isConnected) {
            const pads = navigator.getGamepads();
            if (pads[GamePad.numPads] !== undefined) {
                this.padNumber = GamePad.numPads;
                this.pad = pads[GamePad.numPads];
                this.isConnected = true;
                GamePad.numPads++;
                return true;
            }
        }
        return false;
    }
    update() {
        if (this.isConnected) {
            this.pad = navigator.getGamepads()[this.padNumber];
        }
    }
    isButtonPressed(buttonId) {
        var _a, _b;
        return this.isConnected && ((_b = (_a = this.pad) === null || _a === void 0 ? void 0 : _a.buttons) === null || _b === void 0 ? void 0 : _b[buttonId]) === 1;
    }
    getAxis(axisId) {
        if (this.isConnected && typeof this.pad.axes[axisId] !== "undefined") {
            return this.pad.axes[axisId];
        }
        return false;
    }
}
//normal: b2Vector
GamePad.numPads = 0;
// Stick logic as a class instead of prototype-based object
export class Stick {
    constructor(maxLength, active = false) {
        this.atLimit = false;
        this.length = 1;
        this.limit = { x: 0, y: 0 };
        this.input = { x: 0, y: 0 };
        this.normal = { x: 0, y: 0 };
        this.maxLength = maxLength;
        this.active = active;
    }
    getRadians(x, y) {
        return Math.atan2(x, -y);
    }
    getVectorFromRadians(radians, length) {
        length = Number(length) || 1;
        return {
            x: Math.sin(radians) * length,
            y: -Math.cos(radians) * length,
        };
    }
    getVectorLength(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
    getVectorNormal(v) {
        const len = this.getVectorLength(v);
        return len === 0 ? v : { x: v.x * (1 / len), y: v.y * (1 / len) };
    }
    subtractVectors(v1, v2) {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y,
        };
    }
    setLimitXY(x, y) {
        this.limit = { x, y };
    }
    setInputXY(x, y) {
        this.input = { x, y };
    }
    update() {
        const diff = this.subtractVectors(this.input, this.limit);
        let length = this.getVectorLength(diff);
        if (length >= this.maxLength) {
            length = this.maxLength;
            const rads = this.getRadians(diff.x, diff.y);
            const limited = this.getVectorFromRadians(rads, length);
            this.input = {
                x: limited.x + this.limit.x,
                y: limited.y + this.limit.y,
            };
            this.atLimit = true;
        }
        else {
            this.atLimit = false;
        }
        this.length = length;
        this.normal = this.getVectorNormal(diff);
    }
}
export class TwinStickControls {
    constructor(canvas) {
        this.canvas = canvas;
        this.limitSize = 64;
        this.inputSize = 36;
        this.sticks = [new Stick(this.inputSize)];
        const _this = this;
        canvas.addEventListener("touchstart", function (e) {
            e.preventDefault();
            for (let i = 0; i < e.touches.length; ++i) {
                const stick = _this.sticks[i];
                const touch = e.touches[i];
                if (stick) {
                    stick.setLimitXY(touch.pageX, touch.pageY);
                    stick.setInputXY(touch.pageX, touch.pageY);
                    stick.active = true;
                }
            }
        });
        document.addEventListener("touchmove", function (e) {
            e.preventDefault();
            for (let i = 0; i < e.touches.length; ++i) {
                const stick = _this.sticks[i];
                const touch = e.touches[i];
                if (stick) {
                    stick.setInputXY(touch.pageX, touch.pageY);
                }
            }
        });
        document.addEventListener("touchend", function (e) {
            const touches = e.changedTouches;
            for (let i = 0; i < touches.length; ++i) {
                const stick = _this.sticks[i];
                if (stick) {
                    stick.active = false;
                }
            }
        });
    }
    update() {
        for (const stick of this.sticks) {
            stick.update();
        }
    }
    /**
     *
     * @param stickId
     * @infos the Stick class currently uses this.normal as a property that is set during update(). However, in your modernized version (or if you followed the refactor we did earlier), the .normal property may not be persisted , \
        and instead should be calculated on the fly using: this.getVectorNormal(diff)
     * @returns
     */
    getNormal(stickId) {
        const stick = this.sticks[stickId];
        const diff = stick.subtractVectors(stick.input, stick.limit);
        if ((stick === null || stick === void 0 ? void 0 : stick.active) && stick.length > 30) {
            return stick.getVectorNormal(diff);
        }
        return { x: 0, y: 0 };
    }
    draw(context) {
        for (const stick of this.sticks) {
            if (stick.active) {
                context.save();
                // Draw circle around stick
                context.beginPath();
                context.arc(stick.limit.x, stick.limit.y, this.limitSize, 0, Math.PI * 2, true);
                context.lineWidth = 3;
                context.strokeStyle = stick.atLimit ? "#08c" : "rgb(0, 0, 0)";
                context.stroke();
                // Base circle
                context.beginPath();
                context.arc(stick.limit.x, stick.limit.y, this.limitSize / 2, 0, Math.PI * 2, true);
                context.lineWidth = 2;
                context.strokeStyle = "rgb(200, 200, 200)";
                context.stroke();
                // Joystick image or fallback
                try {
                    const img = AssetManager.getImage("stick");
                    context.drawImage(img, stick.input.x - this.inputSize, stick.input.y - this.inputSize, this.inputSize * 2, this.inputSize * 2);
                }
                catch (e) {
                    context.beginPath();
                    context.arc(stick.input.x, stick.input.y, this.inputSize, 0, Math.PI * 2, true);
                    context.fillStyle = "rgba(0, 0, 255, 0.5)";
                    context.fill();
                }
                context.restore();
            }
        }
    }
}
