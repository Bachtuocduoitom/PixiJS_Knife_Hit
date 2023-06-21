import { Container, Sprite } from "pixi.js";
import { Game } from "../../game";
import { Background } from "../backgrounds/background";
import { Knife } from "../knives/knife";
import { KnifeManager } from "../knives/knifeManager";
import { Board } from "../boards/board";
import { GameConstant } from "../../gameConstant";

export const GameState = Object.freeze({
    Lobby: "lobby",
    Playing: "playing",
    Win: "win",
    Lose: "lose"
})

export const Level1 = Object.freeze({
    KNIFE_NUMBER: 7,
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
        this.board = new Board(Game.bundle.board);
        this.board.x =GameConstant.GAME_WIDTH / 2;
        this.board.y = GameConstant.GAME_HEIGHT /4 - 50;
        this.gameplay.addChild(this.board);
    }

    _initKnife() {
        this.knifeManager = new KnifeManager();
        this.knifeManager.x = 0;
        this.knifeManager.y = 0;
        this.gameplay.addChild(this.knifeManager);
    }

    update(dt) {
        this.knifeManager.update(dt);
        this.board.update(dt);
       
    }
}