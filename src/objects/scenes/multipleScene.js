import { Container, Sprite, Graphics, Text } from "pixi.js";
import { Game } from "../../game";
import { PlayScene } from "./playScene";
import { KnifeManager2 } from "../knives/knifeManager2";
import { Board } from "../boards/board";
import { GameConstant } from "../../gameConstant";
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import { Util } from "../../helper/utils";
import { MultipleUI } from "../ui/multipleUI";
import { TutorialUI } from "../ui/tutorialUI";
import { ResultGameUI } from "../ui/resultGameUI";
import * as TWEEN from "@tweenjs/tween.js";

export const GameState = Object.freeze({
  Tutorial: "tutorial",
  Playing: "playing",
  Win: "win",
  Lose: "lose",
});
export class MultipleScene extends PlayScene {
  constructor() {
    super();
    // this.state = GameState.Tutorial;
    this.score = 0;
    this.appleScore = 0;
    this.score2 = 0;
    this.appleScore2 = 0;
    this.currentLevel = 1;
    this._initGamePlay();
    this._initUI();
    super._initParticlesResultgame();
  }

  _initGamePlay() {
    super._initDataManager();
    this.gameplay = new Container();
    this.gameplay.eventMode = "static";
    this.gameplay.sortableChildren = true;
    this.knifeNumber = this.dataManager.numOfKnife();
    this.knifeNumber2 = this.dataManager.numOfKnife();
    this.currentDt = 0;
    this.addChild(this.gameplay);
    super._initBackground();
    this._initBoard();
    this._initContKnifeManager1();
    this._initContKnifeManager2();
    super._initObstacle();
    super._initParticles();
    super._initSound();
    super._initCircleFlare();
  }

  _initContKnifeManager1() {
    this.contKnifeMan1 = new Container();
    this.contKnifeMan1.eventMode = "static";
    super._initKnifeManager();
    this.gameplay.addChild(this.contKnifeMan1);
    this._initBackgroundCont1();
  }

  _initBackgroundCont1() {
    this.bgCont1 = new Graphics();
    this.bgCont1.beginFill(0x000000, 0.005);
    this.bgCont1.drawRect(0, 0, GameConstant.GAME_WIDTH, GameConstant.GAME_HEIGHT /2);
    this.bgCont1.y = GameConstant.GAME_HEIGHT /2;
    this.bgCont1.endFill();
    this.bgCont1.eventMode = 'static';
    this.contKnifeMan1.addChild(this.bgCont1);
    this.bgCont1.on("pointerdown", (e) => {
    this.state = GameState.Playing;
    this._onClicky(e);
    console.log('click cont1');
    });
  }

  _initContKnifeManager2() {
    this.contKnifeMan2 = new Container();
    this._initKnifeManager2();
    this.contKnifeMan2.width = GameConstant.GAME_WIDTH;
    this.contKnifeMan2.height = this.y / 2;
    this.gameplay.addChild(this.contKnifeMan2);
    this._initBackgroundCont2();
  }

  _initBackgroundCont2() {
    this.bgCont2 = new Graphics();
    this.bgCont2.beginFill(0xffffff, 0.005);
    this.bgCont2.drawRect(0, 0, GameConstant.GAME_WIDTH, GameConstant.GAME_HEIGHT /2);
    this.bgCont2.endFill(); 
    this.bgCont2.eventMode = 'static';
    this.contKnifeMan2.addChild(this.bgCont2);
    this.bgCont2.on("pointerdown", (e) => {
      this.state = GameState.Playing;
      this._onClicky2(e);
      console.log('click cont2');
    });
  }

  _initUI() {
    //tao multiple UI
    this.multipleUI = new MultipleUI(this.dataManager, this.score, this.appleScore, this.score2, this.appleScore2);
    this.addChild(this.multipleUI);
    // result UI
    this.resultUI = new ResultGameUI();
    this.addChild(this.resultUI);
    this.resultUI.messageText.x = GameConstant.GAME_WIDTH /2 - this.resultUI.messageText.width/ 1.3;
    // tao tutorial UI
    this.tutorialUI = new TutorialUI();
    this.addChild(this.tutorialUI);
    this.tutorialUI.on("tapped", (e) => {this.tutorialUI.hide()});
    this.resultUI.hide();
    this.resultUI.on("tapped", (e) => super._onContOrRestart(e));
  }

  _initBoard() {
    this.board = new Board(this.dataManager.getBoardData());
    this.board.x = GameConstant.BOARD_X_POSITION;
    this.board.y = GameConstant.BOARD_Y_POSITION * 1.7;
    this.gameplay.addChild(this.board);
    this.board.zIndex = 100;
  }

