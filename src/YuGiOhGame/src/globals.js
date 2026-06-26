import cards from "../assets/data/cards.json" with { type: "json" }

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export const CANVAS_WIDTH = canvas.width;
export const CANVAS_HEIGHT = canvas.height;

export const spriteSheetPaths = ["./src/YuGiOhGame/assets/img/CardSpritesheet.png"];
export const cardData = cards;