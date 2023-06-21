import { Container, Sprite, Graphics } from "pixi.js";
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
        this._initBoxHide();
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
        this.board.y = GameConstant.GAME_HEIGHT /3- 40;
        this.gameplay.addChild(this.board);
    }
    _initBoxHide() {
        this.box = new Graphics();
        this.box.lineStyle(0.01, 0xFF0000);
        this.box.drawRect(GameConstant.GAME_WIDTH / 2 - 75, GameConstant.GAME_HEIGHT /3 - 75, 150,150);
        this.gameplay.addChild(this.box);
    }
    _initKnife() {
        this.knifeManager = new KnifeManager();
        this.knifeManager.x = GameConstant.GAME_WIDTH / 2;
        this.knifeManager.y = GameConstant.GAME_HEIGHT - 200; 
        this.gameplay.addChild(this.knifeManager);
    }

    update(dt) {
        this.knifeManager.update(dt);
        this.board.update(dt);
        this.collisonKnifeBox();
    }
    collisonKnifeBox() {
        this.knifeManager.knives.forEach((knife) => {
            let a = knife.getBounds();
            let b = this.box.getBounds();
            if(a.x + a.width > b.x &&
                a.x < b.x + b.width &&
                a.y + a.height > b.y &&
                a.y < b.y + b.height) {
                    this.board.addChild(knife);
                    knife.scale.set(0.5, -0.5);
                    console.log('oke !');
                    knife.speed = 0;
                }
        });
       
      }
}