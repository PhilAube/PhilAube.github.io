import { THEMES } from "../themes.js";
import CardRenderer from "./CardRenderer.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export const CANVAS_WIDTH = canvas.width;
export const CANVAS_HEIGHT = canvas.height;

/** Encapsulates rendering logic. */
export default class RenderSystem {
    /**
     * @param {Array} spriteSheetPaths The relative paths to the sprite sheets.
     */
    constructor(spriteSheetPaths) {
        this.assetsLoaded = 0;
        this.assetsTotal = spriteSheetPaths.length;
        this.ready = false;
        this.ctx = ctx;
        this.canvas = canvas;

        // Enlarged images look blurry if smoothing is enabled.
        // Should always remain disabled to retain the pixelated aesthetic.
        ctx.imageSmoothingEnabled = false;

        ctx.textAlign = "center";

        // Focus the canvas so that the player doesn't have to click on it.
        canvas.focus();

        this.spriteSheets = this.loadSpriteSheets(spriteSheetPaths);

        this.card = new CardRenderer(canvas, ctx, this.spriteSheets);
    }

    /**
     * Loads the sprite sheets and emits a ready signal when all assets are loaded.
     * @param {Array} paths Relative paths to the spritesheets.
     * @returns An array of images, which are loaded when this.ready is true.
     */
    loadSpriteSheets(paths) {
        let spriteSheets = [];

        paths.forEach((path, index) =>
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
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    /**
     * Sets the canvas to a specified background color.
     * @param {String} color The color to set the canvas to (hex values defined in themes.js).
     */
    background(color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    /**
     * Draws a horizontal line at a specified position and width.
     * @param {Number} x The x coordinate to begin the line at.
     * @param {Number} y The y coordinate to draw the line at.
     * @param {Number} width The length of the line in pixels.
     */
    line(x, y, width) {
        ctx.beginPath();

        ctx.strokeStyle = THEMES.Colors.White;
        ctx.lineWidth = 5;

        ctx.moveTo(x, y); // Move the virtual pen to starting (x, y)
        ctx.lineTo(x + width, y); // Draw a digital path to target (x, y)
        ctx.stroke();
    }

    /**
     * Draws large centered text at a specified height.
     * @param {String} text The text to display.
     * @param {Number} y The height or y coordinate where the text will display.
     * @param {String} color The color to draw the text, white by default.
     */
    headerText(text, y, color = THEMES.Colors.White) {
        ctx.fillStyle = color;
        ctx.font = `${THEMES.LargeFont}px ${THEMES.Font}`;
        ctx.fillText(text, CANVAS_WIDTH / 2, y, CANVAS_WIDTH);
    }

    /**
     * Draws regular (medium-sized) text at a specified position.
     * @param {String} text The text to display.
     * @param {Number} x The x coordinate to draw the text at.
     * @param {Number} y The y coordinate to draw the text at.
     */
    text(text, x, y) {
        ctx.font = `${THEMES.MediumFont}px ${THEMES.Font}`;
        ctx.fillStyle = THEMES.Colors.White;
        ctx.fillText(text, x, y);
    }

    /**
     * Measures the pixel size of the given text string.
     * @param {String} text The text to be measured.
     * @returns An object containing width and height properties of that string.
     */
    measureText(text, fontSize) {
        ctx.font = `${fontSize}px ${THEMES.Font}`;
        const m = this.ctx.measureText(text);
        return {
            width: m.width,
            height: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
        }
    }

    /**
     * Draws a box at specified position and dimensions, with border by default.
     * @param {Vector} position The x and y coordinates of the box to draw.
     * @param {Vector} dimensions The height and width of the box to draw.
     * @param {Boolean} border Whether a white border should be drawn around the box, true by default.
     */
    box(position, dimensions, border = true) {
        ctx.fillStyle = THEMES.Colors.Black;
        ctx.fillRect(position.x, position.y, dimensions.x, dimensions.y);

        if (border) {
            ctx.strokeStyle = THEMES.Colors.White;
            ctx.strokeRect(position.x, position.y, dimensions.x, dimensions.y);
        }
    }

    /**
     * Draws a rounded box at specified position and dimensions, without border by default.
     * @param {String} color The color of the fill inside the box.
     * @param {Vector} position The x and y coordinates of the box to draw.
     * @param {Vector} dimensions The height and width of the box to draw.
     * @param {Boolean} border Whether a white border should be drawn around the box.
     */
    roundedBox(color, position, dimensions, border) {
        const RADIUS = 5;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(position.x, position.y, dimensions.x, dimensions.y, RADIUS);
        ctx.fill();

        if (border) {
            ctx.fillStyle = THEMES.Colors.White;
            ctx.beginPath();
            ctx.roundRect(position.x, position.y, dimensions.x, dimensions.y, RADIUS);
            ctx.stroke();
        }
    }
}