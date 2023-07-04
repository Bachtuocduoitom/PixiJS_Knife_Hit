import { AnimatedSprite, Container, Graphics, Sprite, Text, Texture } from "pixi.js";
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
    this.resize();
    this.sortableChildren = true;
  }

  _initOverLay() {
    this.overlay = new Graphics();
    this.overlay.beginFill(0x000000, 0.5);
    this.overlay.drawRect(0, 0, GameConstant.GAME_WIDTH, GameConstant.GAME_HEIGHT);
    this.overlay.endFill();
    this.overlay.interactive = true;
    this.overlay.buttonMode = true;
    this.addChild(this.overlay);
  }
 _initBox() {
    // Hộp chính
    this.box = new Sprite(Game.bundle.resultGameBg);
    this.box.width = 600;
    this.box.height = 400;
    this.box.opacity = 0.6;
    this.addChild(this.box);
    // const gifTexture = Texture.from('../assets/images/victory.gif');
    // this.box = new AnimatedSprite([gifTexture]);
    // // Thiết lập vị trí và kích thước của this.box
    // this.box.width = 400;
    // this.box.height =400;
    // // Thêm this.box vào stage
    // this.addChild(this.box);
    // // Bắt đầu phát lại hình ảnh chuyển động
    // this.box.play();
    }
 _initMessage() {
    // Message
    this.messageText = new Text('You win', {
        fontSize: 80,
        fill: "#ADFF2F",
        fontWeight: "bold",
        textAlign: "center",
        fontFamily : "verdana",
    });
    this.messageText.zIndex = 100;
    this.addChild(this.messageText);
 }
 _initButton() {
    // option 1
    this.button = new Sprite(Game.bundle.bgButton);
    this.button.width = 300;
    this.button.height = 80;   
    this.button.interactive = true;
    this.button.buttonMode = true;
    this.button.zIndex = 0;
    // Thêm văn bản cho option 1
    this.buttonText = new Text("Tiếp tục", {
      fontSize: 40,
      fill: "#FFFFFF",
      fontWeight: "bold",
    });
    this.buttonText.zIndex = 100;
    this.addChild(this.button);
    this.addChild(this.buttonText);
    Util.registerOnPointerDown(this.button, this._onTapButton, this);
 }
  _onTapButton() {
    this.emit("tapped");
  }
  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }
  resize(){
    this.box.x = GameConstant.GAME_WIDTH - this.box.width - 60;
    this.box.y = (GameConstant.GAME_HEIGHT - this.box.height) / 2 - this.box.height /6;

    this.messageText.x = GameConstant.GAME_WIDTH /2 - this.messageText.width /2;
    this.messageText.y =this.box.y + this.box.y / 4 ;

    this.button.x = this.box.x /2 + this.button.width /1.6  ;
    this.button.y = 2 * this.box.y - 1.5 * this.button.height;

    this.buttonText.x = GameConstant.GAME_WIDTH /2 - this.buttonText.width /2;
    this.buttonText.y = GameConstant.GAME_HEIGHT /2;
  }
}