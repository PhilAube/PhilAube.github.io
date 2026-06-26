import { cardData } from "../globals.js";

/** Represents a playable card with all of its properties. */
export default class Card {
    /**
     * @param {Number} id The unique TSC_ID of this card to instantiate.
     */
    constructor(id) {
        this.id = id;

        let data = this.findDataById(id);
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
     * Finds the card data associated with the given ID.
     * @param {Number} id The ID to find data for.
     * @returns An object containing the data for the given card ID.
     */
    findDataById(id) {
        return cardData.find(card => card.tsc_id === id);
    }
}