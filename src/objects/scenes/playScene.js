import { Container, Sprite } from "pixi.js";
import { Background } from "../backgrounds/background";

export const GameState = Object.freeze({
    Lobby: "lobby",
    Playing: "playing",
    Win: "win",
    Lose: "lose"
})

export class PlayScene extends Container {
    constructor() {
        super();
        this.state = GameState.Lobby;
        this._initGamePlay();
    }

    _initGamePlay() {
        this.gameplay = new Container();
        this.addChild(this.gameplay);
        this._initBackground();
        this._initBoard();
    }

    _initBackground() {
        this.background = new Background();
        this.background.x = 0;
        this.background.y = 0;
        this.gameplay.addChild(this.background);
    }

    _initBoard() {
        this.board = Sprite.from("assets/images/ramus.jpg")
        this.board.x =10;
        this.board.y = 10;
        this.gameplay.addChild(this.board);
    }

    update(dt) {

    }
}