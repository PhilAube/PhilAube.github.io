import Menu from "../Core/Menu.js";
import MenuOption from "../Core/MenuOption.js";
import Vector from "../Core/Vector.js";
import { MenuOptions } from "../globals.js";
import { CANVAS_WIDTH } from "../Core/RenderSytem.js"

/** Extends the Menu base class for the title screen. */
export default class TitleScreenMenu extends Menu {
    constructor(position, dimensions) {
        super(position, dimensions);
        const CARDS = this.getMenuOption(MenuOptions.CARDS);
        const SETTINGS = this.getMenuOption(MenuOptions.SETTINGS);
        super.menuOptions = [CARDS, SETTINGS];
    }

    /** Changes the game state to a card viewer. */
    cardsHandler() {
        console.log("TODO");
    }

    /** Changes the game state to a settings menu. */
    settingsHandler() {
        console.log("TODO");
    }

    /**
     * Gets the callback and canvas position of a menu option from an ID.
     * @param {Number} name The enum representing the menu option.
     * @returns A new MenuOption with a populated task and canvas position.
     */
    getMenuOption(id) {
        switch (id) {
            case MenuOptions.CARDS:
                return new MenuOption(
                    MenuOptions.CARDS,
                    this.cardsHandler,
                    new Vector(CANVAS_WIDTH / 2, 400)
                );
            case MenuOptions.SETTINGS:
                return new MenuOption(
                    MenuOptions.SETTINGS,
                    this.settingsHandler,
                    new Vector(CANVAS_WIDTH / 2, 450)
                );
            default:
                break;
        }
    }
}