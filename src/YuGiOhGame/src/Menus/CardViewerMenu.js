import Menu from "../Core/Menu.js";
import MenuOption from "../Core/MenuOption.js";
import Vector from "../Core/Vector.js";
import { MenuOptions } from "../globals.js";

export default class CardViewerMenu extends Menu {
    /**
     * 
     * @param {CardViewerState} state The parent card viewer state owning this menu.
     * @param {Vector} position The position of the card viewer menu.
     * @param {Vector} dimensions The dimensions of the card viewer menu.
     */
    constructor(state, position, dimensions) {
        super(position, dimensions);
        const CVBACK = this.getMenuOption(MenuOptions.CVBACK);
        super.menuOptions = [CVBACK];
        this.state = state;
    }

    /**
     * Gets the callback and canvas position of a menu option from an ID.
     * @param {String} id The enum representing the menu option.
     * @returns A new MenuOption with a populated task and canvas position.
     */
    getMenuOption(id) {
        switch (id) {
            case MenuOptions.CVBACK:
                return new MenuOption(
                    MenuOptions.CVBACK,
                    this.backHandler.bind(this),
                    new Vector(460, 475),
                    true
                );
            default:
                break;
        }
    }

    /** Changes the game state back to the title screen. */
    backHandler() {
        this.state.onBackSelected();
    }
}