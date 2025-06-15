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
class PreRenderer {
    createPreRenderCanvas(width, height) {
        const bufferCanvas = document.createElement('canvas');
        bufferCanvas.width = width + 2;
        bufferCanvas.height = height + 2;
        const ctx = bufferCanvas.getContext("2d");
        if (!ctx)
            throw new Error("Could not get canvas context");
        ctx.translate(1, 1);
        return ctx;
    }
    render(drawFunc, width, height, canvas = null) {
        let ctx;
        if (canvas) {
            ctx = canvas.getContext('2d');
            if (!ctx)
                throw new Error("Could not get canvas context");
        }
        else {
            ctx = this.createPreRenderCanvas(width, height);
        }
        drawFunc(ctx);
        return ctx.canvas;
    }
    renderAnimation(drawFuncsCollection, width, height) {
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
export var Graphics;
(function (Graphics) {
    Graphics.preRenderer = new PreRenderer();
    function init() {
        if (Settings.DEVELOPMENT_MODE) {
            Graphics.stats = new Stats();
            Graphics.stats.domElement.style.position = 'absolute';
            Graphics.stats.domElement.style.left = '0px';
            Graphics.stats.domElement.style.top = '0px';
            document.body.appendChild(Graphics.stats.domElement);
        }
        window.requestAnimationFrame = (() => {
            return (window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                    return 1;
                });
        })();
    }
    Graphics.init = init;
    function roundRect(ctx, x, y, w, h, r) {
        if (w < 2 * r)
            r = w / 2;
        if (h < 2 * r)
            r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        return ctx;
    }
    Graphics.roundRect = roundRect;
    function createCanvas(name) {
        const canvas = document.createElement('canvas');
        canvas.id = name;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = "absolute";
        canvas.style.left = "0px";
        canvas.style.top = "0px";
        document.body.appendChild(canvas);
        $('body').on('contextmenu', "#" + name, function (e) {
            e.preventDefault();
            return false;
        });
        return canvas;
    }
    Graphics.createCanvas = createCanvas;
})(Graphics || (Graphics = {}));
