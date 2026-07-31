import cards from "../assets/data/cards.json" with { type: "json" }
import RenderSystem from "./Core/RenderSytem.js";
import InputManager from "./Core/Input/InputManager.js";
import SoundSystem from "./Core/SoundSystem.js";
import LocalStorageService from "./Core/LocalStorageService.js";

export const spriteSheetPaths = [
    "./src/YuGiOhGame/assets/img/CardSpritesheet.png",
    "./src/YuGiOhGame/assets/img/TemplateSpritesheet.png",
    "./src/YuGiOhGame/assets/img/AttributeSpritesheet.png",
    "./src/YuGiOhGame/assets/img/IconSpritesheet.png"
];

// Source: https://yugipedia.com/wiki/Card_layout#OCG/TCG_typefaces
export const fontPaths = {
    CardName: "/src/YuGiOhGame/assets/fonts/MatrixSmallCapsRegular.ttf",
    SpellTrap: "/src/YuGiOhGame/assets/fonts/ITCStoneSerifBold.ttf",
    SetNumber: "/src/YuGiOhGame/assets/fonts/ITCStoneSerifRegular.ttf",
    Type: "/src/YuGiOhGame/assets/fonts/ITCStoneSerifSmallCapsBold.ttf",
    NormalText: "/src/YuGiOhGame/assets/fonts/ITCStoneSerifItalic.ttf",
    EffectText: "/src/YuGiOhGame/assets/fonts/MatrixRegular.ttf",
    ATKDEF: "/src/YuGiOhGame/assets/fonts/MatrixSmallCapsRegular.ttf",
    Password: "/src/YuGiOhGame/assets/fonts/ITCStoneSerifRegular.ttf"
}

export const soundPaths = {
    Blip: "/src/YuGiOhGame/assets/audio/blip.mp3",
    Cancel: "/src/YuGiOhGame/assets/audio/cancel.mp3",
    Select: "/src/YuGiOhGame/assets/audio/select.mp3"
}

export const storageKeys = {
    sfxEnabled : "sfxEnabled"
}

export const SOUNDS = {
    Blip: "Blip",
    Cancel: "Cancel",
    Select: "Select"
}

export const cardData = cards;

/** Enum for each menu option in the game. */
export const MenuOptions = {
    CARDS : "CARDS",
    SETTINGS: "SETTINGS",
    CVBACK: "BACK",
    CVFULLSIZE: " ",
    SFXTOGGLE: "SOUND EFFECTS",
    SBACK: "BACK"
};

export const renderer = new RenderSystem(spriteSheetPaths);
export const input = new InputManager();
export const storage = new LocalStorageService();
export const sound = new SoundSystem(soundPaths, storage.get(storageKeys.sfxEnabled) ?? true);