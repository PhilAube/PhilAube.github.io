/**
 * GAME NAME:
 * Montreal Simulator
 *
 * AUTHOR:
 * Phil Aube (AKA undefined)
 *
 * BRIEF DESCRIPTION:
 * A cutting-edge and realistic driving simulator to practice your typical Montreal commute.
 *
 * ASSET SOURCES:
 * 
 * SOUNDS
 * - Music is original (written/produced/recorded by myself).
 * - Poutine, Select, Nope sounds created by myself.
 * - Obstacle collision sound effect sourced from https://freesound.org/people/LittleRobotSoundFactory/sounds/270332/
 * - Game over sound effect sourced from https://freesound.org/people/jalastram/sounds/317763/
 * - Victory fanfare sound effect sourced from https://freesound.org/people/colorsCrimsonTears/sounds/580310/
 * - Tire skid sound effect sourced from https://www.videvo.net/sound-effect/auto-skid-21/401932/
 * - Horn Honk sound effect sourced from https://www.videvo.net/sound-effect/jeep-chrke-horn-honks-pe894412/248649/
 * 
 * IMAGES
 * - Car Spritesheet: https://www.deviantart.com/lostchild14000/art/Car-Sprite-Sheet-654708133
 * - Road Texture: https://opengameart.org/content/toon-road-texture
 * - Grass Texture: https://opengameart.org/content/seamless-grass-texture-ii
 * - Background Texture: https://opengameart.org/content/background-night
 * - Cone Sprite: https://www.pinclipart.com/pindetail/omoiRw_traffic-cone-spaceship-pixel-art-png-clipart/
 * - Oil Puddle Sprite: https://thenounproject.com/term/puddle/477963/
 * - Poutine Sprite: https://www.clipartmax.com/middle/m2i8i8d3Z5m2m2H7_poutine-canada-poutine-clipart/
 * - Pothole Sprite: https://www.pngall.com/hole-png/download/36973
 * - Lock Sprite: https://www.iconsdb.com/white-icons/padlock-6-icon.html
 * - Skyline: https://www.deviantart.com/horner735/art/Repeating-skyline-for-dragon-game-background-621408304
 * - Fire: http://pixelartmaker.com/art/9302e491c4282b7
 * 
 * NOTE: Some of the externally sourced assets have been modified for this game.
 */

import GameStateName from "./enums/GameStateName.js";
import Game from "../lib/Game.js";
import {
	canvas,
	context,
	fonts,
	images,
	keys,
	settings,
	sounds,
	stateMachine,
} from "./globals.js";
import PlayState from "./states/PlayState.js";
import GameOverState from "./states/GameOverState.js";
import VictoryState from "./states/VictoryState.js";
import TitleScreenState from "./states/TitleScreenState.js";
import SettingsState from "./states/SettingsState.js";
import CarSelectState from "./states/CarSelectState.js";
import PauseState from "./states/PauseState.js";
import HighScoreState from "./states/HighScoreState.js";
import Visibility from "./services/Visibility.js";
import EventName from "./enums/EventName.js";

// Fetch the asset definitions from config.json.
fetch('./src/MontrealSimulator/src/config.json').then((response) => response.json())
.then((response) =>
{
	const {
		images: imageDefinitions,
		fonts: fontDefinitions,
		sounds: soundDefinitions,
		// @ts-ignore
	} = response;

	// Load all the assets from their definitions.
	images.load(imageDefinitions);
	fonts.load(fontDefinitions);
	sounds.load(soundDefinitions);

	// Add all the states to the state machine.
	stateMachine.add(GameStateName.TitleScreen, new TitleScreenState());
	stateMachine.add(GameStateName.GameOver, new GameOverState());
	stateMachine.add(GameStateName.Victory, new VictoryState());
	stateMachine.add(GameStateName.Play, new PlayState());
	stateMachine.add(GameStateName.SettingsMenu, new SettingsState());
	stateMachine.add(GameStateName.CarSelect, new CarSelectState());
	stateMachine.add(GameStateName.PauseScreen, new PauseState());
	stateMachine.add(GameStateName.HighScores, new HighScoreState());

	stateMachine.change(GameStateName.TitleScreen, { playMusic: !settings.muteMusic, fade: true });

	// Add event listeners for player input.
	document.addEventListener(EventName.KeyDown, event => {
		// Prevent automatic scrolling of up/down arrows
		if (event.key === "ArrowUp" || event.key === "ArrowDown") event.preventDefault();
		keys[event.key] = true;
	});

	document.addEventListener(EventName.KeyUp, event => {
		// Prevent automatic scrolling of up/down arrows
		if (event.key === "ArrowUp" || event.key === "ArrowDown") event.preventDefault();
		keys[event.key] = false;
	});

	document.addEventListener(EventName.VisibilityChange, Visibility.handleVisibilityChange, false);

	const game = new Game(stateMachine, context, canvas.width, canvas.height);

	game.start();

	// Focus the canvas so that the player doesn't have to click on it.
	canvas.focus();
});