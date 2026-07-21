import Menu from "../Core/Menu.js";
import MenuOption from "../Core/MenuOption.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../Core/RenderSytem.js";
import Vector from "../Core/Vector.js";
import { MenuOptions } from "../globals.js";

/** Extends the Menu base class for the card viewer. */
export default class CardViewerMenu extends Menu {
    /**
     * @param {CardViewerState} state The parent card viewer state owning this menu.
     * @param {Vector} position The position of the card viewer menu.
     * @param {Vector} dimensions The dimensions of the card viewer menu.
     */
    constructor(state, position, dimensions) {
        super(position, dimensions);
        const CVFULLSIZE = this.getMenuOption(MenuOptions.CVFULLSIZE);
        const CVBACK = this.getMenuOption(MenuOptions.CVBACK);
        super.menuOptions = [CVFULLSIZE, CVBACK];
        this.state = state;
        super.cancelOption = 1;
    }

    /**
     * Gets the callback and canvas position of a menu option from an ID.
     * @param {String} id The enum representing the menu option.
     * @returns A new MenuOption with a populated task and canvas position.
     */
    getMenuOption(id) {
        switch (id) {
            case MenuOptions.CVFULLSIZE:
                return new MenuOption(
                    MenuOptions.CVFULLSIZE,
                    this.cardSelectHandler.bind(this),
                    new Vector(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2),
                    true
                );
            case MenuOptions.CVBACK:
                return new MenuOption(
                    MenuOptions.CVBACK,
                    this.backHandler.bind(this),
                    new Vector(460, 475),
                );
            default:
                break;
        }
    }

    /** Changes the game state back to the title screen. */
    backHandler() {
        this.state.onBackSelected();
    }

    /** Toggles between full and medium card size. */
    cardSelectHandler() {
        this.state.onCardSelected();
    }
}