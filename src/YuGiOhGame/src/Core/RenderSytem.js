import CardRenderer from "./CardRenderer.js";
import { spriteSheetPaths, CANVAS_WIDTH, CANVAS_HEIGHT } from "../globals.js";

/** Encapsulates rendering logic. */
export default class RenderSystem {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} ctx
     */
    constructor(canvas, ctx) {
        this.assetsLoaded = 0;
        this.assetsTotal = spriteSheetPaths.length;
        this.ready = false;
        this.canvas = canvas;
        this.ctx = ctx;

        // Enlarged images look blurry if smoothing is enabled.
        // Should always remain disabled to retain the pixelated aesthetic.
        ctx.imageSmoothingEnabled = false;

        ctx.textAlign = "center";

        // Focus the canvas so that the player doesn't have to click on it.
        canvas.focus();

        this.spriteSheets = this.loadSpriteSheets();

        this.card = new CardRenderer(canvas, ctx, this.spriteSheets[0]);
    }

    /** Loads the sprite sheets and emits a ready signal when all assets are loaded. */
    loadSpriteSheets() {
        let spriteSheets = [];

        spriteSheetPaths.forEach((path, index) =>
        {
            const img = new Image();

            // Update load progress and report ready once all assets loaded
            img.onload = () => {
                this.assetsLoaded++;
                this.ready = (this.assetsLoaded === this.assetsTotal);
            }

            img.src = path;
            spriteSheets[index] = img;
        });
        
        return spriteSheets;
    }

    /** Clears the canvas. */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /** Sets the canvas to a specified background color. */
    background(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    /** Draws large centered text at a specified y position, in white by default. */
    headerText(text, y, color = "white") {
        this.ctx.fillStyle = color;
        this.ctx.font = "30px Times New Roman";
        this.ctx.fillText(text, CANVAS_WIDTH / 2, y, CANVAS_WIDTH);
    }
}