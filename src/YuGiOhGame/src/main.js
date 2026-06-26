import RenderSystem from "./Core/RenderSytem.js";
import StateMachine from "./Core/StateMachine.js";
import Game from "./Core/Game.js";
import Card from "./Core/Card.js";

const stateMachine = new StateMachine()

const game = new Game(stateMachine);

game.start();