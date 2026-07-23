import CardViewerMenu from "../Menus/CardViewerMenu.js";
import State from "../Core/State.js";
import TitleScreenState from "./TitleScreenState.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../Core/RenderSytem.js";
import { cardData, renderer, sound, SOUNDS } from "../globals.js";
import Card from "../Core/Card.js";
import { input } from "../globals.js";
import InputHandler from "../Core/Input/InputHandler.js";
import CardRenderer from "../Core/CardRenderer.js";

/** State for card gallery to view full cards. */
export default class CardViewerState extends State {
    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super(stateMachine);
        this.index = 0;
        this.currentCard = this.setCurrentCard(this.index);
        this.menu = new CardViewerMenu(this);
        this.counter = 0;
        this.nearbyCards = this.setNearbyCards();
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
                            this.updateCards(index);
                        }
                        break;
                    case InputHandler.ACTIONS.Right:
                        if (this.counter >= FREQUENCY) {
                            this.counter = 0;
                            index = (index + 1 + length) % length;
                            this.updateCards(index);
                        }
                        break;
                }
            }
        }); 
    }

    /** Renders the menu and the current card. */
    render() {
        this.menu.render();
        this.renderNearbyCards();
        renderer.card.render(this.currentCard);
    }

    /** Updates the game's current state back to the title screen. */
    onBackSelected() {
        this.stateMachine.currentState = new TitleScreenState(this.stateMachine);
    }

    /** Toggles between medium/full size when a card is selected. */
    onCardSelected() {
        this.currentCard.size === CardRenderer.Size.Full 
        ? this.currentCard.setSize(CardRenderer.Size.Medium)
        : this.currentCard.setSize(CardRenderer.Size.Full);

        this.currentCard.position.x = (CANVAS_WIDTH / 2) - (this.currentCard.dimensions.x / 2);
        this.currentCard.position.y = (CANVAS_HEIGHT / 2) - (this.currentCard.dimensions.y / 2);
    }

    /**
     * Changes the current cards displayed on screen.
     * @param {Number} index The new index of the card to display (ID - 1 offset).
     */
    updateCards(index) {
        sound.play(SOUNDS.Blip);
        this.currentCard = this.setCurrentCard(index);
        this.index = index;
        this.nearbyCards = this.setNearbyCards();
    }

    /**
     * Sets the specified current card at the center.
     * @param {Number} index The new index of the card to display (ID - 1 offset).
     * @returns A new Card with an updated ID, with size and position defined.
     */
    setCurrentCard(index) {
        let card = new Card(index + 1);
        card.setSize(CardRenderer.Size.Medium);
        const x = (CANVAS_WIDTH - card.dimensions.x) / 2;
        const y = (CANVAS_HEIGHT - card.dimensions.y) / 2;
        card.position.set(x, y);
        return card;
    }

    /**
     * Sets the surrounding cards to their required positions.
     * @returns An array of new Cards.
     */
    setNearbyCards() {
        const RADIUS = 4;
        const nearbyCards = [];
        const totalCards = cardData.length;

        // Left side
        for (let slot = 0; slot < RADIUS; slot++) {
            const offset = slot - RADIUS; // -4..-1
            const cardIndex = (this.index + offset + totalCards) % totalCards;

            const card = new Card(cardIndex + 1);
            card.setSize(CardRenderer.Size.Small);

            const x = (card.dimensions.x / 4) * slot;
            const y = (CANVAS_HEIGHT - card.dimensions.y) / 2;

            card.position.set(x, y);
            nearbyCards.push(card);
        }

        // Right side
        for (let slot = 0; slot < RADIUS; slot++) {
            const offset = RADIUS - slot; // +4..+1
            const cardIndex = (this.index + offset) % totalCards;

            const card = new Card(cardIndex + 1);
            card.setSize(CardRenderer.Size.Small);

            const x = CANVAS_WIDTH - (card.dimensions.x / 4) * (RADIUS + slot);
            const y = (CANVAS_HEIGHT - card.dimensions.y) / 2;

            card.position.set(x, y);
            nearbyCards.push(card);
        }

        return nearbyCards;
    }

    /** Renders the cards surrounding the current card. */
    renderNearbyCards() {
        const RADIUS = 4;

        for (let i = 0; i <= (RADIUS * 2) - 1; i++) {
            renderer.card.render(this.nearbyCards[i]);
        }
    }
}