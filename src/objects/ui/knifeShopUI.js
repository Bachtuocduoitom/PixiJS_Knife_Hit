import { Container, Sprite, Text, Graphics, TextStyle, Assets } from "pixi.js";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helper/utils";
import { SkinBox, SkinBoxState } from "../skin/skinBox";
import * as TWEEN from "@tweenjs/tween.js";
import { Sound } from "@pixi/sound";

export class KnifeShopUI extends Container {
  constructor() {
    super();
    this.rows = 4;
    this.columns = 3;
    this.tablePadding = 8;
    this.skinBoxes = [];
    //this._initShopData();
    this._initSound();
    this._initBackGround();
    this._initKnifeCurrent();
    this._initLightingBehind();
    this._initContTable();
    this._initText();
    this._initBackHomeButton();
    this._initAppleCount();
    this.resize();
    this.sortableChildren = true;
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
    //init text: knife shop
    this.textLoad = new Text("Knife Shop", {
      fontSize: 60,
      fill: "#FF8C00",
      fontWeight: "bold",
      align: "center",
      fontFamily: Game.bundle.comicSans.family,
    })
    this.addChild(this.textLoad);
    this.textLoad.zIndex= 100;

    //init text: not enough money
    this.textWarScore = new Text("Not enough money", {
      fontSize: 30,
      fill: "#FF6347",
      fontWeight: "bold",
      align: "center",
      fontFamily: Game.bundle.comicSans.family,
    })
    this.textWarScore.zIndex = 100;
    this.textWarScore.anchor.set(0.5);
    this.textWarScore.alpha = 0;
    this.addChild(this.textWarScore);

    //init warning tween    
    this._initNotEnoughMoneyTween();
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
  _initLightingBehind() {
    this.lighting = new Sprite(Game.bundle.light);
    this.lighting.scale.set(0.35);
    this.lighting.anchor.set(0.5);
    this.lighting.zIndex= 90;
    this.lighting.alpha = 0.6;
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
      fontFamily: Game.bundle.comicSans.family,
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
          this._onClick(skinBox);
        });
      }
    }
  }

  _onClick(skinBox) {
    switch (skinBox.state) {
      case SkinBoxState.LOCK:
        if (skinBox.canBuy()) {
          //play sound  
          this.chooseItem.play();

          this.skinBoxes.forEach((box) => {
            if(box.state === SkinBoxState.SELECTED) {
              box.onDeselect();
            }
          })

          skinBox.onBuy();
          
          //change skin on localstorage
          localStorage.setItem('currentSkin', skinBox.skin);

          //change appleScore
          this._resetAppleScore(skinBox);
          localStorage.setItem('appleScore', this.appleScore);
          
        } else {
          //play sound
          this.noChooseItem.play();

          //play tween
          this._playNotEnoughMoneyTween();
        }
        break;
      case SkinBoxState.UNLOCK:
        //play sound
        this.chooseItem.play();

        this.skinBoxes.forEach((box) => {
          if(box.state === SkinBoxState.SELECTED) {
            box.onDeselect();
          }
        })

        skinBox.onSelected();

        //change skin on localstorage
        localStorage.setItem('currentSkin', skinBox.skin);

        break;
      case SkinBoxState.SELECTED:
        //play sound
        this.chooseItem.play();

        skinBox.onDeselect();

        //change skin on localstorage
        localStorage.setItem('currentSkin', "knife");

        break;
  
    }

    //reset currentKnife skin
    this.knifeCurrent.texture = Assets.get(localStorage.getItem('currentSkin'));
  }

  _resetAppleScore(skinBox) {
    this.appleScore -= skinBox.cost;
    this.appleText.text = `${this.appleScore}`;
  }

  _initNotEnoughMoneyTween() {
    this.tween = new TWEEN.Tween(this.textWarScore).to({alpha: 1}, 500).yoyo(true).repeat(1);
  }

  _playNotEnoughMoneyTween() {
    this.tween.start(); 
  }

  hide() {
    this.visible = false;
  }

  show() {
    this.appleScore = localStorage.getItem('appleScore');
    this.appleText.text = `${this.appleScore}`;
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

    this.textWarScore.x = GameConstant.GAME_WIDTH/2;
    this.textWarScore.y = GameConstant.GAME_HEIGHT - 60;

    this.backHomeButton.y = 25;
    this.backHomeButton.x = 20;

    this.appleScoreContainer.x = GameConstant.GAME_WIDTH - 70;
    this.appleScoreContainer.y = 30;
  }
}
