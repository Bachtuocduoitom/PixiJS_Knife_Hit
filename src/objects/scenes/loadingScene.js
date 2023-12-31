import { Container, Sprite, Graphics, Text, Texture } from "pixi.js";

import { GameConstant } from "../../gameConstant";
import { Game } from "../../game";
import { Board } from "../boards/board";
import * as TWEEN from "@tweenjs/tween.js";

export class LoadingScene extends Container {  
  constructor() {
    super();
    this.currentDt = 0;
    this._initAdvertisement();
  }

  _initAdvertisement() {
    let imgLoad = document.getElementById("imgLoad");
    let texture = Texture.from(imgLoad)
    this.ads = Sprite.from(texture);
    this.ads.position.set(0, 0);
    this.ads.alpha = 0;
    this.addChild(this.ads);

    new TWEEN.Tween(this.ads).to({ alpha: 1 }, 50).start(this.currentDt);
  }
 
  update(dt) {
    this.currentDt += dt;
    TWEEN.update(this.currentDt);
  }

  onLoaded() {
    new TWEEN.Tween(this.ads).to({ alpha: 0 }, 50).onComplete(() => {
      setTimeout(() => {
        this.emit("loaded");
      }, 300)
    }).start(this.currentDt);
  }
}
