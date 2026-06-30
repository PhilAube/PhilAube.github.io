import { cardData } from "../globals.js";
import CanvasObject from "../Core/CanvasObject.js";

/** Represents a playable card with all of its properties. */
export default class Card extends CanvasObject{
    /**
     * @param {Number} id The unique TSC_ID of the card to instantiate.
     */
    constructor(id) {
        super();
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
        this.type = data.frameType;
        this.description = data.desc;
    }

    /**
     * Finds the card data associated based on the ID of the card.
     * @returns An object containing the data for the current card.
     */
    findData() {
        return cardData.find(card => card.tsc_id === this.id);
    }
}