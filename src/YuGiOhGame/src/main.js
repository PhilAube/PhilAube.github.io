import StateMachine from "./Core/StateMachine.js";
import Game from "./Core/Game.js";

const stateMachine = new StateMachine()

const game = new Game(stateMachine);

game.start();