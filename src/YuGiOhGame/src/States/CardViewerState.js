import CardViewerMenu from "../Menus/CardViewerMenu.js";
import State from "../Core/State.js";
import TitleScreenState from "./TitleScreenState.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../Core/RenderSytem.js";
import { cardData, renderer } from "../globals.js";
import Card from "../Core/Card.js";
import { input } from "../globals.js";
import InputHandler from "../Core/Input/InputHandler.js";
import CardRenderer from "../Core/CardRenderer.js";

export default class CardViewerState extends State {
    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super(stateMachine);
        this.index = 0;
        this.currentCard = this.setCard(this.index);
        this.menu = new CardViewerMenu(this);
        this.counter = 0;
    }

    /**
     * Handles input for card navigation or for menu.
     * @param {Number} dt How much time has elapsed since the last time this was called.
     */
    update(dt) {
        const FREQUENCY = 0.1; // Shows 10 cards per second.
        this.counter += dt;

        this.menu.update();

        let index = this.index;
        let length = cardData.length;
        let states = Object.entries(input.get());

        states.forEach(state => {
            // Support repeated cursor moves when buttons are held down.
            if (state[1] === InputHandler.ACTIONSTATE.Down || state[1] === InputHandler.ACTIONSTATE.Hold) {
                switch (state[0]) {
                    case InputHandler.ACTIONS.Left:
                        if (this.counter >= FREQUENCY) {
                            this.counter = 0;
                            index = (index - 1 + length) % length;
                            this.updateCard(index);
                        }
                        break;
                    case InputHandler.ACTIONS.Right:
                        if (this.counter >= FREQUENCY) {
                            this.counter = 0;
                            index = (index + 1 + length) % length;
                            this.updateCard(index);
                        }
                        break;
                    case InputHandler.ACTIONS.A:
                        // Do not repeat cursor selections when button is held down.
                        if (state[1] !== InputHandler.ACTIONSTATE.Hold) {
                            this.stateMachine.currentState = new TitleScreenState(this.stateMachine);
                        }
                        break;
                }
            }
        }); 
    }

    /** Renders the menu and the current card. */
    render() {
        this.menu.render();
        renderer.card.render(this.currentCard, CardRenderer.Size.Medium);

        const name = this.currentCard.name.replaceAll('"', '');
        const id = String(this.currentCard.id).padStart(3,'0');
        renderer.headerText(`#${id}: ${name}`, 50);
    }

    /** Updates the game's current state back to the title screen. */
    onBackSelected() {
        this.stateMachine.currentState = new TitleScreenState(this.stateMachine);
    }

    /**
     * Changes the current card displayed on screen.
     * @param {Number} index The new index of the card to display (ID - 1 offset).
     */
    updateCard(index) {
        this.currentCard = this.setCard(index);
        this.index = index;
    }

    /**
     * Sets the specified card at the required position and dimensions.
     * @param {Number} index The new index of the card to display (ID - 1 offset).
     * @returns A new Card with an updated ID, with size and position defined.
     */
    setCard(index) {
        let card = new Card(index + 1);
        card.setSize(CardRenderer.Size.Medium);
        const x = (CANVAS_WIDTH - card.dimensions.x) / 2;
        const y = (CANVAS_HEIGHT - card.dimensions.y) / 2;
        card.position.set(x, y);
        return card;
    }
}