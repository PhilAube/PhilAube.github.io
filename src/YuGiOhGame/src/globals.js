import cards from "../assets/data/cards.json" with { type: "json" }
import RenderSystem from "./Core/RenderSytem.js";
import InputManager from "./Core/Input/InputManager.js";

export const spriteSheetPaths = ["./src/YuGiOhGame/assets/img/CardSpritesheet.png"];
export const cardData = cards;

/** Enum for each menu option in the game. */
export const MenuOptions = {
    CARDS : "CARDS",
    SETTINGS: "SETTINGS"
};

export const renderer = new RenderSystem(spriteSheetPaths);
export const input = new InputManager();