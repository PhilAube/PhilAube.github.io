import Card from "../Core/Card.js";
import State from "../Core/State.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../Core/RenderSytem.js";
import TitleScreenMenu from "../Menus/TitleScreenMenu.js";
import { cardData, renderer } from "../globals.js";
import CardViewerState from "./CardViewerState.js";
import Vector from "../Core/Vector.js";
import SettingsState from "./SettingsState.js";
import { THEMES } from "../themes.js";

/** State for title screen which cycles through card artwork each second. */
export default class TitleScreenState extends State {
    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super(stateMachine);
        this.currentCardId = this.getRandomCardId();
        this.timer = 0;
        this.menu = new TitleScreenMenu(this);
    }

    /**
     * Updates random card artwork once per second.
     * @param {Number} dt How much time has elapsed since the last time this was called.
     */
    update(dt) {
        const TICKER = 1;

        if (this.timer > TICKER) {
            this.currentCardId = this.getRandomCardId();
            this.timer = 0;
        }
        else this.timer += dt;

        this.menu.update();
    }

    /** Renders menu, title and card artwork. */
    render() {
        this.menu.render();
        this.renderText();
        this.renderCardSprite();
    }

    /**
     * Picks a random number from the range of card IDs.
     * @returns A new randomly picked Card ID.
     */
    getRandomCardId() {
        const CARD_COUNT = cardData.length;
        return Math.floor(Math.random() * CARD_COUNT) + 1;
    }

    /** Renders the current card art in the center of the canvas. */
    renderCardSprite() {
        // Determines how big (in px) the sprite will display.
        const drawSize = 200;

        // Center inside canvas
        const x = (CANVAS_WIDTH - drawSize) / 2;
        const y = (CANVAS_HEIGHT - drawSize) / 2;

        renderer.card.renderSprite(this.currentCardId, x, y, drawSize);
    }

    /** Renders the title. */
    renderText() {
        const TITLE_TEXT = "Not Yu-Gi-Oh! The Sacred Cards";
        renderer.headerText(TITLE_TEXT, 100, THEMES.Fonts.CardName);
    }

    /** Updates the game's current state to the card viewer. */
    onCardsSelected() {
        this.stateMachine.currentState = new CardViewerState(this.stateMachine);
    }

    /** Updates the game's current state to the settings menu. */
    onSettingsSelected() {
        this.stateMachine.currentState = new SettingsState(this.stateMachine);
    }
}