/** Encapsulates card-specific rendering methods. */
export default class CardRenderer {

    /**
     * @param {HTMLCanvasElement} canvas The game canvas.
     * @param {CanvasRenderingContext2D} ctx The rendering context of the game canvas.
     * @param {Image} spriteSheet The loaded card art sprite sheet.
     */
    constructor(canvas, ctx, spriteSheet) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.spriteSheet = spriteSheet;
    }

    /**
     * Draws a sprite from a 30x30 grid of 100x100 sprites.
     * @param {Card} card The card whose art should be drawn.
     * @param {Number} x The x offset where the sprite will be drawn.
     * @param {Number} y The y offset where the sprite will be drawn.
     * @param {Number} size Size in pixels in case scaling is required. Default is 100.
     */
    renderSprite(card, x, y, size = 100) {
    const index = card.id - 1; // convert to 0-based
    const cols = 30; // 30x30 grid of 900 cards
    const spriteSrcSize = 100; // Each sprite is 100x100px

    const sx = (index % cols) * spriteSrcSize;
    const sy = Math.floor(index / cols) * spriteSrcSize;

    this.ctx.drawImage(
      this.spriteSheet,
      sx, sy,
      spriteSrcSize, spriteSrcSize,
      x, y,
      size, size
    );
  }
}