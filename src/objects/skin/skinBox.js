import { Assets, Container, Sprite, Text, TextStyle } from "pixi.js";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helper/utils";

export class SkinBox extends Container {
  constructor(position) {
    super();
    this.pos = position;
    this.data = JSON.parse(localStorage.getItem(`skinBox${this.pos}Data`));
    this.state = this.data.state;
    this.skin = this.data.skin;
    this.cost = this.data.cost;
    this.width = 170;
    this.height = 170;
    this.alpha = 0.7;   
    this.eventMode = 'static';
    this._initBackGround();
    this._initSkin();
    //Util.registerOnPointerDown(this, this._onTap, this);
    
  }

  _initBackGround() {
    this.background = new Sprite(Game.bundle.square);
    this.addChild(this.background);
  }

  _initSkin() {
    this.skinKnife = new Sprite(Assets.get(this.skin));
    this.skinKnife.rotation = Math.PI/4;
    this.skinKnife.anchor.set(0.5);
    this.skinKnife.scale.set(0.7);
    this.skinKnife.x = this.width/2;
    this.skinKnife.y = this.height/2;
    this.addChild(this.skinKnife);
  }

  _onTap() {
    this.alpha = 1;
    this.onSelected();
  }

  onBuy() {
    this.alpha = 1;
    this.onSelected();
  }

  onSelected() {
    this.state = "selected";
    this.background.texture = Game.bundle.squareSelected;

    //change state on localstorage
    let newSkinBoxData = {state: "selected", skin: `knife${this.pos}`, cost: 10};
    localStorage.setItem(`skinBox${this.pos}Data`, JSON.stringify(newSkinBoxData));
  }

  onDeselect() {
    this.state = "unlock";
    this.background.texture = Game.bundle.square;

    //change state on localstorage
    let newSkinBoxData = {state: "unlock", skin: `knife${this.pos}`, cost: 10};
    localStorage.setItem(`skinBox${this.pos}Data`, JSON.stringify(newSkinBoxData));
  }

  canBuy() {
    if (localStorage.getItem('appleScore') >= this.cost) {
      return true;
    } else {
      return false;
    }
  }

}
