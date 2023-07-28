import { Container, Sprite, Text, TextStyle, Texture, FederatedPointerEvent } from "pixi.js";
import { Game } from "../../game";
import { Util } from "../../helper/utils";
import { GameConstant } from "../../gameConstant";
import { KnifeShopUI } from "./knifeShopUI";
import * as TWEEN from "@tweenjs/tween.js";
import { Sound } from "@pixi/sound";
export class MenuUI extends Container{
  constructor() {
    super();
    this.currentTime = 0;
    this._initNormalModeButton();
    this._initDualModeButton();
    this._initShopButton();
    this._initSettingButton();
    this._initFaceBookButton();
    this.resize();
    this.sortableChildren = true;
    this.clickSound = Sound.from(Game.bundle.click);
  }

  _initNormalModeButton() {
    this.norModeButton = new Sprite(Game.bundle.greenButton);
    this.norModeButton.width = 240;
    this.norModeButton.height = 90; 
    this.norModeButton.eventMode = 'static';
    this.norModeButton.zIndex = 0;
    
    // Text
    this.norModeButtonText = new Text("PLAY", {
      fontSize: 50,
      fill: "#FFFFFF",
      fontWeight: "bold",
      fontFamily: Game.bundle.comicSans.family
    });
    this.norModeButtonText.zIndex = 10;
    this.norModeButtonText.anchor.set(0.5);
    
    this.addChild(this.norModeButton);
    this.addChild(this.norModeButtonText);

    Util.registerOnPointerDown(this.norModeButton, this._onTapNorModeButton, this);
  }

  _initDualModeButton() {
    this.dualModeButton = new Sprite(Game.bundle.redpinkButton);
    this.dualModeButton.width = 240;
    this.dualModeButton.height = 90; 
    this.dualModeButton.eventMode = 'static';
    this.dualModeButton.zIndex = 0;

    // Text
    this.dualModeButtonText = new Text("PvP", {
      fontSize: 50,
      fill: "#FFFFFF",
      fontWeight: "bold",
      fontFamily: Game.bundle.comicSans.family
    });
    this.dualModeButtonText.zIndex = 10;
    this.dualModeButtonText.anchor.set(0.5);
    
    this.addChild(this.dualModeButton);
    this.addChild(this.dualModeButtonText);

    Util.registerOnPointerDown(this.dualModeButton, this._onTapDualModeButton, this);
  }

  _initShopUI() {
    this.shopUI = new KnifeShopUI();
    this.addChild(this.shopUI);
    this.shopUI.hide();
    this.shopUI.zIndex = 100;
  }

  _initShopButton () {
    this.shopButton = new Sprite(Game.bundle.shopIcon);
    this.shopButton.zIndex = 10;
    this.addChild(this.shopButton);
    this.shopButton.alpha = 0.8;
    Util.registerOnPointerDown(this.shopButton, this._onTapShopButton, this);

    this._initShopUI();
  }

  _onTapShopButton() {
    this.clickSound.play();
    this.norModeButton.visible = false;
    this.dualModeButton.visible = false;
    this.shopUI.show();
  }

  onShopUIBack() {
    this.norModeButton.visible = true;
    this.dualModeButton.visible = true;
    this.emit("change skin");
  }
  
  _initSettingButton() {
    this.settingButton = new Sprite(Game.bundle.settingIcon);
    this.settingButton.alpha = 0.8;
    this.addChild(this.settingButton);
  }

  _initFaceBookButton() {
    this.facebookButton = new Sprite(Game.bundle.fbIcon);
    this.facebookButton.alpha = 0.8;
    this.addChild(this.facebookButton);
  }


  updateUI(dt) {
    this.currentTime += dt;
    TWEEN.update(this.currentTime);
  }

  _onTapDualModeButton() {
    this.emit("dual button tapped");
  }

  _onTapNorModeButton() {
    this.emit("normal button tapped");
  }

  resize() {
    this.norModeButton.x = GameConstant.GAME_WIDTH / 2 - this.norModeButton.width - 30;
    this.norModeButton.y = GameConstant.GAME_HEIGHT - this.norModeButton.height - 300;

    this.norModeButtonText.x = this.norModeButton.x + this.norModeButton.width/2;
    this.norModeButtonText.y = this.norModeButton.y + this.norModeButton.height/2;

    this.dualModeButton.x = GameConstant.GAME_WIDTH / 2 + 30;
    this.dualModeButton.y = GameConstant.GAME_HEIGHT - this.norModeButton.height - 300;

    this.dualModeButtonText.x = this.dualModeButton.x + this.dualModeButton.width/2;
    this.dualModeButtonText.y = this.dualModeButton.y + this.dualModeButton.height/2;

    this.shopButton.x = GameConstant.GAME_WIDTH /2 - this.shopButton.width / 2;
    this.shopButton.y = GameConstant.GAME_HEIGHT -  250;

    this.settingButton.x = GameConstant.GAME_WIDTH /4;
    this.settingButton.y = GameConstant.GAME_HEIGHT -  250;

    this.facebookButton.x = GameConstant.GAME_WIDTH /1.5;
    this.facebookButton.y = GameConstant.GAME_HEIGHT -  250;
  }

  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }
}