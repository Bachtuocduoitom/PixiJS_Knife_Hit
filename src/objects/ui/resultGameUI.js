import {
  AnimatedSprite,
  Container,
  Graphics,
  Sprite,
  Text,
  Texture,
} from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { manifest } from "../../manifest";
import { Game } from "../../game";
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import { Util } from "../../helper/utils";
export class ResultGameUI extends Container {
  constructor() {
    super();
    this._initOverLay();
    this._initBox();
    this._initMessage();
    this._initButton();
    this._initHomeButton()
    this.resize();
    this.sortableChildren = true;
  }

  _initOverLay() {
    this.overlay = new Graphics();
    this.overlay.beginFill(0x000000, 0.5);
    this.overlay.drawRect(0,0,GameConstant.GAME_WIDTH,GameConstant.GAME_HEIGHT);
    this.overlay.endFill();
    this.overlay.eventMode = 'static';
    this.addChild(this.overlay);
  }
  _initBox() {
    // Hộp chính
    this.box = new Sprite(Game.bundle.resultGameBg);
    this.box.width = 600;
    this.box.height = 400;
    this.box.opacity = 0.6;
    this.addChild(this.box);
  }

  _initMessage() {
    // Message
    this.messageText = new Text("You win", {
      fontSize: 80,
      fill: "#ADFF2F",
      fontWeight: "bold",
      align: "center",
      fontFamily: "Comic Sans MS",
    });
    this.messageText.zIndex = 100;
    this.addChild(this.messageText);
  }
  _initButton() {
    // option 1
    this.button = new Sprite(Game.bundle.greenButton);
    this.button.width = 200;
    this.button.height = 80;   
    this.button.anchor.set(0.5);
    this.button.eventMode = 'static';
    this.button.zIndex = 0;
    // Thêm văn bản cho option 1
    this.buttonText = new Text("Next", {
      fontSize: 40,
      fill: "#FFFFFF",
      fontWeight: "bold",
      align : "center",
      fontFamily: "Comic Sans MS",
    });
    this.buttonText.zIndex = 100;
    this.buttonText.anchor.set(0.5);
    this.addChild(this.button);
    this.addChild(this.buttonText);
    Util.registerOnPointerDown(this.button, this._onTapButton, this);
 }

  _onTapButton() {
    this.emit("tapped");
  }

  _initHomeButton() {
    // option 1
    this.homeButton = new Sprite(Game.bundle.blueButton);
    this.homeButton.width = 200;
    this.homeButton.height = 80;   
    this.homeButton.anchor.set(0.5);
    this.homeButton.eventMode = 'static';
    this.homeButton.zIndex = 0;
    // Thêm văn bản cho option 1
    this.homeButtonText = new Text("Home", {
      fontSize: 40,
      fill: "#FFFFFF",
      fontWeight: "bold",
    });
    this.homeButtonText.zIndex = 100;
    this.homeButtonText.anchor.set(0.5);
    this.addChild(this.homeButton);
    this.addChild(this.homeButtonText);
    Util.registerOnPointerDown(this.homeButton, this._onTapHomeButton, this);
 }

  _onTapHomeButton() {
    this.emit("home");
  }


  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  resize(){
    this.box.x = GameConstant.GAME_WIDTH - this.box.width - 60;
    this.box.y =
      (GameConstant.GAME_HEIGHT - this.box.height) / 2 - this.box.height / 6;

    this.messageText.x = this.box.width / 2 - this.messageText.width / 3.2;
    this.messageText.y = this.box.y + this.box.y / 4;

    this.homeButton.x = this.box.x/2 + this.homeButton.width  ;
    this.homeButton.y = this.box.y + this.box.height/2 +  this.homeButton.height + 30;

    this.homeButtonText.x = this.homeButton.x;
    this.homeButtonText.y = this.homeButton.y;
    
    this.button.x = this.box.x/2 + this.box.width/2 +  this.button.width - 50;
    this.button.y = this.box.y + this.box.height/2 +  this.button.height + 30;

    this.buttonText.x = this.button.x;
    this.buttonText.y = this.button.y;
  }

  showLoseBox() {
    this.show();
    this.messageText.text = "You lose";
    this.buttonText.text = "Replay";
    this.messageText.style.fill = "red";

    this.button.texture = Game.bundle.redpinkButton;
  }
}
