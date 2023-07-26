import { Container, Sprite, Text, TextStyle, Texture, FederatedPointerEvent } from "pixi.js";
import { Game } from "../../game";
import { Util } from "../../helper/utils";
import { GameConstant } from "../../gameConstant";
import * as TWEEN from "@tweenjs/tween.js";

export class MenuUI extends Container{
    constructor() {
      super();
      this.currentTime = 0;
      this._initNormalModeButton();
      this._initDualModeButton();
      this.resize();
      this.sortableChildren = true;
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
        fontFamily: "Comic Sans MS"
      });
      this.norModeButtonText.zIndex = 100;
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
        fontFamily: "Comic Sans MS"
      });
      this.dualModeButtonText.zIndex = 100;
      this.dualModeButtonText.anchor.set(0.5);
      
      this.addChild(this.dualModeButton);
      this.addChild(this.dualModeButtonText);

      Util.registerOnPointerDown(this.dualModeButton, this._onTapDualModeButton, this);
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

    }
  
    hide() {
      this.visible = false;
    }
  
    show() {
      this.visible = true;
    }
  }