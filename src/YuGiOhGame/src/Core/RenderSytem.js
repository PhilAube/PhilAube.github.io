import CardRenderer from "./CardRenderer.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export const CANVAS_WIDTH = canvas.width;
export const CANVAS_HEIGHT = canvas.height;

/** Encapsulates rendering logic. */
export default class RenderSystem {
    /**
     * @param {Array} spriteSheetPaths}
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

        this.card = new CardRenderer(canvas, ctx, this.spriteSheets[0]);
    }

    /** Loads the sprite sheets and emits a ready signal when all assets are loaded. */
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

    /** Sets the canvas to a specified background color. */
    background(color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    /** Draws a horizontal line at a specified width and x,y position */
    line(x, y, width) {
        ctx.beginPath();

        // 3. Configure the stroke styles (Optional)
        ctx.strokeStyle = "white"; // Sets line color to red
        ctx.lineWidth = 5;           // Sets line thickness to 5 pixels

        // 4. Define the line geometry
        ctx.moveTo(x, y);          // Move the virtual pen to starting (x, y)
        ctx.lineTo(x + width, y);        // Draw a digital path to target (x, y)
        ctx.stroke();
    }

    /** Draws large centered text at a specified y position, in white by default. */
    headerText(text, y, color = "white") {
        ctx.fillStyle = color;
        ctx.font = "30px Times New Roman";
        ctx.fillText(text, CANVAS_WIDTH / 2, y, CANVAS_WIDTH);
    }

    /** Draws a menu option at its specified position. */
    menuOption(menuOption, xOffset = 0, yOffset = 0) {
        ctx.fillStyle = "white";
        ctx.font = "20px Times New Roman";
        let x = menuOption.position.x + xOffset;
        let y = menuOption.position.y + yOffset;
        ctx.fillText(menuOption.id, x, y, CANVAS_WIDTH);
    }

    /** Draws a box at specified position and dimensions, with border by default. */
    box(position, dimensions, border = true) {
        ctx.fillStyle = "#1F1F1F";
        ctx.fillRect(position.x, position.y, dimensions.x, dimensions.y);

        if (border) {
            ctx.strokeStyle = "#FAFAFA";
            ctx.strokeRect(position.x, position.y, dimensions.x, dimensions.y);
        }
    }
}