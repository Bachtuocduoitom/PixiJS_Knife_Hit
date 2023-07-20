import { Container, Sprite, Text, TextStyle, Texture, FederatedPointerEvent } from "pixi.js";
import { Game } from "../../game";
import { Util } from "../../helper/utils";
import { GameConstant } from "../../gameConstant";
import * as TWEEN from "@tweenjs/tween.js";

export class TutorialUI extends Container{
    constructor() {
      super();
      this.currentTime = 0;
      this._initFakeBackground();
      this._initText();
      this.resize();
    }
  
    _initFakeBackground() {
      this.fakeBg = new Sprite(null);
      this.fakeBg.alpha = 0.75;
      this.fakeBg.tint = 0x000000;
      this.addChild(this.fakeBg);
      Util.registerOnPointerDown(this.fakeBg, this._onTapBg, this);
    }
  
    _onTapBg() {
      this.emit("tapped");
    }
  
    _initText() {
      let textStyle = new TextStyle({ fontSize: 50, align: "center", fill: 0xffffff, fontFamily: "Comic Sans MS", fontWeight: "bold", dropShadow: true, dropShadowColor: 'black' });
      this.tutorialText = new Text("TAP TO PLAY", textStyle);
      this.tutorialText.anchor.set(0.5);
      this.addChild(this.tutorialText);
      this._startBlink();
    }

    updateUI(dt) {
      this.currentTime += dt;
      //TWEEN.update(this.currentTime);
    }

    _startBlink() {
      new TWEEN.Tween(this.tutorialText).to({alpha: 0}, 750).yoyo(true).repeat(Infinity).start();
    }

    resize() {
      this.fakeBg.width = GameConstant.GAME_WIDTH;
      this.fakeBg.height = GameConstant.GAME_HEIGHT;
      this.tutorialText.x = GameConstant.GAME_WIDTH / 2;
      this.tutorialText.y = GameConstant.GAME_HEIGHT / 2;
    }
  
    hide() {
      this.visible = false;
    }
  
    show() {
      this.visible = true;
    }
  }