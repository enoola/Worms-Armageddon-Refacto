/**
 * Graphics.js
 * Graphics namespace provides helper functions for creating a canvas 
 * it also setup the request animation frame shim and the stats.js fps counter
 * 
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
 *  url: http://www.ciaranmccann.me/
 */

//import { Stats } from 'stats.js'
import { Stats } from 'stats.js';
import { Settings } from '../Settings';
// Stats is a global variable; you may need to install/import it separately
declare var stats: any;
// jQuery
declare var $: any;

class PreRenderer {
    private createPreRenderCanvas(width: number, height: number): CanvasRenderingContext2D {
        const bufferCanvas = document.createElement('canvas');
        bufferCanvas.width = width + 2;
        bufferCanvas.height = height + 2;
        const ctx = bufferCanvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");
        ctx.translate(1, 1);
        return ctx;
    }

    public render(
        drawFunc: (ctx: CanvasRenderingContext2D) => void,
        width: number,
        height: number,
        canvas: HTMLCanvasElement | null = null
    ): HTMLCanvasElement {
        let ctx: CanvasRenderingContext2D;

        if (canvas) {
            ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Could not get canvas context");
        } else {
            ctx = this.createPreRenderCanvas(width, height);
        }

        drawFunc(ctx);
        return ctx.canvas;
    }

    public renderAnimation(
        drawFuncsCollection: ((ctx: CanvasRenderingContext2D) => void)[],
        width: number,
        height: number
    ): HTMLCanvasElement {
        const ctx = this.createPreRenderCanvas(width, height * drawFuncsCollection.length);

        for (const drawFunc of drawFuncsCollection) {
            drawFunc.call(ctx, ctx);
            ctx.translate(0, height);
        }

        // Reset translation after rendering
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        return ctx.canvas;
    }
}

// === Graphics Module - Converted to ES6-style exports ===
export namespace Graphics {
    export let stats: any;
    export const preRenderer = new PreRenderer();

    export function init(): void {
        if (Settings.DEVELOPMENT_MODE) {
            stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';
            document.body.appendChild(stats.domElement);
        }

        window.requestAnimationFrame = (() => {
            return (
                window.requestAnimationFrame ||
                (window as any).webkitRequestAnimationFrame ||
                (window as any).mozRequestAnimationFrame ||
                (window as any).oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback: FrameRequestCallback): number {
                    window.setTimeout(callback, 1000 / 60);
                    return 1;
                }
            );
        })();
    }

    export function roundRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        r: number
    ): CanvasRenderingContext2D {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        return ctx;
    }

    export function createCanvas(name: string): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.id = name;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = "absolute";
        canvas.style.left = "0px";
        canvas.style.top = "0px";
        document.body.appendChild(canvas);

        $('body').on('contextmenu', "#" + name, function (e: Event) {
            e.preventDefault();
            return false;
        });

        return canvas;
    }
}