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
        this.gameplay.sortableChildren = true;
        this.addChild(this.gameplay);
        this._initBackground();
        this._initBoard();
        this._initKnifeManager();
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
        this.board.zIndex = 100;
    }

    _initBoxHide() {
        this.box = new Graphics();
        this.box.lineStyle(1, 0xFF0000);
        this.box.drawRect(GameConstant.GAME_WIDTH / 2 - 75, GameConstant.GAME_HEIGHT /3 - 40-75, 150,150);
        this.gameplay.addChild(this.box);
    }
    
    _initKnifeManager() {
        this.knifeManager = new KnifeManager();
        this.knifeManager.x = 0;
        this.knifeManager.y = 0; 
        this.gameplay.addChild(this.knifeManager);
        this.knifeManager.zIndex = 0;
    }

    update(dt) {
        this.knifeManager.update(dt);
        this.board.update(dt);
        this._onCollision();
    }

    _onCollision() {
        if (this.knifeManager.knives[0] != null) {
            if (this.knifeManager.knives[0].isMove) {
                if (this._isCollision(this.knifeManager.knives[0], this.box)) {
                    this.knifeManager.knives[0].beObs();
                    this._rotateKnife(this.knifeManager.knives[0]);
                    // /this._addKnifeToBoard(this.knifeManager.knives[0]);
                    this.knifeManager.obsKnives.push(this.knifeManager.knives.shift());
                    if (this.knifeManager.numOfKnife > 0) {
                        this.knifeManager.knives[0].setActivate();
                        this.knifeManager.numOfKnife--;
                    }
                    // console.log(Math.round(this.board.rotation / (Math.PI * 2)) , 'vòng');
                    console.log("va roi!");
                }
            }
        }
        
    }

    _isCollision(a, b) {
        const aBox = a.getBounds()
        const bBox = b.getBounds();
        return aBox.x + aBox.width > bBox.x &&
            aBox.x < bBox.x + bBox.width &&
            aBox.y + aBox.height > bBox.y &&
            aBox.y < bBox.y + bBox.height
    }

    _addKnifeToBoard(knife) {
        this.knifeManager.removeChild(knife);
        knife.x = this.board.width/2;
        knife.y = this.board.height/2;
        this.board.addChild(knife);
        
    }

    _rotateKnife(knife) {
        knife.x = this.board.x;
        knife.y = this.board.y;
        knife.anchor.set(0.5, -0.5);
    }
}