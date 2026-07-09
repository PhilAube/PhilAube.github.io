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
	static AttributeWidth = 40; // Source image full size width
	static AttributeHeight = 42; // Source image full size height
	static ATTRIBUTESIZE = new Vector(this.AttributeWidth / this.Scale, this.AttributeHeight / this.Scale); // Vector wrapper
	static ICONSIZE = 27; // Each card icon sprite is 27x27px

	/** The different sizes a card can be rendered at. */
	static Size = {
		"Full": 1, // (419x611px full card template size) / 1.25 * 1
		"Medium": 0.75, // For card viewer (419x611) / 1.25 * 0.5
		"Small": 0.35 // For Duels (419x611) / 1.25 * 0.35
	}

	/** The various card frames along with their offset in the spritesheet. */
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
	
	/** The various attribute icons along with their offset in the spritesheet. */
	static Attributes = {
		SPELL: 0,
		TRAP: 1,
		EARTH: 2,
		WIND: 3,
		WATER: 4,
		FIRE: 5,
		DARK: 6,
		LIGHT: 7,
		DIVINE: 8
	}

	/** The various icons which can appear under the card name, along with their offset in the spritesheet. */
	static Icons = {
		Star: 0,
		Continuous: 1,
		Counter: 2,
		Equip: 3,
		Field: 4,
		QuickPlay: 5,
		Ritual: 6,
	}

    /**
     * @param {HTMLCanvasElement} canvas The game canvas.
     * @param {CanvasRenderingContext2D} ctx The rendering context of the game canvas.
     * @param {Image} spriteSheets The loaded card art sprite sheet.
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

		this.renderTemplate(card);

		// Art position relative to the card template.
		const xOffset = 44 * card.size;
		const yOffset = 104 * card.size;
		this.renderSprite(card.id, card.position.x + xOffset, card.position.y + yOffset, drawSize);

		this.renderAttribute(card);

		this.renderIcons(card);

		this.renderSet(card);

		this.renderPassword(card);

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
	 */
    renderTemplate(card) {
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
		const maxWidth = 230 * card.size;

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

	/**
	 * Draws the card's attribute icon in the top right corner.
	 * @param {Card} card The card to render.
	 */
    renderAttribute(card) {
		const attribute = CardRenderer.Attributes[card.attribute];

		// The grid position of the required attribute to render.
		let xOffset = CardRenderer.AttributeWidth * attribute;

		// Draw dimensions scaled to card size.
		let drawWidth = CardRenderer.ATTRIBUTESIZE.x * card.size;
		let drawHeight = CardRenderer.ATTRIBUTESIZE.y * card.size;

		// Position relative to the card template, scaled to card size.
		const x = 270 * card.size;
		const y = 29 * card.size;

		this.ctx.drawImage(
			this.spriteSheets[2],
			xOffset, 0,
			CardRenderer.AttributeWidth, CardRenderer.AttributeHeight,
			card.position.x + x, card.position.y + y,
			drawWidth, drawHeight
		)
    }

	/**
	 * Draws all icons below the card name (stars or spell/trap race).
	 * @param {Card} card The card whose icons must be rendered.
	 */
	renderIcons(card) {
		const Attributes = CardRenderer.Attributes;
		const attribute = Attributes[card.attribute];

		if (attribute === Attributes.SPELL || attribute === Attributes.TRAP) {
			this.renderSpellTrapCardRace(card);
		} else {
			this.renderLevel(card);
		}
	}

	/**
	 * Draws the [Spell/Trap Card] text under the card name, with race icon if applicable.
	 * @param {Card} card The spell/trap card whose race must be rendered.
	 */
	renderSpellTrapCardRace(card) {
		let gap = "";
		const textX = card.position.x + (295  * card.size);
		const textY = card.position.y + (89 * card.size);

		const iconX = 269 * card.size;
		const iconY = 74 * card.size;

		if (card.race !== null) { 
			gap = "   "; 

			// Position within the sprite sheet
			const xOffset = CardRenderer.Icons[card.race] * CardRenderer.ICONSIZE;
			// Spell/Trap race icons are scaled down by a factor of 1.5 and then by the card size.
			const scaledIconSize = (CardRenderer.ICONSIZE / 1.5) * card.size;
			
			this.ctx.drawImage(
				this.spriteSheets[3],
				xOffset, 0,
				CardRenderer.ICONSIZE, CardRenderer.ICONSIZE,
				card.position.x + iconX, card.position.y + iconY,
				scaledIconSize, scaledIconSize
			);
		}

		const text = `[ ${card.attribute} CARD ${gap}]`;
		
		this.ctx.textAlign = "right";
		this.ctx.font = `${THEMES.FontSizes.SpellTrap * card.size}px ${THEMES.Fonts.SpellTrap}`;
		this.ctx.fillStyle = THEMES.Colors.Black;
		this.ctx.fillText(text, textX, textY);
		this.ctx.textAlign = "center";
	}

	/**
	 * Draws the stars for a monster's level.
	 * @param {Card} card The monster card whose level must be rendered.
	 */
	renderLevel(card) {
		const xOffset = CardRenderer.Icons.Star * CardRenderer.ICONSIZE;
		const scaledIconSize = (CardRenderer.ICONSIZE / CardRenderer.Scale) * card.size;
		
		// Position for level stars (top right area of the card)
		const baseX = 275 * card.size;
		const baseY = 72 * card.size;
		const spacing = card.level === 12 
			? scaledIconSize // No gap between stars for LV12 monsters
			: scaledIconSize + 1 // Small gap between stars
		
		// Draw stars from right to left
		for (let i = 0; i < card.level; i++) {
			const x = baseX - (i * spacing);
			
			this.ctx.drawImage(
				this.spriteSheets[3],
				xOffset, 0,
				CardRenderer.ICONSIZE, CardRenderer.ICONSIZE,
				card.position.x + x, card.position.y + baseY,
				scaledIconSize, scaledIconSize
			);
		}
	}

	/**
	 * Renders the set id (E.G TSC-001) under the card art.
	 * @param {Card} card The card whose set ID must be rendered.
	 */
	renderSet(card) {
		const id = String(card.id).padStart(3,'0');
		const text = `TSC-${id}`;
		const x = card.position.x + (278 * card.size);
		const y = card.position.y + (367 * card.size);

		this.ctx.font = `${THEMES.FontSizes.Small * card.size}px ${THEMES.Fonts.SetNumber}`;
		this.ctx.fillStyle = THEMES.Colors.Black;
		this.ctx.fillText(text, x, y);
	}

	/**
	 * Draws the password/id in the bottom left corner of the card (if not null).
	 * @param {Card} card The card whose password/id must be rendered.
	 */
	renderPassword(card) {
		if (card.password !== null) {
			const x = card.position.x + (35 * card.size);
			const y = card.position.y + (476 * card.size);

			this.ctx.font = `${THEMES.FontSizes.Small * card.size}px ${THEMES.Fonts.Password}`;
			this.ctx.fillStyle = THEMES.Colors.Black;
			this.ctx.fillText(card.password, x, y);
		}
	}
}