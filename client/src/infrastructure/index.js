import GameSystems from '../game-systems';;
import GameController from './GameController';

export default function initGame(gameSystem, model, onFail) {
	if (!GameSystems[gameSystem]) throw new Exception(`${gameSystem} is not a game system`);
	const controller = new GameController(model, onFail);
	GameSystems[gameSystem](controller);
	controller._init();
	return controller;
}
