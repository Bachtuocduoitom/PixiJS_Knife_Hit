import { Container, Sprite, Text, TextStyle } from "pixi.js";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helper/utils";

export class KnifeItemUI extends Container {
  constructor() {
    super();
    this._initKnifeItem();
    this.resize();
  }

  _initKnifeItem() {
    this.item = new Graphics();
    this.addChild(this.item);
    this.item.lineStyle(10, 0xf3b23d);
    this.item.drawRoundedRect(0,0, GameConstant.ITEM_WIDTH, GameConstant.ITEM_HEIGHT);
  }
  _initSprite() {

  }

  resize() {
   
  }
}