  _initKnifeManager2() {
    this.knifeManager2 = new KnifeManager2(this.dataManager.getKnifeData());
    this.knifeManager2.x = 0;
    this.knifeManager2.y = 0;
    this.gameplay.addChild(this.knifeManager2);
    this.knifeManager.zIndex = 0;
  }

  // Xử lí click tiếp tục
  _onContGame() {
    //update level
    this.currentLevel++;
    //destroy gameplay and initial new one
    this.removeChild(this.gameplay);
    this.gameplay.destroy();
    this._initGamePlay();
    //destroy UI and initial new ones
    this.removeChild(this.multipleUI, this.resultUI);
    this.multipleUI.destroy();
    this.resultUI.destroy();
    this._initUI();
    console.log("tiep tuc");
    super._initParticlesResultgame();
    super.boardZoom();
  }

  // xử lí click restart
  _onRestartGame() {
    //update level
    this.currentLevel = 1;
    //destroy gameplay and initial new one
    this.removeChild(this.gameplay);
    this.gameplay.destroy();
    this.score = 0; //reset score
    this._initGamePlay();
    //destroy UI and initial new ones
    this.removeChild(this.multipleUI, this.resultUI);
    this.multipleUI.destroy();
    this.resultUI.destroy();
    this._initUI();
    console.log("choi lai");
    super._initParticlesResultgame();
  }

  update(dt) {
    this.currentDt += dt;
    TWEEN.update(this.currentDt);
    this.knifeManager.update(dt);
    this.knifeManager2.update(dt);
    this.appleManager.update(dt);
    this.board.update(dt);
    this._onCollision();
    this._syncRotate();
  }

  _onLose2() {
      this.kHitKSound.play();
      this.knifeManager2.knives[0].setFall();
      this._showKnifeCollisionFlare(this.knifeManager2.knives[0]);
      this.board.setStop();
      //dich chuyen nhe go tao va  dao
      this.board.onHit();
      this.knifeManager2.onBoardHit();
      this.appleManager.onBoardHit();
      setTimeout(() => {
        this.winGame.play();
      }, 500);
      setTimeout(() => {
        this.state = GameState.Lose;
        this.resultUI.show();
        this.resultUI.messageText.text = "Player1 Win";
        this.resultUI.buttonText.text = "Restart";
        // this.resultUI.messageText.style.fill = "red";
      }, 1500);
 }

