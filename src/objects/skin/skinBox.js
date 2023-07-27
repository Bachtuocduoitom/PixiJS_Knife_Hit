import { Assets, Container, Sprite, Text, TextStyle } from "pixi.js";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helper/utils";

export class SkinBox extends Container {
  constructor(position) {
    super();
    this.position = position;
    this.data = JSON.parse(localStorage.getItem('skinBoxData'))[position - 1];
    this.state = this.data.state;
    this.skin = this.data.skin;
    this.width = 170;
    this.height = 170;
    this.alpha = 0.5;   
    this._initBackGround();
    this._initSkin();
    Util.registerOnPointerDown(this, this._onTap, this);
    
  }

  _initBackGround() {
    this.background = new Sprite(Game.bundle.square);
    this.addChild(this.background);
  }

  _initSkin() {
    this.skinKnife = new Sprite(Assets.get(this.skin));
    this.skinKnife.rotation = Math.PI/4;
    this.skinKnife.anchor.set(0.5);
    this.skinKnife.x = this.width/2;
    this.skinKnife.y = this.height/2;
    this.addChild(this.skinKnife);
  }

  _onTap() {
    this.alpha = 1;
    this.state = "selected";
    this.data.state = "selected";

  }

}
