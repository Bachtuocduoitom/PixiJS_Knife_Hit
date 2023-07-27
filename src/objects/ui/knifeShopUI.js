import { Container, Sprite, Text, Graphics, TextStyle, Assets } from "pixi.js";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helper/utils";
import { SkinBox } from "../skin/skinBox";
import { Sound } from "@pixi/sound";
export class KnifeShopUI extends Container {
  constructor() {
    super();
    this.rows = 4;
    this.columns = 3;
    this.tablePadding = 8;
    this.skinBoxes = [];
    this._initShopData();
    this._initBackGround();
    this._initKnifeCurrent();
    this._initLighting();
    this._initContTable();
    this._initText();
    this._initBackHomeButton();
    this._initAppleCount();
    this._initSound();
    this.resize();
    this.sortableChildren = true;
  }

  _initShopData() {
    for (let i = 0; i < this.columns*this.rows; i++) {
      if (localStorage.getItem(`skinBox${i + 1}}Data`) === null) {
        let skinBoxData = {state: "lock", skin: `knife${i  + 1}`, cost: 10};
        localStorage.setItem(`skinBox${i + 1}Data`, JSON.stringify(skinBoxData));
      }
    }

    //init currentSkin in localstorage
    if (localStorage.getItem('currentSkin') === null) {
      localStorage.setItem('currentSkin', "knife");
    }
  }

  _initOverLay() {
    this.overlay = new Graphics();
    this.overlay.beginFill(0x000000, 0.7);
    this.overlay.drawRect(0,0,GameConstant.GAME_WIDTH,GameConstant.GAME_HEIGHT);
    this.overlay.endFill();
    this.addChild(this.overlay);
    this.overlay.zIndex= 50;
  }

  _initText() {
    this.textLoad = new Text("Knife Shop", {
      fontSize: 60,
      fill: "#FF8C00",
      fontWeight: "bold",
      align: "center",
      fontFamily: "Comic Sans MS",
    })
    this.addChild(this.textLoad);
    this.textLoad.zIndex= 100;
  }

  _initBackGround() {
    this.shopBackGround = new Sprite(Game.bundle.bgShop);
    this.shopBackGround.x = 0;
    this.shopBackGround.y = 0;
    this.shopBackGround.width = GameConstant.GAME_WIDTH;
    this.shopBackGround.height = GameConstant.GAME_HEIGHT; 
    this.addChild(this.shopBackGround);

    this._initOverLay();
  }

  _initSound() {
    this.chooseItem = Sound.from(Game.bundle.chooseItem);
    this.chooseItem.volume = 1;
    this.noChooseItem = Sound.from(Game.bundle.noChooseItem);
  }
  _initLighting() {
    this.lighting = new Sprite(Game.bundle.light);
    this.lighting.scale.set(0.6);
    this.lighting.anchor.set(0.5);
    this.lighting.zIndex= 90;
    this.lighting.alpha = 0.7;
    this.addChild(this.lighting);
  }


  _initKnifeCurrent() {
    this.knifeCurrent = new Sprite(Assets.get(localStorage.getItem('currentSkin')));
    this.knifeCurrent.anchor.set(0.5);
    this.knifeCurrent.rotation = Math.PI / 4;
    this.knifeCurrent.zIndex= 100;
    this.addChild(this.knifeCurrent);
  }

  _initBackHomeButton() {
    this.backHomeButton = new Sprite(Game.bundle.backHomeButton);
    this.backHomeButton.scale.set(0.3);
    this.addChild(this.backHomeButton);
    Util.registerOnPointerDown(this.backHomeButton, this._onTapBackHomeButton, this);
    this.backHomeButton.zIndex= 100;
  }

  _onTapBackHomeButton() {
    this.parent.onShopUIBack();
    this.hide();
  }

  _initContTable() {
    this.contTable = new Container();
    this.addChild(this.contTable);
    this._initListItem();
    this.contTable.zIndex = 100;
  }

  _initAppleCount() {
    this.appleScore = localStorage.getItem('appleScore');
    this.appleScoreContainer = new Container();
    this.appleScoreContainer.zIndex= 100;
    this.addChild(this.appleScoreContainer);

    let textStyle = new TextStyle({
      fontSize: 40,
      align: "center",
      fill: 0xe6b85f,
      fontWeight: "bold",
      fontFamily: "Comic Sans MS",
    });
    //text 
    this.appleText = new Text(`${this.appleScore}`, textStyle);
    this.appleText.anchor.set(1, 0);
    this.appleText.position.set(0, 7);

    //sprite
    this.appleSprite = Sprite.from(Game.bundle.apple_slice_1);
    this.appleSprite.scale.set(0.8);
    this.appleSprite.position.set(60, 10);
    this.appleSprite.angle = 90;
    this.appleScoreContainer.addChild(this.appleText);
    this.appleScoreContainer.addChild(this.appleSprite);
  } 

  _initListItem() {
    this.shopData = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10, 11, 12],
    ];
    for(let row = 0; row < this.rows; row++) {
      for(let column = 0; column < this.columns; column++) {
        let skinBox = new SkinBox(this.shopData[row][column]);
        skinBox.x = this.tablePadding + (column * (170 + this.tablePadding));
        skinBox.y = this.tablePadding + (row * (170 + this.tablePadding));
        this.skinBoxes.push(skinBox);
        this.contTable.addChild(skinBox);

        skinBox.on("pointerdown", () => {
          this.chooseItem.play();
          this._onClick(skinBox);
          console.log(1);
        });
      }
    }
  }

  _onClick(skinBox) {
    switch (skinBox.state) {
      case "lock":
        if (skinBox.canBuy()) {
          skinBox.onBuy();
          
          //change skin on localstorage
          localStorage.setItem('currentSkin', skinBox.skin);

          //reset currentKnife skin
          this.knifeCurrent.texture = Assets.get(localStorage.getItem('currentSkin'));
          
        }
        break;
      case "unlock":
        
        break;
      case "selected":
        
        break;
  
    }
  }
  
  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  resize() {
    this.knifeCurrent.x =  GameConstant.GAME_WIDTH /2;
    this.knifeCurrent.y = 200 ;

    this.lighting.x =  GameConstant.GAME_WIDTH /2;
    this.lighting.y = 200 ;

    this.contTable.x = GameConstant.GAME_WIDTH /2 - this.contTable.width /2;
    this.contTable.y = GameConstant.GAME_HEIGHT /2 - this.contTable.height /4;

    this.textLoad.x = GameConstant.GAME_WIDTH /2 - this.textLoad.width /2;
    this.textLoad.y = GameConstant.GAME_HEIGHT / 2 - 3.5 * this.textLoad.height;

    this.backHomeButton.y = 25;
    this.backHomeButton.x = 20;

    this.appleScoreContainer.x = GameConstant.GAME_WIDTH - 70;
    this.appleScoreContainer.y = 30;
  }
}
