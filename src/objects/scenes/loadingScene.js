import { Container, Sprite, Graphics, Text } from "pixi.js";

import { GameConstant } from "../../gameConstant";
import { Game } from "../../game";
import { Board } from "../boards/board";
import * as TWEEN from "@tweenjs/tween.js";

export class LoadingScene extends Container {  
  constructor() {
    super();
    // Tạo một biến giả lập để cập nhật giá trị của thanh loading
    this.progress = 0;
    this.speed = 1.5;
    this.currentTime = 0;
    this._initProgressbar();
    this._initKnifeLoad(); 
    this._initBackground();
    this._initText();
    this._initBoard();
    this.sortableChildren = true;
  }

  _initText() {
    this.textLoad = new Text("Loading...", {
      fontSize: 30,
      fill: "#FF8C00",
      fontWeight: "bold",
      align: "center",
      fontFamily: "Comic Sans MS",
    });
    
    this.addChild(this.textLoad);
    this.textLoad.x = GameConstant.GAME_WIDTH /2 - this.textLoad.width /2;
    this.textLoad.y = GameConstant.GAME_HEIGHT / 2 - 2.5 * this.textLoad.height;
    this.textLoad.zIndex= 100;
  }

  _initBoard() {
    this.boardBg = new Sprite(Game.bundle.board);
    this.boardBg.anchor.set(0.5);
    this.boardBg.zIndex = 50;
    this.boardBg.scale.set(0.7);
    this.boardBg.alpha = 0.9;
    this.boardBg.x = GameConstant.GAME_WIDTH /2;
    this.boardBg.y = GameConstant.GAME_HEIGHT/2 - this.boardBg.height; 
    this.addChild(this.boardBg);
  }

  _initBackground() {
    this.background = new Sprite(Game.bundle.backgroundLoading);
    this.background.x = 0;
    this.background.y = 0;
    this.background.width = GameConstant.GAME_WIDTH;
    this.background.height = GameConstant.GAME_HEIGHT; 
    this.addChild(this.background);
    this.background.zIndex = 0;
  }

  // Tạo loading bar
  _initProgressbar() {
    this.loadingBar = new Graphics();
    this.loadingBar.beginFill(0xFF4500);
    this.loadingBar.drawRect(0, 0, 4, 20);
    this.loadingBar.endFill();
    this.loadingBar.x = GameConstant.GAME_WIDTH /3.8;
    this.loadingBar.y = GameConstant.GAME_HEIGHT / 2;
    this.addChild(this.loadingBar);
    this.loadingBar.zIndex= 100;
  }

  _initKnifeLoad() {
    this.knifeLoad = new Sprite(Game.bundle.knifeLoad);
    this.knifeLoad.scale.set(0.9, 1.0);
    this.knifeLoad.x = GameConstant.GAME_WIDTH /4;
    this.knifeLoad.y = GameConstant.GAME_HEIGHT / 2 - this.knifeLoad.height /2.4;
    this.addChild(this.knifeLoad);
    this.knifeLoad.zIndex = 100;
  }

  update(dt) {
    this.currentTime += dt;
    // TWEEN.update(this.currentTime);
    this.boardBg.rotation += 0.03;
    this.progress +=0.5;
    this.knifeLoad.x += this.speed *dt;
    this.loadingBar.scale.x = this.progress;
    if (this.progress >= 100) {
      console.log("loading done");
      this.removeChild(this.loadingBar, this.knifeLoad, this.textLoad, this.boardBg);
      this.progress = 0;
    } else {
    }
  }
}