  _onCollision() {
    // xét va chạm của knife 1
    if (this.knifeManager.knives[0] != null) {
      if (this.knifeManager.knives[0].state === "move") {
        //va cham dao
        if (this.knifeManager.knives[0].y >= 590) {
            this.knifeManager.obsKnives.forEach((knife) => {
                if (Util.SATPolygonPolygon(super._cal4PointKnife(this.knifeManager.knives[0]), Util.find4Vertex(knife))) {
                  super._onLose();
                  this.resultUI.messageText.text = "Player2 Win";
                  this.resultUI.buttonText.text = "Restart";
                  this.resultUI.messageText.style.fill = "#ADFF2F";
                }
              });

              this.knifeManager2.obsKnives.forEach((knife) => {
                if (Util.SATPolygonPolygon(super._cal4PointKnife(this.knifeManager.knives[0]), Util.find4Vertex(knife))) {
                  console.log("va chạm dao p1 với p2");
                  super._onLose();
                  this.resultUI.messageText.text = "Player2 Win";
                  this.resultUI.buttonText.text = "Restart";
                }
              });
        }
        //va cham tao
        this.appleManager.apples.forEach((apple) => {
          if (Util.SATPolygonPolygon(super._cal4PointKnife(this.knifeManager.knives[0]), Util.find4Vertex(apple))) {
            console.log("xuyen tao");
            this.kHitApple.play();
            this.appleManager.removeApple(apple);
            //tang diem
            this.multipleUI.updateAppleScore(++this.appleScore);
          }
        });
        //va cham go
        if (Util.AABBCheck(this.knifeManager.knives[0].collider, this.board.collider)) {
          //tao am thanh
          this.kHitWSound.play();
          //tao vun go khi va cham
          let logParticle = new Emitter(
            this.particleContainer,
            upgradeConfig(Game.bundle.logParticle, [Game.bundle.particle])
          );
          logParticle.updateSpawnPos(
            this.knifeManager.knives[0].x,
            this.knifeManager.knives[0].y - 30
          );
          logParticle.playOnceAndDestroy();
          //dich chuyen nhe go tao va  dao
          this.board.onHit();
          this.knifeManager.onBoardHit();
          this.appleManager.onBoardHit();
          //tang diem
          this.multipleUI.updateScore(++this.score);
          console.log("va roi!");
          //bien dao thanh vat can
          this.knifeManager.knives[0].beObs();
          //quay dao theo khoi go
          super._rotateKnife(this.knifeManager.knives[0]);
          this.knifeManager.obsKnives.push(this.knifeManager.knives.shift());
          if (this.knifeManager.numOfKnife > 0) {
            this.knifeManager.knives[0].setActivate();
          }
          this.knifeManager.numOfKnife--;
          // phóng hết dao
          if (this.knifeNumber === 0) {
            super._onWin();
            this.board.setBroken2();
            this.resultUI.messageText.text = "Player1 Win";
            this.resultUI.buttonText.text = "Restart";
          }
        }
      }
    }

 // xét va chạm của knife 2
    if (this.knifeManager2.knives[0] != null) {
      if (this.knifeManager2.knives[0].state === "move2") {
        //va cham dao
        if (this.knifeManager2.knives[0].y <= 590) {
            this.knifeManager2.obsKnives.forEach((knife) => {
                if (Util.SATPolygonPolygon(super._cal4PointKnife(this.knifeManager2.knives[0]), Util.find4Vertex(knife))) {
                  this._onLose2();
                }
              });
              this.knifeManager.obsKnives.forEach((knife) => {
                if (Util.SATPolygonPolygon(super._cal4PointKnife(this.knifeManager2.knives[0]), Util.find4Vertex(knife))) {
                  console.log("va chạm dao p2 với p1");
                  this._onLose2();
                }
              });
        }
        //va cham tao
        this.appleManager.apples.forEach((apple) => {
          if (Util.SATPolygonPolygon(super._cal4PointKnife(this.knifeManager2.knives[0]), Util.find4Vertex(apple))) {
            console.log("xuyen tao");
            this.kHitApple.play();
            this.appleManager.removeApple(apple);
            //tang diem
            this.multipleUI.updateAppleScore2(++this.appleScore2);
          }
        });
        //va cham go
        if (Util.AABBCheck(this.knifeManager2.knives[0].collider, this.board.collider)) {
          //tao am thanh
          this.kHitWSound.play();
          //tao vun go khi va cham
          let logParticle = new Emitter(
            this.particleContainer,
            upgradeConfig(Game.bundle.logParticle, [Game.bundle.particle])
          );
          logParticle.updateSpawnPos(
            this.knifeManager.knives[0].x,
            this.knifeManager.knives[0].y - 30
          );
          logParticle.playOnceAndDestroy();
          //dich chuyen nhe go tao va  dao
          this.board.onHit();
          this.knifeManager2.onBoardHit();
          this.appleManager.onBoardHit();
          //tang diem
          this.multipleUI.updateScore2(++this.score2);
          console.log("va roi!");
          //bien dao thanh vat can
          this.knifeManager2.knives[0].beObs();
          //quay dao theo khoi go
          this._rotateKnife2(this.knifeManager2.knives[0]);
          this.knifeManager2.obsKnives.push(this.knifeManager2.knives.shift());
          if (this.knifeManager2.numOfKnife > 0) {
            this.knifeManager2.knives[0].setActivate2();
          }
          this.knifeManager2.numOfKnife--;
          // phóng hết dao
          if (this.knifeNumber2 === 0) {
            super._onWin();
            this.knifeManager2.setObsFall();
            this.board.setBroken2();
            this.resultUI.messageText.text = "Player2 Win";
            this.resultUI.buttonText.text = "Restart";
          }
        }
      }
    }
  }

  _rotateKnife2(knife) {
    knife.x = this.board.x;
    knife.y = this.board.y;
    knife.anchor.set(0.5, 1.5);
    knife.collider.anchor.set(0.5, 1.5);
  }

  _syncRotate() {
    this.knifeManager.boardAngleRotation = this.board.angleRotation;
    this.knifeManager2.boardAngleRotation = this.board.angleRotation;
    this.appleManager.boardAngleRotation = this.board.angleRotation;
  }

  _onClicky(e) {
    if (this.state === GameState.Playing) {
        if (this.knifeNumber > 0) {
            if (this.knifeManager.onClicky(e)) {
            this.multipleUI.updateKnifeIcon(this.dataManager.numOfKnife() - this.knifeNumber--);
            }
          }
    }
  }

  _onClicky2(e) {
    if (this.state === GameState.Playing) {
        if (this.knifeNumber2 > 0) {
            if (this.knifeManager2.onClicky(e)) {
            this.multipleUI.updateKnifeIcon2(this.dataManager.numOfKnife() - this.knifeNumber2--);
            }
          }
    }
  }
}
