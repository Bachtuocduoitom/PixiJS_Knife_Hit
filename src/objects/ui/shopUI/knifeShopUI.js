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
    this._initKnifeCurrent();
    this._initContTable();
    this._initText();
    this._initBackHomeButton();
    this._initOverLay();
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

  _initKnifeCurrent() {
    this.knifeCurrent = new Sprite(Game.bundle.knife);
    this.knifeCurrent.rotation = Math.PI / 4;
    this.knifeCurrent.zIndex= 100;
    this.addChild(this.knifeCurrent);
  }

  _initBackHomeButton() {
    this.backHomeButton = new Sprite(Game.bundle.backHomeButton);
    this.backHomeButton.scale.set(0.3);
    this.addChild(this.backHomeButton);
    Util.registerOnPointerDown(this.backHomeButton,this._onTapBackHomeButton,this);
    this.backHomeButton.zIndex= 100;
  }

  _onTapBackHomeButton() {
    this.hide();
  }

  _initContTable() {
    this.contTable = new Container();
    this.addChild(this.contTable);
    this._initListItem();
    this.contTable.zIndex = 100;
  }

  _initItem() {
    this.knifeItem = new Sprite(Game.bundle.knife10);
    this.knifeItem.width = 30;
    this.knifeItem.height = 100;
    this.knifeItem.rotation = Math.PI / 4;
  }

    _initListItem() {
    //   this.shopData = [
    //     [Game.bundle.knife1, Game.bundle.knife2, Game.bundle.knife3],
    //     [Game.bundle.knife4, Game.bundle.knife5, Game.bundle.knife6],
    //     [Game.bundle.knife7, Game.bundle.knife8, Game.bundle.knife9],
    //     [Game.bundle.knife10, Game.bundle.knife11, Game.bundle.knife12],
    // ];
    this.shopData = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10, 11, 12],
  ];
    for(let row = 0; row < this.rows; row++) {
      // this.table[row] = [];
        for(let column = 0; column < this.columns; column++) {
          this.cell = new Sprite(Game.bundle.square);
          this.cell.width = 170;
          this.cell.height = 170;
          this.cell.eventMode = "static";
          // this.cell.beginFill(0x000);
          // this.cell.alpha = 0.8;
          // this.cell.drawRoundedRect(0, 0, 170, 170);
          // this.cell.lineStyle(10, 0xf3b23d);
          // this.cell.endFill();
          
          this.cell.x = this.tablePadding + (column * (170 + this.tablePadding));
          this.cell.y = this.tablePadding + (row * (170 + this.tablePadding));
            this.contTable.addChild(this.cell);
            this.cell.on("pointerdown", (e) => {
              console.log("Cell value:", this.shopData[row][column]);
              this._onChoose(this.cell);
              
            })
            // this._initItem();
            // this.cell.addChild(this.knifeItem);
        }
    }
  }

  _onChoose(cell) {
  
    cell.alpha = 0.5;
   
  }

  hide() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  resize() {
    this.knifeCurrent.x =  GameConstant.GAME_WIDTH /2 + this.knifeCurrent.width;
    this.knifeCurrent.y = 100 ;
    this.contTable.x = GameConstant.GAME_WIDTH /2 - this.contTable.width /2;
    this.contTable.y = GameConstant.GAME_HEIGHT /2 - this.contTable.height /4;
    this.textLoad.x = GameConstant.GAME_WIDTH /2 - this.textLoad.width /2;
    this.textLoad.y = GameConstant.GAME_HEIGHT / 2 - 3.5 * this.textLoad.height;
    this.backHomeButton.y =30;
    this.backHomeButton.x = 20;
  }
}
