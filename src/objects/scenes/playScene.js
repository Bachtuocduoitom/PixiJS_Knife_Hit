import { Container, Sprite } from "pixi.js";
import { Game } from "../../game";
import { Background } from "../backgrounds/background";
import { Knife } from "../knives/knife";
import { GameConstant } from "../../gameConstant";

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
        this._initKnife();
    }

    _initBackground() {
        this.background = new Background(Game.bundle.background);
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

    _initKnife() {
        this.knife = new Knife(Game.bundle.knife);
        this.knife.x = GameConstant.GAME_WIDTH / 2;
        this.knife.y = GameConstant.GAME_HEIGHT - 100;
        this.gameplay.addChild(this.knife); 
    }

    update(dt) {
        this.knife.update(dt);
        console.log(this.knife.x, this.knife.y);
    }
}