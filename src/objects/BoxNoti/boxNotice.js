import { Container, Graphics, Sprite, Text } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { manifest } from "../../manifest";
import { Game } from "../../game";
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
export class BoxNotice extends Container {
  constructor() {
    super();
    this.overlay = new Graphics();
    this.overlay.beginFill(0x000000, 0.7);
    this.overlay.drawRect(0, 0, GameConstant.GAME_WIDTH, GameConstant.GAME_HEIGHT);
    this.overlay.endFill();
    this.overlay.interactive = true;
    this.overlay.buttonMode = true;
    this.sortableChildren = true;
    // Hộp chính
    const box = new Graphics();
    // box.lineStyle(4, 0xffffff, 1);
    box.beginFill(0x483D8B, 0.1);
    box.drawRect(0, 0, 600, 400);
    box.endFill();
    box.x = (GameConstant.GAME_WIDTH - box.width) / 2;
    box.y = (GameConstant.GAME_HEIGHT - box.height) / 2 - box.height /3;
    // Message
    this.messageText = new Text('You win', {
        fontSize: 70,
        fill: "#ADFF2F",
        fontWeight: "bold",
        textAlign: "center",
        fontFamily : "verdana",
    });
    this.messageText.x =box.x + this.messageText.width /2.3;
    this.messageText.y =box.y + box.y / 3 ;
    // option 1
    this.button = new Sprite(Game.bundle.bgButton);
    this.button.width = 400;
    this.button.height = 100;
    this.button.x = box.x /2 + this.button.width /3;
    this.button.y = 2 * box.y - this.button.height/2;
    this.button.interactive = true;
    this.button.buttonMode = true;
    this.button.zIndex = 0;
    // Thêm văn bản cho option 1
    this.buttonText = new Text("Tiếp tục", {
      fontSize: 35,
      fill: "#FF4500",
      fontWeight: "bold",
    });
    this.buttonText.zIndex = 100;
    this.buttonText.x = this.button.x +  this.buttonText.width + 5 ;
    this.buttonText.y = this.button.y + this.button.height/3 ;
    this.button.addChild(this.buttonText);

    //tạo animation win
    // this.winParticle = new Emitter(this.particleContainer, upgradeConfig(Game.bundle.victoryParticle, [Game.bundle.particle]));
    // this.winParticle.playOnceAndDestroy();
    this.addChild(this.overlay, box, this.messageText, this.buttonText, this.button);
  }
}

