import Card from "../Core/Card.js";
import State from "../Core/State.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../Core/RenderSytem.js";
import TitleScreenMenu from "../Menus/TitleScreenMenu.js";
import { renderer } from "../globals.js";

/** State for title screen which cycles through card artwork each second. */
export default class TitleScreenState extends State {
    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super(stateMachine);
        this.currentCard = this.getRandomCard();
        this.timer = 0;
        this.menu = new TitleScreenMenu();
    }

    /** Updates random card artwork once per second. */
    update(dt) {
        const TICKER = 1;

        if (this.timer > TICKER) {
            this.currentCard = this.getRandomCard();
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
     * Picks a random number from the range of card IDs and instantiates a card.
     * @returns A new randomly picked Card instance.
     */
    getRandomCard() {
        const CARD_COUNT = 900;
        const index = Math.floor(Math.random() * CARD_COUNT) + 1;
        return new Card(index);
    }

    /** Renders the current card art in the center of the canvas. */
    renderCardSprite() {
        // Determines how big (in px) the sprite will display.
        const drawSize = 200;

        // Center inside canvas
        const x = (CANVAS_WIDTH - drawSize) / 2;
        const y = (CANVAS_HEIGHT - drawSize) / 2;

        renderer.card.renderSprite(this.currentCard, x, y, drawSize);
    }

    /** Renders the title. */
    renderText() {
        const TITLE_TEXT = "Not Yu-Gi-Oh! The Sacred Cards";
        renderer.headerText(TITLE_TEXT, 100);
    }
}