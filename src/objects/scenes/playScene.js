import { Container, Sprite, Graphics, Text } from "pixi.js";
import { Game } from "../../game";
import { Background } from "../backgrounds/background";
import { KnifeManager } from "../knives/knifeManager";
import { Board } from "../boards/board";
import { GameConstant } from "../../gameConstant";
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import { Util } from "../../helper/utils";
import { Sound } from "@pixi/sound";
import { AppleManager } from "../apple/appleManager";
import { PlayUI } from "../ui/playUI";
import { TutorialUI } from "../ui/tutorialUI";
import { ResultGameUI } from "../ui/resultGameUI";
import { DataManager } from "../level/dataManager";
import * as TWEEN from "@tweenjs/tween.js";

export const GameState = Object.freeze({
  Tutorial: "tutorial",
  Playing: "playing",
  Win: "win",
  Lose: "lose",
});
export const Level1 = Object.freeze({
  KNIFE_NUMBER: 7,
});
export class PlayScene extends Container {
  constructor() {
    super();
    this.state = GameState.Tutorial;
    this.score = 0;
    this.appleScore = 0;
    this.currentLevel =1;
    this._initGamePlay();
    this._initUI();
  }

  _initGamePlay() {
    this.gameplay = new Container();
    this.gameplay.eventMode = "static";
    this.gameplay.sortableChildren = true;
    this.knifeNumber = Level1.KNIFE_NUMBER;
    this.currentDt = 0;
    this.addChild(this.gameplay);
    this._initBackground();
    this._initBoard();
    this._initKnifeManager();
    this._initObstacle();
    this._initParticles();
    this._initSound();
    this._initWhiteCircle();
    this._initCircleLine();
    this._dataManager();
    this.gameplay.on("pointerdown", (e) => this._onClicky(e));
    //window.addEventListener("pointerdown", (e) => this._onClicky(e));
  }
  _dataManager() {
    this.dataManager = new DataManager();
    console.log(this.dataManager.getDataLevel(this.currentLevel));
    console.log(Game.dataLevel);
    
  }
  _initUI() {
    //tao play UI
    this.playUI = new PlayUI(this.score, this.appleScore);
    this.addChild(this.playUI);
    // result UI
    this.resultUI = new ResultGameUI();
    this.addChild(this.resultUI);
    //tao tutorial UI
    this.tutorialUI = new TutorialUI();
    this.tutorialUI.zIndex = 200;
    this.addChild(this.tutorialUI);

    this.tutorialUI.on("tapped", (e) => this._onStart(e));
    this.resultUI.hide();
    this.resultUI.on("tapped", (e) => this._onContOrRestart(e));
  }

  _initBackground() {
    this.background = new Background(Game.bundle.background);
    this.background.x = 0;
    this.background.y = 0;
    this.gameplay.addChild(this.background);
  }

  _initBoard() {
    this.board = new Board();
    this.board.x = GameConstant.BOARD_X_POSITION;
    this.board.y = GameConstant.BOARD_Y_POSITION;
    this.gameplay.addChild(this.board);
    this.board.zIndex = 100;
  }

  _initKnifeManager() {
    this.knifeManager = new KnifeManager();
    this.knifeManager.x = 0;
    this.knifeManager.y = 0;
    this.gameplay.addChild(this.knifeManager);
    this.knifeManager.zIndex = 0;
  }

  // Check if win or lose
  _onContOrRestart() {
      if(this.resultUI.messageText.text === "You lose") {
        this._onRestartGame();
      } else {
        this._onContGame();
      }
  }

  // Xử lí click tiếp tục
  _onContGame() {
    //destroy gameplay and initial new one
    this.removeChild(this.gameplay);
    this.gameplay.destroy();
    this._initGamePlay();

    //destroy UI and initial new ones
    this.removeChild(this.playUI, this.tutorialUI, this.resultUI);
    this.playUI.destroy();
    this.tutorialUI.destroy();
    this.resultUI.destroy();
    this._initUI();
    console.log("tiep tuc");
  }

