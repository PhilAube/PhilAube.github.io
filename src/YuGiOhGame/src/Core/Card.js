import { cardData } from "../globals.js";
import CanvasObject from "../Core/CanvasObject.js";
import Vector from "./Vector.js";
import CardRenderer from "./CardRenderer.js";

/** Represents a playable card with all of its properties. */
export default class Card extends CanvasObject{
    /**
     * @param {Number} id The unique TSC_ID of the card to instantiate.
     */
    constructor(id) {
        super(Vector.Empty, CardRenderer.CARDSIZE);
        this.size = CardRenderer.Size.Full;
        this.dimensions = this.getDimensions();
        this.id = id;

        let data = this.findData();
        this.name = data.name;
        this.deckCost = data.deckCost;
        this.password = data.id;
        this.atk = data.atk;
        this.def = data.def;
        this.attribute = data.attribute;
        this.level = data.level;
        this.race = data.race;

        this.type = data.frameType 
            ? data.frameType[0].toUpperCase() + data.frameType.slice(1)
            : null; // Handles blank cards until they are all populated.

        this.description = data.desc;
    }

    /**
     * Finds the card data associated based on the ID of the card.
     * @returns An object containing the data for the current card.
     */
    findData() {
        return cardData.find(card => card.tsc_id === this.id);
    }

    /** Gets the scaled dimensions of the card based on its size. */
    getDimensions() {
        return new Vector(CardRenderer.CARDSIZE.x * this.size, CardRenderer.CARDSIZE.y * this.size);
    }

    /**
     * Sets the size property and updates the canvas dimensions.
     * @param {Number} size The CardRenderer.Size enum value to set this card to.
     */
    setSize(size) {
        this.size = size;
        this.dimensions = this.getDimensions();
    }
}