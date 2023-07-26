import { Container, Sprite, Graphics, Text } from "pixi.js";

import { GameConstant } from "../../gameConstant";
import { Game } from "../../game";
import { Board } from "../boards/board";
import * as TWEEN from "@tweenjs/tween.js";
import { KnifeShopUI } from "../ui/shopUI/knifeShopUI";

export class ShopKnifeScene extends Container {
  constructor() {
    super();
    this._initBackGround();
    this._initShopUI();
  }

 

  _initBackGround() {
    this.shopBackGround = new Sprite(Game.bundle.bgShop);
    this.shopBackGround.x = 0;
    this.shopBackGround.y = 0;
    this.shopBackGround.width = GameConstant.GAME_WIDTH;
    this.shopBackGround.height = GameConstant.GAME_HEIGHT; 
    this.addChild(this.shopBackGround);
  }

  _initShopUI() {
    this.knifeShopUI = new KnifeShopUI();
    this.knifeShopUI.on("backHome", (e) => this._backHome(e));
    this.addChild(this.knifeShopUI);
  }

  _backHome(e) {
    this.parent.shopToHome();
  }

  update(dt) {
    this.currentTime += dt;
  }
}