  // xử lí click restart
  _onRestartGame() {
    //destroy gameplay and initial new one
    this.removeChild(this.gameplay);
    this.gameplay.destroy();
    this.score = 0; //reset score
    this._initGamePlay();

    //destroy UI and initial new ones
    this.removeChild(this.playUI, this.tutorialUI, this.resultUI);
    this.playUI.destroy();
    this.tutorialUI.destroy();
    this.resultUI.destroy();
    this._initUI();
    console.log("choi lai");
  }

  _initObstacle() {
    this.avaiAngle = [];
    for (let i = 0; i < 18; i++) {
      this.avaiAngle[i] = {
        angle: i * 20,
        available: true,
      };
    }
    this.knifeManager.spawnObsKnives(this.avaiAngle);
    this._initAppleManager();
    this.appleManager.spawnApples(this.avaiAngle);
    // /console.log(...this.avaiAngle);
  }

  _initAppleManager() {
    this.appleManager = new AppleManager();
    this.appleManager.x = 0;
    this.appleManager.y = 0;
    this.gameplay.addChild(this.appleManager);
    this.appleManager.zIndex = 101;
  }
  _initWhiteCircle() {
    this.whiteCircle = new Sprite(Game.bundle.circleWhite);
    this.addChild(this.whiteCircle);
    this.whiteCircle.x = this.board.x;
    this.whiteCircle.y = this.board.y;
    this.whiteCircle.anchor.set(0.5);
    this.whiteCircle.alpha = 0.2;
    this.whiteCircle.scale.set(0.8);
    this.whiteCircle.zIndex = 150;
    this.whiteCircle.visible = false;
  }

  _initCircleLine() {
    this.circleLine = new Sprite(Game.bundle.circleLineWhite);
    this.addChild(this.circleLine);
    this.circleLine.x = this.board.x;
    this.circleLine.y = this.board.y;
    this.circleLine.anchor.set(0.5);
    this.circleLine.alpha = 0.3;
    this.circleLine.zIndex = 150;
    this.circleLine.visible = false;

  }
  _initParticles() {
    this.particleContainer = new Container();
    this.gameplay.addChild(this.particleContainer);
  }

  _initSound() {
    //tieng va cham dao
    this.kHitKSound = Sound.from(Game.bundle.knife_hit_knife);
    this.kHitKSound.volume = 0.3;
    //tieng va cham go
    this.kHitWSound = Sound.from(Game.bundle.knife_hit_wood);
    //tieng va cham tao
    this.kHitApple = Sound.from(Game.bundle.knife_hit_apple);
    // tiếng bảng vỡ
    this.boardBroken = Sound.from(Game.bundle.brokenBoard);
    this.boardBroken.volume = 100;
  }
  update(dt) {
    this.currentDt += dt;
    TWEEN.update(this.currentDt);
    this.knifeManager.update(dt);
    this.appleManager.update(dt);
    this.board.update(dt);
    this._onCollision();
    this._syncRotate();

    if (this.state === GameState.Playing) {
      this.playUI.updateTime(dt);
    }

    if (this.state === GameState.Tutorial) {
      this.tutorialUI.updateUI(dt);
    }
  }

 // Hình tròn xuất hiện khi bảng vỡ ra
  circleFlare() {
    new TWEEN.Tween(this.whiteCircle)
    .to({scale: {x:0.5, y: 0.5}}, 4)
    .onComplete(() => {
      new TWEEN.Tween(this.whiteCircle)
      .to({scale: {x:1.5 ,y: 1.5}}, 8)
      .onComplete(() => {this.whiteCircle.visible = false})
      .start(this.currentDt)
    })
    .start(this.currentDt);
  }

