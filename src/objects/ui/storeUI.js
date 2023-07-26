import { Container, Sprite, Text, TextStyle } from "pixi.js";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helper/utils";

export class StoreUI extends Container {
  constructor() {
    super();
    this._initAppleCount();
    this._initBackButton();
    this.resize();
  }

  _initAppleCount() {
    this.appleScore = localStorage.getItem('appleScore');
    this.appleScoreContainer = new Container();
    this.addChild(this.appleScoreContainer);

    let textStyle = new TextStyle({
      fontSize: 40,
      align: "center",
      fill: 0xe6b85f,
      fontWeight: "bold",
      fontFamily: "Comic Sans MS",
    });
    //text 
    this.appleText = new Text(`${this.appleScore}`, textStyle);
    this.appleText.anchor.set(1, 0);
    this.appleText.position.set(0, 7);

    //sprite
    this.appleSprite = Sprite.from(Game.bundle.apple_slice_1);
    this.appleSprite.scale.set(0.8);
    this.appleSprite.position.set(60, 10);
    this.appleSprite.angle = 90;
    this.appleScoreContainer.addChild(this.appleText);
    this.appleScoreContainer.addChild(this.appleSprite);
  }

  _initBackButton() {
    this.backButton = new Sprite(Game.bundle.backHomeButton);
    this.backButton.scale.set(0.3);
    this.addChild(this.backButton);
    Util.registerOnPointerDown(this.backButton, this._onTapBackButton, this);
  }

  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  resize() {
    this.appleScoreContainer.x = GameConstant.GAME_WIDTH - 70;
    this.appleScoreContainer.y = 10;
  }
  
  _onTapBackButton() {
    this.hide();
  }
}
