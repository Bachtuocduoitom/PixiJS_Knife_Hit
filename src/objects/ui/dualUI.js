import { Container, Sprite, Text, TextStyle } from "pixi.js";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helper/utils";

export class DualUI extends Container {
  constructor(data, score, appleScore, score2, appleScore2) {
    super();
    this.playTime = 0;
    this.levelData = data;
    this.score = score;
    this.score2 = score2;
    this.appleScore = appleScore;
    this.appleScore2 = appleScore2;
    this._initScore();
    this._initScore2();
    this._initIconPlayer();
    this._initAppleCount();
    this._initAppleCount2();
    this._initKnifeCount();
    this._initKnifeCount2();
    this._initBackHomeButton();
    this.resize();
  }

  _initScore() {
    let textStyle = new TextStyle({
      fontSize: 45,
      align: "center",
      fill: 0xe6b85f,
      fontWeight: "bold",
      fontFamily: "Comic Sans MS",
    });
    this.scoreText = new Text(`${this.score}`, textStyle);
    this.scoreText.anchor.set(0);
    this.addChild(this.scoreText);
  }

  _initBackHomeButton() {
    this.backHomeButton = new Sprite(Game.bundle.backHomeButton);
    this.backHomeButton.scale.set(0.3);
    this.backHomeButton.rotation = Math.PI / 4;
    this.addChild(this.backHomeButton);
    Util.registerOnPointerDown(
      this.backHomeButton,
      this._onTapBackHomeButton,
      this
    );
  }

  _onTapBackHomeButton() {
    this.emit("backHome");
  }

  _initScore2() {
    let textStyle = new TextStyle({
      fontSize: 45,
      align: "center",
      fill: 0xe6b85f,
      fontWeight: "bold",
      fontFamily: "Comic Sans MS",
    });
    this.scoreText2 = new Text(`${this.score2}`, textStyle);
    this.scoreText2.anchor.set(0);
    this.scoreText2.rotation = Math.PI;
    this.addChild(this.scoreText2);
  }

  _initIconPlayer() {
    this.iconPlayer1Cont = new Container();
    this.iconPlayer1 = Sprite.from(Game.bundle.iconPlayer);
    let textStyle = new TextStyle({
      fontSize: 18,
      align: "center",
      fill: 0xffffff,
      fontWeight: "bold",
      fontFamily: "Comic Sans MS",
    });
    this.player1Text = new Text(`Player1`, textStyle);
    this.player1Text.anchor.set(0, 1);
    this.iconPlayer1Cont.addChild(this.iconPlayer1, this.player1Text);
    this.iconPlayer1.scale.set(0.3);
    this.iconPlayer1Cont.rotation = Math.PI;

    this.iconPlayer2Cont = new Container();
    this.iconPlayer2 = Sprite.from(Game.bundle.iconPlayer);
    this.player2Text = new Text(`Player2`, textStyle);
    this.player2Text.anchor.set(0, 1);
    this.iconPlayer2Cont.addChild(this.iconPlayer2, this.player2Text);
    this.iconPlayer2.scale.set(0.3);

    this.addChild(this.iconPlayer1Cont, this.iconPlayer2Cont);
  }

  _initAppleCount() {
    this.appleScoreContainer = new Container();
    this.addChild(this.appleScoreContainer);
    let textStyle = new TextStyle({
      fontSize: 40,
      align: "center",
      fill: 0xe6b85f,
      fontWeight: "bold",
      fontFamily: "Comic Sans MS",
    });
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
    let textStyle = new TextStyle({
      fontSize: 40,
      align: "center",
      fill: 0xe6b85f,
      fontWeight: "bold",
      fontFamily: "Comic Sans MS",
    });
    this.appleText2 = new Text(`${this.appleScore2}`, textStyle);
    this.appleText2.anchor.set(1, 0);
    this.appleText2.position.set(0, 7);
    this.appleSprite = Sprite.from(Game.bundle.apple_slice_1);
    this.appleSprite.scale.set(0.8);
    this.appleSprite.position.set(60, 10);
    this.appleSprite.angle = 90;
    this.appleScoreContainer2.addChild(this.appleText2);
    this.appleScoreContainer2.addChild(this.appleSprite);
    this.appleScoreContainer2.rotation = Math.PI;
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
    this.knifeIconsContainer2.rotation = Math.PI;
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
    this.scoreText.x = 50;
    this.iconPlayer1Cont.x = GameConstant.GAME_WIDTH - 50;
    this.iconPlayer1Cont.y = GameConstant.GAME_HEIGHT - 131;
    this.scoreText.y = GameConstant.GAME_HEIGHT - 70;
    this.appleScoreContainer.x = GameConstant.GAME_WIDTH - 110;
    this.appleScoreContainer.y = GameConstant.GAME_HEIGHT - 70;
    this.knifeIconsContainer.x = 30;
    this.knifeIconsContainer.y = 1150 - this.knifeIconsContainer.height;
    // this.backHomeButton.y = GameConstant.GAME_HEIGHT /2 - 50;
    this.backHomeButton.y = 300;
    this.backHomeButton.x = 80;

    this.scoreText2.x = 80;
    this.scoreText2.y = 75;
    this.iconPlayer2Cont.x = 50;
    this.iconPlayer2Cont.y = 150;
    this.appleScoreContainer2.x = GameConstant.GAME_WIDTH - 80;
    this.appleScoreContainer2.y = 75;
    this.knifeIconsContainer2.x = GameConstant.GAME_WIDTH - 30;
    this.knifeIconsContainer2.y =
      this.knifeIconsContainer2.height + this.knifeIconsContainer2.height / 2;
  }
}
