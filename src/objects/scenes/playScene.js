import { Container, Sprite } from "pixi.js";

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
        this._initBoard();
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