 // Vòng tròn xuất hiện khi bảng vỡ ra
  circleLineZoom() {
    new TWEEN.Tween(this.circleLine)
    .to({scale: {x:1.5, y: 1.5}}, 5)
    .onComplete(() => {
      new TWEEN.Tween(this.circleLine)
      .to({scale: {x:2 ,y: 2}}, 8)
      .onComplete(() => {
        this.circleLine.alpha = 0.01;
        this.circleLine.visible = false;
      })
      .start(this.currentDt)
    })
    .start(this.currentDt);
  }
  _onStart(e) {
    this.state = GameState.Playing;
    this.tutorialUI.hide();
    this._onClicky(e);
  }
  _onCollision() {
    if (this.knifeManager.knives[0] != null) {
      if (this.knifeManager.knives[0].state === "move") {
        //va cham dao
        if (this.knifeManager.knives[0].y >= 590) {
            this.knifeManager.obsKnives.forEach((knife) => {
                if (Util.SATPolygonPolygon(this._cal4PointKnife(this.knifeManager.knives[0]), Util.find4Vertex(knife))) {
                  console.log("aaaaa");
                  this.kHitKSound.play();
                  this.knifeManager.knives[0].setFall();
                  
                  setTimeout(() => {
                    this.state = GameState.Lose;
                    this.resultUI.show();
                    this.resultUI.messageText.text = "You lose";
                    this.resultUI.buttonText.text = "Chơi lại";
                    this.resultUI.messageText.style.fill = "red";
                  }, 1500);
                }
              });
        }
        
        //va cham tao
        this.appleManager.apples.forEach((apple) => {
          if (Util.SATPolygonPolygon(this._cal4PointKnife(this.knifeManager.knives[0]), Util.find4Vertex(apple))) {
            console.log("xuyen tao");
            this.kHitApple.play();
            this.appleManager.removeApple(apple);

            //tang diem
            this.playUI.updateAppleScore(++this.appleScore);
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
          this.playUI.updateScore(++this.score);
          console.log("va roi!");
  
          //bien dao thanh vat can
          this.knifeManager.knives[0].beObs();

          console.log(this.knifeManager.knives[0].position);

          //quay dao theo khoi go
          this._rotateKnife(this.knifeManager.knives[0]);
          this.knifeManager.obsKnives.push(this.knifeManager.knives.shift());
          if (this.knifeManager.numOfKnife > 0) {
            this.knifeManager.knives[0].setActivate();
          }
          this.knifeManager.numOfKnife--;

          // phóng hết dao
          if (this.knifeNumber === 0) {
            // tạo âm thanh
            this.boardBroken.play();
            // Hiện và xử lí các mảnh vỡ bay ra
            this.board.breakUp();
            this.knifeManager.setObsFall();
            this.appleManager.setApplesFall();
            // Hiện UI result
            setTimeout(() => {
              this.state = GameState.Win;
              this.resultUI.show();
            }, 1500);
          // hình tròn và vòng tròn xuất hiện
          this.whiteCircle.visible = true;
          this.circleFlare();
          this.circleLine.visible = true;
          this.circleLineZoom();
          }
        }
      }
    }
  }
  _rotateKnife(knife) {
    knife.x = this.board.x;
    knife.y = this.board.y;
    knife.anchor.set(0.5, -0.5);
    knife.collider.anchor.set(0.5, -0.5);
  }

  _syncRotate() {
    this.knifeManager.boardAngleRotation = this.board.angleRotation;
    this.appleManager.boardAngleRotation = this.board.angleRotation;
  }
  
  _cal4PointKnife(knife) {
    let w = knife.collider.getBounds().width;
    let h = knife.collider.getBounds().height;
    let x = knife.collider.getBounds().x;
    let y = knife.collider.getBounds().y;
    return [x, y, x + w, y, x + w, y + h, x, y + h];
  }

  _onClicky(e) {
    if (this.state === GameState.Playing) {
        if (this.knifeNumber > 0) {
            
            if (this.knifeManager.onClicky(e)) {
            this.playUI.updateKnifeIcon(Level1.KNIFE_NUMBER - this.knifeNumber--);
            }
          }
    }
    
  }
}
