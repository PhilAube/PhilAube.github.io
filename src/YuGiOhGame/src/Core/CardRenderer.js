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
	 * @param {RenderSystem} The parent render system of this card renderer.
     */
    constructor(canvas, ctx, spriteSheets, renderSystem) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.spriteSheets = spriteSheets;
        this.renderSystem = renderSystem;
    }

	/**
	 * Draws a full card positioned and scaled based on its properties.
	 * @param {Card} card The card to display.
	 */
	render(card) {
		// First draw to temporary canvas.
		if (card.cachedImage === null) {
			const tempCanvas = document.createElement("canvas");
			tempCanvas.width = CardRenderer.CARDSIZE.x;
			tempCanvas.height = CardRenderer.CARDSIZE.y;
			const tempCtx = tempCanvas.getContext("2d");
			tempCtx.imageSmoothingEnabled = false;
			tempCtx.textAlign = "center";

			// Size of the art sprite in px.
			const SPRITESIZE = 247;

			this.renderTemplate(card, tempCtx);

			// Art position relative to the card template.
			const xOffset = 44;
			const yOffset = 104;
			this.renderSprite(card.id, xOffset, yOffset, SPRITESIZE, tempCtx);

			this.renderAttribute(card, tempCtx);

			this.renderIcons(card, tempCtx);

			this.renderSet(card, tempCtx);

			this.renderPassword(card, tempCtx);

			this.renderName(card, tempCtx);

			this.renderAtkDef(card, tempCtx);

			this.renderMonsterType(card, tempCtx);

			this.renderTextBox(card, tempCtx);

			card.cachedImage = tempCanvas;
		}
		
		// Draws cached image
		this.ctx.drawImage(
			card.cachedImage, 
			0, 0, 
			CardRenderer.CARDSIZE.x, CardRenderer.CARDSIZE.y,
			card.position.x, card.position.y,
			card.dimensions.x, card.dimensions.y
		);
	}

    /**
     * Draws a card sprite from a 30x30 grid of 100x100 sprites.
     * @param {Card} card The card whose art should be drawn.
     * @param {Number} x The x offset where the sprite will be drawn.
     * @param {Number} y The y offset where the sprite will be drawn.
     * @param {Number} size Size in pixels in case scaling is required. Default is 100.
	 * @param {CanvasRenderingContext2D} The optional temporary canvas context to render to.
     */
    renderSprite(id, x, y, size = CardRenderer.SPRITESIZE, ctx = this.ctx) {
		const sprite = this.getSpriteFromGrid(id);

		ctx.drawImage(
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
	 * @param {CanvasRenderingContext2D} The temporary canvas context to render to.
	 */
    renderTemplate(card, ctx) {
		const frameType = CardRenderer.Templates[card.type];

		// The grid position of the required frame to render.
		let xOffset = CardRenderer.TemplateWidth * frameType;

		ctx.drawImage(
			this.spriteSheets[1],
			xOffset, 0,
			CardRenderer.TemplateWidth, CardRenderer.TemplateHeight,
			0, 0,
			CardRenderer.CARDSIZE.x, CardRenderer.CARDSIZE.y
		);
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
	 * Draws the name of a card with the color based on its rarity or type.
	 * @param {Card} card The card whose name must be rendered.
	 * @param {CanvasRenderingContext2D} The temporary canvas context to render to.
	 */
	renderName(card, ctx) {
		const Templates = CardRenderer.Templates;
		const TemplateNames = Object.keys(CardRenderer.Templates);
		const name = String(card.name).replaceAll('"', '');

		switch (card.rarity) {
			case "ultra":
				ctx.fillStyle = this.getUltraRareGradient();
				break;
			case "secret":
				ctx.fillStyle = this.getSecretRareGradient();
				break;
			default:
				switch (card.type) {
					case TemplateNames[Templates.Trap]:
					case TemplateNames[Templates.Spell]:
						ctx.fillStyle = THEMES.Colors.White;
						break;
					default:
						ctx.fillStyle = THEMES.Colors.Black;
						break;
				}
		}

		// The position and maximum vertical size of the text.
		const x = 36;
		const y = 56;
		const maxWidth = 230;

		ctx.font = `${THEMES.FontSizes.CardName}px ${THEMES.Fonts.CardName}`;
		ctx.textAlign = "left";
		ctx.fillText(name, x, y, maxWidth);
		ctx.textAlign = "center";
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
	 * @param {CanvasRenderingContext2D} The temporary canvas context to render to.
	 */
    renderAttribute(card, ctx) {
		const attribute = CardRenderer.Attributes[card.attribute];

		// The grid position of the required attribute to render.
		let xOffset = CardRenderer.AttributeWidth * attribute;

		// Draw dimensions.
		let drawWidth = CardRenderer.ATTRIBUTESIZE.x;
		let drawHeight = CardRenderer.ATTRIBUTESIZE.y;

		// Position relative to the card template.
		const x = 270;
		const y = 29;

		ctx.drawImage(
			this.spriteSheets[2],
			xOffset, 0,
			CardRenderer.AttributeWidth, CardRenderer.AttributeHeight,
			x, y,
			drawWidth, drawHeight
		)
    }

	/**
	 * Draws all icons below the card name (stars or spell/trap race).
	 * @param {Card} card The card whose icons must be rendered.
	 * @param {CanvasRenderingContext2D} The temporary canvas context to render to.
	 */
	renderIcons(card, ctx) {
		const Attributes = CardRenderer.Attributes;
		const attribute = Attributes[card.attribute];

		if (attribute === Attributes.SPELL || attribute === Attributes.TRAP) {
			this.renderSpellTrapCardRace(card, ctx);
		} else {
			this.renderLevel(card, ctx);
		}
	}

	/**
	 * Draws the [Spell/Trap Card] text under the card name, with race icon if applicable.
	 * @param {Card} card The spell/trap card whose race must be rendered.
	 * @param {CanvasRenderingContext2D} The temporary canvas context to render to.
	 */
	renderSpellTrapCardRace(card, ctx) {
		let gap = "";
		const textX = 295;
		const textY = 89;

		const iconX = 269;
		const iconY = 74;

		if (card.race !== null) { 
			gap = "   "; 

			// Position within the sprite sheet
			const xOffset = CardRenderer.Icons[card.race] * CardRenderer.ICONSIZE;
			// Spell/Trap race icons are scaled down by a factor of 1.5.
			const scaledIconSize = (CardRenderer.ICONSIZE / 1.5);
			
			ctx.drawImage(
				this.spriteSheets[3],
				xOffset, 0,
				CardRenderer.ICONSIZE, CardRenderer.ICONSIZE,
				iconX, iconY,
				scaledIconSize, scaledIconSize
			);
		}

		const text = `[ ${card.attribute} CARD ${gap}]`;
		
		ctx.textAlign = "right";
		ctx.font = `${THEMES.FontSizes.SpellTrap}px ${THEMES.Fonts.SpellTrap}`;
		ctx.fillStyle = THEMES.Colors.Black;
		ctx.fillText(text, textX, textY);
		ctx.textAlign = "center";
	}

	/**
	 * Draws the stars for a monster's level.
	 * @param {Card} card The monster card whose level must be rendered.
	 * @param {CanvasRenderingContext2D} The temporary canvas context to render to.
	 */
	renderLevel(card, ctx) {
		const xOffset = CardRenderer.Icons.Star * CardRenderer.ICONSIZE;
		const scaledIconSize = (CardRenderer.ICONSIZE / CardRenderer.Scale);
		
		// Position for level stars (top right area of the card)
		const baseX = 275;
		const baseY = 72;
		const spacing = card.level === 12 
			? scaledIconSize // No gap between stars for LV12 monsters
			: scaledIconSize + 1 // Small gap between stars
		
		// Draw stars from right to left
		for (let i = 0; i < card.level; i++) {
			const x = baseX - (i * spacing);
			
			ctx.drawImage(
				this.spriteSheets[3],
				xOffset, 0,
				CardRenderer.ICONSIZE, CardRenderer.ICONSIZE,
				x, baseY,
				scaledIconSize, scaledIconSize
			);
		}
	}

	/**
	 * Renders the set id (E.G TSC-001) under the card art.
	 * @param {Card} card The card whose set ID must be rendered.
	 * @param {CanvasRenderingContext2D} The temporary canvas context to render to.
	 */
	renderSet(card, ctx) {
		const id = String(card.id).padStart(3,'0');
		const text = `TSC-${id}`;
		const x = 278;
		const y = 367;

		ctx.font = `${THEMES.FontSizes.Small}px ${THEMES.Fonts.SetNumber}`;
		ctx.fillStyle = THEMES.Colors.Black;
		ctx.fillText(text, x, y);
	}

	/**
	 * Draws the password/id in the bottom left corner of the card (if not null).
	 * @param {Card} card The card whose password/id must be rendered.
	 * @param {CanvasRenderingContext2D} The temporary canvas context to render to.
	 */
	renderPassword(card, ctx) {
		if (card.password !== null) {
			const x = 35;
			const y = 476;

			ctx.font = `${THEMES.FontSizes.Small}px ${THEMES.Fonts.Password}`;
			ctx.fillStyle = THEMES.Colors.Black;
			ctx.fillText(card.password, x, y);
		}
	}

	/**
	 * Draws the attack and defense points of a monster card.
	 * @param {Card} card The monster card whose ATK/DEF must be rendered.
	 * @param {CanvasRenderingContext2D} The temporary canvas context to render to.
	 */
	renderAtkDef(card, ctx) {
		if (card.atk !== null && card.def !== null) {
			const atkX = 237;
			const defX = 300;
			const Y = 459;

			ctx.textAlign = "right";
			ctx.font = `${THEMES.FontSizes.ATKDEF}px ${THEMES.Fonts.ATKDEF}`;
			ctx.fillStyle = THEMES.Colors.Black;
			ctx.fillText(card.atk, atkX, Y);
			ctx.fillText(card.def, defX, Y);
			ctx.textAlign = "center";
		}
	}

	/**
	 * Draws the full race/type of a monster card, including toon/ritual/effect/fusion.
	 * @param {Card} card The monster card whose race must be rendered.
	 * @param {CanvasRenderingContext2D} The temporary canvas context to render to.
	 */
	renderMonsterType(card, ctx) {
		const Attributes = CardRenderer.Attributes;
		const notSpell = Attributes[card.attribute] !== Attributes.SPELL;
		const notTrap = Attributes[card.attribute] !== Attributes.TRAP;

		if (notSpell && notTrap && card.race !== null) {
			const x = 34;
			const y = 386;

			const typeLine = `[${card.race.join('/')}]`;

			ctx.textAlign = "left";
			ctx.font = `${THEMES.FontSizes.Type}px ${THEMES.Fonts.Type}`;
			ctx.fillStyle = THEMES.Colors.Black;
			ctx.fillText(typeLine, x, y);
			ctx.textAlign = "center";
		}
	}

	/**
	 * Draws all of the text in the text box, scaled to fit.
	 * @param {Card} card The card whose text box contents must be rendered.
	 * @param {CanvasRenderingContext2D} The temporary canvas context to render to.
	 */
	renderTextBox(card, ctx) {
		const isSpellTrap = CardRenderer.Attributes[card.attribute] === CardRenderer.Attributes.SPELL
			|| CardRenderer.Attributes[card.attribute] === CardRenderer.Attributes.TRAP;

		const baseBounds = isSpellTrap ? {
			position: new Vector(34, 385),
			size: new Vector(268, 80),
		} : {
			position: new Vector(34, 396),
			size: new Vector(268, 55),
		};

		const fontFace = card.type === "Normal"
			? THEMES.Fonts.NormalText
			: THEMES.Fonts.EffectText;

		const fontSize = card.type === "Normal"
			? THEMES.FontSizes.NormalTextBox
			: isSpellTrap ? THEMES.FontSizes.SpellTrapTextBox
			: THEMES.FontSizes.EffectTextBox;

		const lineHeight = fontFace === THEMES.Fonts.EffectText ? 0.85 : 1;
		const layout = this.renderSystem.buildTextLayout(
			card.description ?? "",
			baseBounds,
			fontFace,
			fontSize,
			lineHeight
		);

		this.renderSystem.drawLayout(layout, ctx);
	}
}