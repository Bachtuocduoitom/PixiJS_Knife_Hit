import { Container, Sprite, Text, TextStyle } from "pixi.js";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Level1 } from "../scenes/playScene";

export class PlayUI extends Container {
    constructor(data, score, appleScore) {
        super();
        this.levelData = data;
        this.playTime = 0;
        this.score = score;
        this.appleScore = appleScore;
        this._initLevel();
        this._initScore();
        this._initAppleCount();
        this._initKnifeCount();
        this.resize();
    }

    _initLevel() {
        let textStyle = new TextStyle({ fontSize: 45, align: "center", fill: 0xe6b85f, fontWeight: "bold", fontFamily: "Comic Sans MS" });
        this.levelText = new Text(`Level ${this.levelData.currentLevel}`, textStyle);
        this.levelText.anchor.set(0.5, 0);
        this.addChild(this.levelText);
    }

    _initScore() {
        let textStyle = new TextStyle({ fontSize: 45, align: "center", fill: 0xe6b85f, fontWeight: "bold", fontFamily: "Comic Sans MS" });
        this.scoreText = new Text(`${this.score}`, textStyle);
        this.scoreText.anchor.set(0);
        this.addChild(this.scoreText);
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
    
    updateScore(score) {
        this.scoreText.text = `${score}`;
    }

    updateAppleScore(apple) {
        this.appleText.text = `${apple}`;
    }

    updateKnifeIcon(index) {
        this.knifeIcons.at(index).texture = Game.bundle.knife_black_icon;
    }
    
    hide() {
        this.visible = false;
    }
    
    show() {
        this.visible = true;
    }

    resize() {
        this.levelText.x = GameConstant.GAME_WIDTH/2;
        this.levelText.y = 10;
        this.scoreText.x = 50;
        this.scoreText.y = 10;
        this.appleScoreContainer.x = GameConstant.GAME_WIDTH - 70;
        this.appleScoreContainer.y = 10
        this.knifeIconsContainer.x = 30;
        this.knifeIconsContainer.y = 1150 - this.knifeIconsContainer.height;
      }
}