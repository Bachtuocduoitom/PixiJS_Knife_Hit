import { Container, Sprite, Text, Graphics } from "pixi.js";
import { Game } from "../../../game";
import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helper/utils";

export class KnifeShopUI extends Container {
  constructor() {
    super();
    this.rows = 4;
    this.columns = 3;
    this.tablePadding = 8;
    this._initBackGround();
    this._initContTable();
    this._initText();
    this._initBackHomeButton();
    this.resize();
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
  }


  _initBackHomeButton() {
    this.backHomeButton = new Sprite(Game.bundle.backHomeButton);
    this.backHomeButton.scale.set(0.3);
    this.addChild(this.backHomeButton);
    Util.registerOnPointerDown(this.backHomeButton,this._onTapBackHomeButton,this);
  }

  _onTapBackHomeButton() {
    this.hide();
  }

  _initContTable() {
    this.contTable = new Container();
    this.addChild(this.contTable);
    this._initListItem();
  }

  _initItem() {
    this.knifeItem = new Sprite(Game.bundle.knife9);
    this.knifeItem.width = 30;
    this.knifeItem.height = 100;
    this.knifeItem.rotation = Math.PI / 4;
  }

    _initListItem() {
    for(let row = 0; row < this.rows; row++) {
        for(let column = 0; column < this.columns; column++) {
            this.cell = new Graphics();
            this.cell.beginFill(0xCCCCCC);
            this.cell.drawRect(0, 0, 170, 170);
            this.cell.endFill();
            
            this.cell.x = this.tablePadding + (column * (170 + this.tablePadding));
            this.cell.y = this.tablePadding + (row * (170 + this.tablePadding));
            this.contTable.addChild(this.cell);

            // this._initItem();
            // this.cell.addChild(this.knifeItem);
        }
    }
  }
  
  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  resize() {
    this.contTable.x = GameConstant.GAME_WIDTH /2 - this.contTable.width /2;
    this.contTable.y = GameConstant.GAME_HEIGHT /2 - this.contTable.height /2;
    this.textLoad.x = GameConstant.GAME_WIDTH /2 - this.textLoad.width /2;
    this.textLoad.y = GameConstant.GAME_HEIGHT / 2 - 5.5 * this.textLoad.height;
    this.backHomeButton.y =30;
    this.backHomeButton.x = 20;
  }
}
