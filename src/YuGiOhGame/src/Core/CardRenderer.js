import { THEMES } from "../themes.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./RenderSytem.js";
import Vector from "./Vector.js";

/** Encapsulates card-specific rendering methods. */
export default class CardRenderer {
	static TemplateWidth = 419; // Source image full size width
	static TemplateHeight = 611; // Source image full size height
	static Scale = 1.25; // Scales source width/height so that a full card fits a 500x500 canvas with no cutoff.
	static CARDSIZE = new Vector(this.TemplateWidth / this.Scale, this.TemplateHeight / this.Scale); // Vector wrapper
	static SPRITESIZE = 100; // Each card art sprite is 100x100px
	
	/** The different sizes a card can be rendered at. */
	static Size = {
		"Full": 1, // (419x611px full card template size) / 1.25 * 1
		"Medium": 0.75, // For card viewer (419x611) / 1.25 * 0.5
		"Small": 0.35 // For Duels (419x611) / 1.25 * 0.35
	}

	/** The various card frames along their offset in the spritesheet. */
	static Templates = {
		Normal: 0,
		Effect: 1,
		Fusion: 2,
		Ritual: 3,
		Trap: 4,
		Spell: 5,
		Slifer: 6,
		Ra: 7,
		Obelisk: 8
	}

    /**
     * @param {HTMLCanvasElement} canvas The game canvas.
     * @param {CanvasRenderingContext2D} ctx The rendering context of the game canvas.
     * @param {Image} spriteSheet The loaded card art sprite sheet.
     */
    constructor(canvas, ctx, spriteSheets) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.spriteSheets = spriteSheets;
    }

	/**
	 * Draws a full card positioned and scaled based on its properties.
	 * @param {Card} card The card to display.
	 */
	render(card) {
		// Size of the sprite in px when CardRenderer.Size.Full.
		const SPRITESIZE = 247;
		// Scales the sprite size based on the CardRenderer.Size.
		const drawSize = SPRITESIZE * card.size;

		this.renderTemplate(card, card.size);

		// Art position relative to the card template.
		const xOffset = 44 * card.size;
		const yOffset = 104 * card.size;
		this.renderSprite(card.id, card.position.x + xOffset, card.position.y + yOffset, drawSize);

		this.renderCardText(card);
	}

    /**
     * Draws a card sprite from a 30x30 grid of 100x100 sprites.
     * @param {Card} card The card whose art should be drawn.
     * @param {Number} x The x offset where the sprite will be drawn.
     * @param {Number} y The y offset where the sprite will be drawn.
     * @param {Number} size Size in pixels in case scaling is required. Default is 100.
     */
    renderSprite(id, x, y, size = CardRenderer.SPRITESIZE) {
		const sprite = this.getSpriteFromGrid(id);

		this.ctx.drawImage(
			sprite,
			0, 0,
			CardRenderer.SPRITESIZE, CardRenderer.SPRITESIZE,
			x, y,
			size, size
		);
    }

	/**
	 * Draws the surrounding card template.
	 * @param {Card} card The card to render.
	 * @param {Number} size The CardRenderer.Size for scaling.
	 */
    renderTemplate(card, size) {
		const frameType = CardRenderer.Templates[card.type];

		// The grid position of the required frame to render.
		let xOffset = CardRenderer.TemplateWidth * frameType;

		this.ctx.drawImage(
			this.spriteSheets[1],
			xOffset, 0,
			CardRenderer.TemplateWidth, CardRenderer.TemplateHeight,
			card.position.x, card.position.y,
			card.dimensions.x, card.dimensions.y
		)
    }

	/**
	 * Gets the sprite of a given card from the sprite sheet grid.
	 * @param {Number} id The id of the card whose sprite must be fetched.
	 * @returns The 100x100 sprite associated with the ID.
	 */
	getSpriteFromGrid(id) {
		const index = id - 1; // convert to 0-based
		const cols = 30; // 30x30 grid of 900 cards

		// The X and Y coordinates on the spritesheet grid.
		const sx = (index % cols) * CardRenderer.SPRITESIZE;
		const sy = Math.floor(index / cols) * CardRenderer.SPRITESIZE;

		// Fix for scaling artifact showing pixels from neighboring grid items:
		// The sprite is first copied from the atlas to a temp buffer.
		const tempCanvas = document.createElement("canvas");
		tempCanvas.width = CardRenderer.SPRITESIZE;
		tempCanvas.height = CardRenderer.SPRITESIZE;

		// The temp buffer samples the 100x100 source instead of the whole spritesheet.
		const tempCtx = tempCanvas.getContext("2d");
		tempCtx.imageSmoothingEnabled = false;
		tempCtx.drawImage(
			this.spriteSheets[0],
			sx, sy,
			CardRenderer.SPRITESIZE, CardRenderer.SPRITESIZE,
			0, 0,
			CardRenderer.SPRITESIZE, CardRenderer.SPRITESIZE
		);

		// This 100x100 source sample can be scaled to any size without any artifacts.
		// Prevents scaled card art from showing pixels from surrounding rows or columns.
		return tempCanvas;
	}

	/**
	 * Draws all of the text on a card.
	 * @param {Card} card The card whose text must be rendered.
	 */
	renderCardText(card) {
		this.renderName(card);
	}

	/**
	 * Draws the name of a card with the color based on its rarity or type.
	 * @param {Card} card The card whose name must be rendered.
	 */
	renderName(card) {
		const Templates = CardRenderer.Templates;
		const TemplateNames = Object.keys(CardRenderer.Templates);
		const name = String(card.name).replaceAll('"', '');

		switch (card.rarity) {
			case "ultra":
				this.ctx.fillStyle = this.getUltraRareGradient();
				break;
			case "secret":
				this.ctx.fillStyle = this.getSecretRareGradient();
				break;
			default:
				switch (card.type) {
					case TemplateNames[Templates.Trap]:
					case TemplateNames[Templates.Spell]:
						this.ctx.fillStyle = THEMES.Colors.White;
						break;
					default:
						this.ctx.fillStyle = THEMES.Colors.Black;
						break;
				}
		}

		// Scale the text dimensions and position by the card size
		const x = (36 * card.size) + card.position.x;
		const y = (56 * card.size) + card.position.y;
		const maxWidth = 240 * card.size;

		this.ctx.font = `${THEMES.FontSizes.CardName * card.size}px ${THEMES.Fonts.CardName}`;
		this.ctx.textAlign = "left";
		this.ctx.fillText(name, x, y, maxWidth);
		this.ctx.textAlign = "center";
	}

	/**
	 * Gets the gradient colors for the ultra rare card name text.
	 * @returns A gradient that can be used as a fillStyle.
	 */
	getUltraRareGradient() {
		const gradient = this.ctx.createLinearGradient(0, 0, 1000, 0);

		for (const [stop, colorName] of THEMES.Gradients.UltraRare) {
			gradient.addColorStop(stop, THEMES.Colors[colorName]);
		}

		return gradient;
	}

	/**
	 * Gets the gradient colors for the secret rare card name text.
	 * @returns A gradient that can be used as a fillStyle.
	 */
	getSecretRareGradient() {
		const gradient = this.ctx.createLinearGradient(0, 0, 50, 250);

		for (const [stop, colorName] of THEMES.Gradients.SecretRare) {
			gradient.addColorStop(stop, THEMES.Colors[colorName]);
		}

		return gradient;
	}
}