import { Container, Sprite, Text, TextStyle } from "pixi.js";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Level1 } from "../scenes/playScene";

export class PlayUI extends Container {
    constructor(data, score, appleScore, score2, appleScore2) {
        super();
        this.levelData = data;
        this.playTime = 0;
        this.score = score;
        this.score2 = score2;
        this.appleScore = appleScore;
        this.appleScore2 = appleScore2;
        this._initLevel();
        this._initTimer();
        this._initScore();
        this._initScore2();
        this._initAppleCount();
        this._initAppleCount2();
        this._initKnifeCount();
        this._initKnifeCount2();
        this.resize();
    }

    _initLevel() {
        let textStyle = new TextStyle({ fontSize: 45, align: "center", fill: 0xe6b85f, fontWeight: "bold", fontFamily: "Comic Sans MS" });
        this.levelText = new Text(`Level ${this.levelData.currentLevel}`, textStyle);
        this.levelText.anchor.set(0.5, 0);
        this.addChild(this.levelText);
    }

    _initTimer() {
        let textStyle = new TextStyle({ fontSize: 45, align: "center", fill: 0xe6b85f, fontWeight: "bold", fontFamily: "Comic Sans MS" });
        this.timerText = new Text(`${this._formatTime(0)}`, textStyle);
        this.timerText.anchor.set(0.5, 0);
        //this.addChild(this.timerText);
    }

    _formatTime(totalSeconds) {
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = Math.floor(totalSeconds % 60);
        var milliseconds = Math.floor((totalSeconds % 1) * 100);
        return (minutes < 10 ? "" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }
    
    _initScore() {
        let textStyle = new TextStyle({ fontSize: 45, align: "center", fill: 0xe6b85f, fontWeight: "bold", fontFamily: "Comic Sans MS" });
        this.scoreText = new Text(`${this.score}`, textStyle);
        this.scoreText.anchor.set(0);
        this.addChild(this.scoreText);
    }
    _initScore2() {
        let textStyle = new TextStyle({ fontSize: 45, align: "center", fill: 0xe6b85f, fontWeight: "bold", fontFamily: "Comic Sans MS" });
        this.scoreText2 = new Text(`${this.score2}`, textStyle);
        this.scoreText2.anchor.set(0);
        this.addChild(this.scoreText2);
    }
    _initAppleCount() {
        this.appleScoreContainer = new Container();
        this.addChild(this.appleScoreContainer);

        let textStyle = new TextStyle({ fontSize: 40, align: "center", fill: 0xe6b85f, fontWeight: "bold", fontFamily: "Comic Sans MS" });
        this.appleText = new Text(`${this.appleScore}`, textStyle);
        this.appleText.anchor.set(1, 0);
        this.appleText.position.set(0, 7);
        this.appleSprite = Sprite.from(Game.bundle.apple_slice_1);
        this.appleSprite.scale.set(0.8);
        this.appleSprite.position.set(60, 10);
        this.appleSprite.angle = 90;
        this.appleScoreContainer.addChild(this.appleText);
        this.appleScoreContainer.addChild(this.appleSprite);
    }
    _initAppleCount2() {
        this.appleScoreContainer2 = new Container();
        this.addChild(this.appleScoreContainer2);

        let textStyle = new TextStyle({ fontSize: 40, align: "center", fill: 0xe6b85f, fontWeight: "bold", fontFamily: "Comic Sans MS" });
        this.appleText2 = new Text(`${this.appleScore2}`, textStyle);
        this.appleText2.anchor.set(1, 0);
        this.appleText2.position.set(0, 7);
        this.appleSprite = Sprite.from(Game.bundle.apple_slice_1);
        this.appleSprite.scale.set(0.8);
        this.appleSprite.position.set(60, 10);
        this.appleSprite.angle = 90;
        this.appleScoreContainer2.addChild(this.appleText2);
        this.appleScoreContainer2.addChild(this.appleSprite);
    }
    _initKnifeCount() {
        this.knifeIcons = [];
        this.knifeIconsContainer = new Container();
        this.addChild(this.knifeIconsContainer);

        for (let i = 0; i < this.levelData.numOfKnife(); i++) {
            let knife = Sprite.from(Game.bundle.knife_white_icon);
            knife.y = i * 45;
            this.knifeIcons.push(knife);
            this.knifeIconsContainer.addChild(knife);
        }
    }
    _initKnifeCount2() {
        this.knifeIcons2 = [];
        this.knifeIconsContainer2 = new Container();
        this.addChild(this.knifeIconsContainer2);

        for (let i = 0; i < this.levelData.numOfKnife(); i++) {
            let knife2 = Sprite.from(Game.bundle.knife_white_icon);
            knife2.y = i * 45;
            this.knifeIcons2.push(knife2);
            this.knifeIconsContainer2.addChild(knife2);
        }
    }
    updateScore(score) {
        this.scoreText.text = `${score}`;
    }
    updateScore2(score2) {
        this.scoreText2.text = `${score2}`;
    }
    updateAppleScore(apple) {
        this.appleText.text = `${apple}`;
    }
    updateAppleScore2(apple2) {
        this.appleText2.text = `${apple2}`;
    }
    updateKnifeIcon(index) {
        this.knifeIcons.at(index).texture = Game.bundle.knife_black_icon;
    }
    updateKnifeIcon2(index) {
        this.knifeIcons2.at(index).texture = Game.bundle.knife_black_icon;
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
        this.levelText.x = GameConstant.GAME_WIDTH/2;
        this.levelText.y = 10;
        this.scoreText.x = 50;
        this.scoreText.y = GameConstant.GAME_HEIGHT -70;
        this.appleScoreContainer.x = GameConstant.GAME_WIDTH - 70;
        this.appleScoreContainer.y = GameConstant.GAME_HEIGHT -70;
        this.knifeIconsContainer.x = 30;
        this.knifeIconsContainer.y = 1150 - this.knifeIconsContainer.height;

        this.scoreText2.x = 50;
        this.scoreText2.y = 10;
        this.appleScoreContainer2.x = GameConstant.GAME_WIDTH - 70;
        this.appleScoreContainer2.y = 10
        this.knifeIconsContainer2.x = GameConstant.GAME_WIDTH - 60;
        this.knifeIconsContainer2.y = this.knifeIconsContainer2.height - this.knifeIconsContainer2.height /2;
      }
}