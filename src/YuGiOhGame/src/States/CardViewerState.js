import CardViewerMenu from "../Menus/CardViewerMenu.js";
import State from "../Core/State.js";
import TitleScreenState from "./TitleScreenState.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../Core/RenderSytem.js";
import { cardData, renderer, sound, SOUNDS } from "../globals.js";
import Card from "../Core/Card.js";
import { input } from "../globals.js";
import InputHandler from "../Core/Input/InputHandler.js";
import CardRenderer from "../Core/CardRenderer.js";
import { InputTypes } from "../Core/Input/InputManager.js";

/** State for card gallery to view full cards. */
export default class CardViewerState extends State {
    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super(stateMachine);
        this.index = 0;
        this.menu = new CardViewerMenu(this);
        this.currentCard = null;
        this.setCurrentCard(this.index);
        this.counter = 0;
        this.nearbyCards = this.setNearbyCards();
        this.lastDragStep = 0;
        this.scrollingVelocity = 0;
        this.scrollAccumulator = 0;
    }

    /**
     * Handles input for card navigation or for menu.
     * @param {Number} dt How much time has elapsed since the last time this was called.
     */
    update(dt) {
        const FREQUENCY = 0.1; // Shows 10 cards per second.
        this.counter += dt;

        this.menu.update();
        
        if (this.menu.cursorPosition === null || this.menu.cursorPosition === 1) {
            // Set card size to small when pointer not hovering or when on back.
            this.resizeCurrentCard(CardRenderer.Size.Small);
        } else if (this.menu.cursorPosition === 0 && this.currentCard.size == CardRenderer.Size.Small) {
            // Set card size to medium if hovered.
            this.resizeCurrentCard(CardRenderer.Size.Medium);
        }

        this.handlePointerNavigation(dt);

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
                            this.scrollingVelocity = 0;
                        }
                        break;
                    case InputHandler.ACTIONS.Right:
                        if (this.counter >= FREQUENCY) {
                            this.counter = 0;
                            index = (index + 1 + length) % length;
                            this.updateCards(index);
                            this.scrollingVelocity = 0;
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

    /**
     * Handles pointer-driven navigation for the card viewer.
     * @param {Number} dt Delta time, or the time passed since the last frame.
     */
    handlePointerNavigation(dt) {
        if (input.currentInput !== InputTypes.Tap && input.currentInput !== InputTypes.Mouse) return;

        const gestureState = input.getPointerGestureState();
        const absX = Math.abs(gestureState.distanceX);
        const absY = Math.abs(gestureState.distanceY);
        const cardSpacing = Math.max(this.nearbyCards[0].dimensions.x, 1);

        if (this.gestureOriginatedOnCurrentCard(gestureState)) return;

        if (this.gestureReset(gestureState)) return;

        if (this.handleIntertialScroll(cardSpacing, dt)) return;

        this.handleDrag(gestureState, absX, absY, cardSpacing);
    }

    /** Updates the game's current state back to the title screen. */
    onBackSelected() {
        this.stateMachine.currentState = new TitleScreenState(this.stateMachine);
    }

    /** Toggles between medium/full size when a card is selected. */
    onCardSelected() {
        const newSize = this.currentCard.size === CardRenderer.Size.Medium
        ? CardRenderer.Size.Full
        : CardRenderer.Size.Medium;

        this.resizeCurrentCard(newSize);
    }

    /**
     * Changes the current cards displayed on screen.
     * @param {Number} index The new index of the card to display (ID - 1 offset).
     */
    updateCards(index) {
        sound.play(SOUNDS.Blip);
        this.setCurrentCard(index);
        this.index = index;
        this.nearbyCards = this.setNearbyCards();
    }

    /**
     * Sets the specified current card at the center.
     * @param {Number} index The new index of the card to display (ID - 1 offset).
     * @returns A new Card with an updated ID, with size and position defined.
     */
    setCurrentCard(index) {
        const isCardFocused = (this.menu.cursorPosition === 0);
        this.currentCard = new Card(index + 1);
        let size = isCardFocused ? CardRenderer.Size.Medium : CardRenderer.Size.Small;
        this.resizeCurrentCard(size);
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

    /**
     * Sets the dimensions of the card based and repositions accordingly.
     * @param {Number} size The CardRenderer.Size (Small, Medium, Full) to resize the card to.
     */
    resizeCurrentCard(size) {
        this.currentCard.setSize(size);
        this.menu.menuOptions[0].setDimensions(this.currentCard.dimensions);
        this.currentCard.position.x = (CANVAS_WIDTH / 2) - (this.currentCard.dimensions.x / 2);
        this.currentCard.position.y = (CANVAS_HEIGHT / 2) - (this.currentCard.dimensions.y / 2);
    }

    /**
     * Determines whether the user's gesture began on the middle / current card.
     * @param {Object} gestureState The current state of the user's gesture.
     * @returns {Boolean} True if the user's gesture began on the center / current card.
     */
    gestureOriginatedOnCurrentCard(gestureState) {
        if (gestureState.isActive) {
            const rawPointer = input.getPointerPosition();
            const pointer = rawPointer ? renderer.getPointerPosition(rawPointer) : null;

            if (pointer) {
                const startX = pointer.x - gestureState.distanceX;
                const startY = pointer.y - gestureState.distanceY;

                const currentCardBounds = {
                    x: this.currentCard.position.x,
                    y: this.currentCard.position.y,
                    width: this.currentCard.dimensions.x,
                    height: this.currentCard.dimensions.y
                };

                const originatedOnCurrentCard =
                    startX >= currentCardBounds.x &&
                    startX <= currentCardBounds.x + currentCardBounds.width &&
                    startY >= currentCardBounds.y &&
                    startY <= currentCardBounds.y + currentCardBounds.height;

                if (originatedOnCurrentCard) return true;
                else return false;
            }
        }
    }

    /**
     * Resets the gesture state if it was just released.
     * @param {Object} gestureState The current state of the user's gesture.
     * @returns True if the gesture was just released and reset.
     */
    gestureReset(gestureState) {
        if (gestureState.justReleased) {
            const MIN_VELOCITY = 500;
            this.scrollingVelocity = Math.abs(gestureState.velocityX) > MIN_VELOCITY ? gestureState.velocityX : 0;
            this.lastDragStep = 0;
            this.scrollAccumulator = 0;
            return true;
        } else return false;
    }

    /**
     * Scrolls multiple for a short time after lifting pointer based on the gesture velocity.
     * @param {Number} cardSpacing The width of the small cards used to change index.
     * @param {Number} dt Delta time, or the time passed since the last frame.
     * @returns True if inertial scrolling has been processed.
     */
    handleIntertialScroll(cardSpacing, dt) {
        if (this.scrollingVelocity !== 0) {
            const velocityStep = (this.scrollingVelocity * dt) / cardSpacing;
            this.scrollAccumulator += velocityStep;

            const stepCount = Math.trunc(this.scrollAccumulator);
            if (stepCount !== 0) {
                const nextIndex = (this.index - stepCount + cardData.length) % cardData.length;
                this.updateCards(nextIndex);
                this.scrollAccumulator -= stepCount;
            }

            const decayRate = 5000;
            const velocityDelta = Math.sign(this.scrollingVelocity) * Math.min(Math.abs(this.scrollingVelocity), decayRate * dt);
            this.scrollingVelocity -= velocityDelta;
            
            const minVelocity = 200;
            if (Math.abs(this.scrollingVelocity) < minVelocity) {
                this.scrollingVelocity = 0;
            }

            return true;
        } else return false;
    }

    /**
     * Scrolls individual cards left and right based on where the pointer drags from the gesture state.
     * @param {Object} gestureState The current state of the user's gesture.
     * @param {Number} absX The absolute X distance travelled by the gesture from its origin.
     * @param {Number} absY The absolute Y distance travalled by the gesture from its origin.
     */
    handleDrag(gestureState, absX, absY, cardSpacing) {
        if (gestureState.isDragging && absX > absY) {
            const currentStep = Math.round(gestureState.distanceX / cardSpacing);
            const delta = currentStep - this.lastDragStep;

            if (delta !== 0) {
                const nextIndex = (this.index - delta + cardData.length) % cardData.length;
                this.updateCards(nextIndex);
                this.lastDragStep = currentStep;
            }
        }
    }
}