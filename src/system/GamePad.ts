/**
 * GamePad.ts
 *
 * Handles gamepad input using the Gamepad API.
 * Also includes touch controls (TwinStickControls) for mobile devices.
 */

export class GamePad {
    isConnected = false;
    pad: any;
    padNumber = 0;

    static numPads = 0;

    connect(): boolean {
        try {
            navigator.getGamepads();
        } catch (e) {
            return false;
        }

        const gamepadSupportAvailable =
            !!(navigator as any).getGamepads ||
            !!(navigator as any).gamepads ||
            (navigator as any).gamepads[0] !== undefined;

        if (gamepadSupportAvailable && !this.isConnected) {
            const pads = (navigator as any).getGamepads();

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

    update(): void {
        if (this.isConnected) {
            this.pad = (navigator as any).getGamepads()[this.padNumber];
        }
    }

    isButtonPressed(buttonId: number): boolean {
        return this.isConnected && this.pad?.buttons?.[buttonId] === 1;
    }

    getAxis(axisId: number): number | false {
        if (this.isConnected && typeof this.pad.axes[axisId] !== "undefined") {
            return this.pad.axes[axisId];
        }
        return false;
    }
}

// Stick logic as a class instead of prototype-based object
export class Stick {
    active: boolean;
    atLimit = false;
    length = 1;
    maxLength: number;
    limit = { x: 0, y: 0 };
    input = { x: 0, y: 0 };

    constructor(maxLength: number, active = false) {
        this.maxLength = maxLength;
        this.active = active;
    }

    getRadians(x: number, y: number): number {
        return Math.atan2(x, -y);
    }

    getVectorFromRadians(radians: number, length: number): { x: number; y: number } {
        length = Number(length) || 1;
        return {
            x: Math.sin(radians) * length,
            y: -Math.cos(radians) * length,
        };
    }

    getVectorLength(v: { x: number; y: number }): number {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    getVectorNormal(v: { x: number; y: number }): { x: number; y: number } {
        const len = this.getVectorLength(v);
        return len === 0 ? v : { x: v.x * (1 / len), y: v.y * (1 / len) };
    }

    subtractVectors(
        v1: { x: number; y: number },
        v2: { x: number; y: number }
    ): { x: number; y: number } {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y,
        };
    }

    setLimitXY(x: number, y: number): void {
        this.limit = { x, y };
    }

    setInputXY(x: number, y: number): void {
        this.input = { x, y };
    }

    update(): void {
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
        } else {
            this.atLimit = false;
        }

        this.length = length;
    }
}

export class TwinStickControls {
    sticks: Stick[];
    limitSize = 64;
    inputSize = 36;

    constructor(private canvas: HTMLCanvasElement) {
        this.sticks = [new Stick(this.inputSize)];

        const _this = this;

        canvas.addEventListener("touchstart", function (e: TouchEvent) {
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

        document.addEventListener("touchmove", function (e: TouchEvent) {
            e.preventDefault();
            for (let i = 0; i < e.touches.length; ++i) {
                const stick = _this.sticks[i];
                const touch = e.touches[i];

                if (stick) {
                    stick.setInputXY(touch.pageX, touch.pageY);
                }
            }
        });

        document.addEventListener("touchend", function (e: TouchEvent) {
            const touches = e.changedTouches;
            for (let i = 0; i < touches.length; ++i) {
                const stick = _this.sticks[i];
                if (stick) {
                    stick.active = false;
                }
            }
        });
    }

    update(): void {
        for (const stick of this.sticks) {
            stick.update();
        }
    }

    getNormal(stickId: number): { x: number; y: number } {
        const stick = this.sticks[stickId];
        if (stick?.active && stick.length > 30) {
            return stick.normal;
        }
        return { x: 0, y: 0 };
    }

    draw(context: CanvasRenderingContext2D): void {
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
                } catch (e) {
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

// Stub for AssetManager until implemented
declare global {
    var AssetManager: any;
}