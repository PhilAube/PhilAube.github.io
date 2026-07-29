import Menu from "../Core/Menu.js";
import MenuOption from "../Core/MenuOption.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../Core/RenderSytem.js";
import Vector from "../Core/Vector.js";
import { MenuOptions } from "../globals.js";

/** Extends the Menu base class for the game settings. */
export default class SettingsMenu extends Menu {
    /**
     * @param {CardViewerState} state The parent card viewer state owning this menu.
     * @param {Vector} position The position of the card viewer menu.
     * @param {Vector} dimensions The dimensions of the card viewer menu.
     */
    constructor(state, position, dimensions) {
        super(position, dimensions);
        this.state = state;
        const SFXTOGGLE = this.getMenuOption(MenuOptions.SFXTOGGLE);
        const SBACK = this.getMenuOption(MenuOptions.SBACK);
        super.menuOptions = [SFXTOGGLE, SBACK];
        super.cancelOption = 1;
    }

    /**
     * Gets the callback and canvas position of a menu option from an ID.
     * @param {String} id The enum representing the menu option.
     * @returns A new MenuOption with a populated task and canvas position.
     */
    getMenuOption(id) {
        switch (id) {
            case MenuOptions.SFXTOGGLE:
                return new MenuOption(
                    this.state.getSfxToggleString(),
                    this.sfxToggleHandler.bind(this),
                    new Vector(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2),
                );
            case MenuOptions.SBACK:
                return new MenuOption(
                    MenuOptions.CVBACK,
                    this.backHandler.bind(this),
                    new Vector(CANVAS_WIDTH / 2, 475),
                );
            default:
                break;
        }
    }

    /** Changes the game state back to the title screen. */
    backHandler() {
        this.state.onBackSelected();
    }

    /** Toggles between enabled and disabled (mute) sound effects. */
    sfxToggleHandler() {
        this.state.onSfxTogglelected();
    }
}