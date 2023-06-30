import { Container, Sprite, Text, TextStyle } from "pixi.js";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Level1 } from "../scenes/playScene";

export class PlayUI extends Container {
    constructor() {
        super();
        this.playTime = 0;
        this._initTimer();
        this._initScore();
        this._initAppleCount();
        this._initKnifeCount();
        this.resize();
    }

    _initTimer() {
        let textStyle = new TextStyle({ fontSize: 45, align: "center", fill: 0xe6b85f, fontWeight: "bold", fontFamily: "Comic Sans MS" });
        this.timerText = new Text(`${this._formatTime(0)}`, textStyle);
        this.timerText.anchor.set(0.5, 0);
        this.addChild(this.timerText);
    }

    _formatTime(totalSeconds) {
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = Math.floor(totalSeconds % 60);
        var milliseconds = Math.floor((totalSeconds % 1) * 100);
        return (minutes < 10 ? "" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }
    
    _initScore() {
        let textStyle = new TextStyle({ fontSize: 45, align: "center", fill: 0xe6b85f, fontWeight: "bold", fontFamily: "Comic Sans MS" });
        this.scoreText = new Text(`0`, textStyle);
        this.scoreText.anchor.set(0);
        this.addChild(this.scoreText);
    }

    _initAppleCount() {
        this.appleScore = new Container();
        this.addChild(this.appleScore);

        let textStyle = new TextStyle({ fontSize: 40, align: "center", fill: 0xe6b85f, fontWeight: "bold", fontFamily: "Comic Sans MS" });
        this.appleText = new Text(`0`, textStyle);
        this.appleText.anchor.set(1, 0);
        this.appleText.position.set(0, 7);
        this.appleSprite = Sprite.from(Game.bundle.apple_slice_1);
        this.appleSprite.scale.set(0.8);
        this.appleSprite.position.set(60, 10);
        this.appleSprite.angle = 90;
        this.appleScore.addChild(this.appleText);
        this.appleScore.addChild(this.appleSprite);
    }

    _initKnifeCount() {
        this.knifeIcons = [];
        this.knifeIconsContainer = new Container();
        this.addChild(this.knifeIconsContainer);

        for (let i = 0; i < Level1.KNIFE_NUMBER; i++) {
            let knife = Sprite.from(Game.bundle.knife_white_icon);
            knife.y = i * 45;
            this.knifeIcons.push(knife);
            this.knifeIconsContainer.addChild(knife);
        }
    }
    
    updateScore(score) {
        this.scoreText.text = `${score}`;
    }

    updateAppleScore(apple) {
        this.appleText.text = `${apple}`;
    }

    updateKnifeIcon(index) {
        this.knifeIcons.at(index).texture = Game.bundle.knife_black_icon;
    }
    
    updateTime(dt) {
        this.playTime += dt;
        this.timerText.text = `${this._formatTime(this.playTime)}`;
    }
    
    hide() {
        this.visible = false;
    }
    
    show() {
        this.visible = true;
    }

    resize() {
        this.timerText.x = GameConstant.GAME_WIDTH/2;
        this.timerText.y = 10;
        this.scoreText.x = 50;
        this.scoreText.y = 10;
        this.appleScore.x = GameConstant.GAME_WIDTH - 70;
        this.appleScore.y = 10
        this.knifeIconsContainer.x = 30;
        this.knifeIconsContainer.y = 1150 - this.knifeIconsContainer.height;
      }
}