import State from "../Core/State.js";
import Vector from "../Core/Vector.js";
import { MenuOptions, storage, sound, storageKeys } from "../globals.js";
import SettingsMenu from "../Menus/SettingsMenu.js";
import TitleScreenState from "./TitleScreenState.js";

/** State for settings menu to update and persist user preferences. */
export default class SettingsState extends State {
    /**
     * @param {StateMachine} stateMachine 
     */
    constructor(stateMachine) {
        super(stateMachine);
        this.menu = new SettingsMenu(this);
    }

    /**
     * Updates the menu based on cursor position.
     * @param {Number} dt How much time has elapsed since the last time this was called.
     */
    update(dt) {
        this.menu.update();
    }

    /** Renders menu options. */
    render() {
        this.menu.render();
    }

    /** Updates the game's current state back to the title screen. */
    onBackSelected() {
        this.stateMachine.currentState = new TitleScreenState(this.stateMachine);
    }

    /** Toggles the audio SFX and persists the user's preference in local storage. */
    onSfxTogglelected() {
        let currentValue = storage.get("sfxEnabled");
        storage.set("sfxEnabled", !currentValue);
        
        let buttonText = this.getSfxToggleString();
        this.menu.menuOptions[this.menu.cursorPosition].updateText(buttonText);

        sound.enabled = !currentValue;
    }

    /**
     * Gets the text for the SFX toggle button depending on the current persisted preference (default to true if absent).
     * @returns {String} The string to be displayed on the button.
     */
    getSfxToggleString() {
        let currentValue = storage.get(storageKeys.sfxEnabled) ?? true;
        if (currentValue === null) storage.set("sfxEnabled", currentValue);
                
        let buttonText = currentValue 
        ? "DISABLE " + MenuOptions.SFXTOGGLE 
        : "ENABLE " + MenuOptions.SFXTOGGLE;
        return buttonText;
    }
}