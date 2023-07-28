import { Container, Sprite, Graphics, Text } from "pixi.js";
import { Game } from "../../game";
import { Sound } from "@pixi/sound";
import { KnifeManager1 } from "../knives/knifeManager1";
import { KnifeManager2 } from "../knives/knifeManager2";
import { Background } from "../backgrounds/background";
import { AppleManager } from "../apple/appleManager";
import { DataManager } from "../level/dataManager";
import { Board } from "../boards/board";
import { GameConstant } from "../../gameConstant";
import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import { Util } from "../../helper/utils";
import { DualUI } from "../ui/dualUI";
import { TutorialUI } from "../ui/tutorialUI";
import { ResultGameUI } from "../ui/resultGameUI";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
import * as TWEEN from "@tweenjs/tween.js";
import { GameState } from "./playScene";


export class DualScene extends Container {
  constructor() {
    super();
    this.state = GameState.Tutorial;
    this.score1 = 0;
    this.appleScore1 = 0;
    this.score2 = 0;
    this.appleScore2 = 0;
    this.currentMode = "dual";
    this._initSound();
    this._initGamePlay();
    this._initUI();
  }

  _initGamePlay() {
    this._initDataManager();
    this.gameplay = new Container();
    this.gameplay.eventMode = "static";
    this.gameplay.sortableChildren = true;
    this.knifeNumber1 = this.dataManager.numOfDualKnife();
    this.knifeNumber2 = this.dataManager.numOfDualKnife();
    this.currentDt = 0;
    this.addChild(this.gameplay);
    this._initBackground();
    this._initBoard();
    this._initContKnifeManager1();
    this._initContKnifeManager2();
    this._initObstacle();
    this._initParticles();
    this._initCircleFlare();
  }

  _initDataManager() {
    this.dataManager = new DataManager();
  }

  _initContKnifeManager1() {
    this.contKnifeMan1 = new Container();
    this.contKnifeMan1.eventMode = "static";
    this._initKnifeManager1();
    this.gameplay.addChild(this.contKnifeMan1);
    this._initBackgroundCont1();
  }

  _initBackgroundCont1() {
    this.bgCont1 = new Graphics();
    this.bgCont1.beginFill(0x000000, 0.005);
    this.bgCont1.drawRect(0,0,GameConstant.GAME_WIDTH,GameConstant.GAME_HEIGHT / 2);
    this.bgCont1.y = GameConstant.GAME_HEIGHT / 2;
    this.bgCont1.endFill();
    this.bgCont1.eventMode = 'static';
    this.bgCont1.zIndex = 200;
    this.contKnifeMan1.addChild(this.bgCont1);
    this.bgCont1.on("pointerdown", (e) => {
    this.state = GameState.Playing;
    this._onClicky1(e);
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
    this.bgCont2.zIndex = 200;
    this.contKnifeMan2.addChild(this.bgCont2);
    this.bgCont2.on("pointerdown", (e) => {
      this.state = GameState.Playing;
      this._onClicky2(e);
    });
  }

  _initUI() {
    //tao multiple UI
    this.dualUI = new DualUI(this.dataManager,this.score1,this.score2);
    this.addChild(this.dualUI);

    // result UI
    this.resultUI = new ResultGameUI();
    this.addChild(this.resultUI);
    this.resultUI.messageText.x = GameConstant.GAME_WIDTH / 2 - this.resultUI.messageText.width / 1.3;

    
    this.resultUI.hide();
    this.resultUI.on("tapped", (e) => this._onRestartGame(e));
    this.resultUI.on("home", (e) => this._backHome(e));
  }

  _initBackground() {
    this.background = new Background(Game.bundle.background);
    this.background.x = 0;
    this.background.y = 0;
    this.gameplay.addChild(this.background);
  }

  _initBoard() {
    this.board = new Board(this.dataManager.getBoardDataDual());
    this.board.x = GameConstant.BOARD_X_POSITION;
    this.board.y = GameConstant.BOARD_DUAL_Y_POSITION;
    this.gameplay.addChild(this.board);
    this.board.zIndex = 100;
  }

  _initKnifeManager1() {
    this.knifeManager1 = new KnifeManager1(this.dataManager.getKnifeDataDual());
    this.knifeManager1.x = 0;
    this.knifeManager1.y = 0;
    this.gameplay.addChild(this.knifeManager1);
    this.knifeManager1.zIndex = 0;
  } 
  
  _initKnifeManager2() {
    this.knifeManager2 = new KnifeManager2(this.dataManager.getKnifeDataDual());
    this.knifeManager2.x = 0;
    this.knifeManager2.y = 0;
    this.gameplay.addChild(this.knifeManager2);
    this.knifeManager1.zIndex = 0;
  }

  _initObstacle() {
    this.avaiAngle = [];
    for (let i = 0; i < 18; i++) {
      this.avaiAngle[i] = {
        angle: i * 20,
        available: true,
      };
    }

    // create dao can tren board
    this.knifeManager1.spawnObsKnives(this.avaiAngle);  
    this.knifeManager2.spawnObsKnives(this.avaiAngle);

  }

  // xử lí click restart
  _onRestartGame() {
    this.winGame.stop();
    //destroy gameplay and initial new one
    this.removeChild(this.gameplay);
    this.gameplay.destroy();
    this.score1 = 0; //reset score
    this.score2 = 0; //reset score
    this._initGamePlay();
    
    //destroy UI and initial new ones
    this.removeChild(this.dualUI, this.resultUI);
    this.dualUI.destroy();
    this.resultUI.destroy();
    

    this._initUI();
    this._initParticlesResultgame();
  }

  _backHome(e) {
    this.winGame.stop();
    this.parent.dualToHome();
  }

  _initParticles() {
    this.particleContainer = new Container();
    this.gameplay.addChild(this.particleContainer);
  }

  _initParticlesResultgame() {
    this.particleContainerResult = new Container();
    this.addChild(this.particleContainerResult);
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
    //tiếng win game
    this.winGame = Sound.from(Game.bundle.winGame);
    // tiếng lose game
    this.loseGame = Sound.from(Game.bundle.loseGame);
    //tieng pop
    this.popSound = Sound.from(Game.bundle.pop);
    this.popSound.play();
  }

  update(dt) {
    this.currentDt += dt;
    this.knifeManager1.update(dt);
    this.knifeManager2.update(dt);
    this.board.update(dt);
    this._onCollision();
    this._syncRotate();
  }

  _initCircleFlare() {
    //tao hinh tron loe sang
    this.whiteCircle = new Sprite(Game.bundle.circleWhite);
    this.gameplay.addChild(this.whiteCircle);
    this.whiteCircle.anchor.set(0.5);
    this.whiteCircle.zIndex = 150;
    this.whiteCircle.visible = false;

    //tao vong tron loe sang
    this.circleLine = new Sprite(Game.bundle.circleLineWhite);
    this.gameplay.addChild(this.circleLine);
    this.circleLine.anchor.set(0.5);
    this.circleLine.zIndex = 150;
    this.circleLine.visible = false;
  }

  _showCircleFlare() {
    //hinh tron loe sang
    this.whiteCircle.x = this.board.x;
    this.whiteCircle.y = this.board.y;
    this.whiteCircle.scale.set(0.8);
    this.whiteCircle.visible = true;
    this.whiteCircle.alpha = 0.2;

    new TWEEN.Tween(this.whiteCircle)
      .to({ scale: { x: 0.5, y: 0.5 } }, 100)
      .onComplete(() => {
        new TWEEN.Tween(this.whiteCircle)
          .to({ scale: { x: 1.5, y: 1.5 } }, 150)
          .onComplete(() => {
            this.whiteCircle.visible = false;
          }).start();
      }).start();

    //vong tron loe sang
    this.circleLine.x = this.board.x;
    this.circleLine.y = this.board.y;
    this.circleLine.visible = true;
    this.circleLine.alpha = 0.3;

    new TWEEN.Tween(this.circleLine)
      .to({ scale: { x: 1.5, y: 1.5 } }, 100)
      .onComplete(() => {
        new TWEEN.Tween(this.circleLine)
          .to({ scale: { x: 2, y: 2 } }, 150)
          .onComplete(() => {
            this.circleLine.alpha = 0.01;
            this.circleLine.visible = false;
          }).start();
      }).start();
  }

  _showKnifeCollisionFlare(knife) {
    //hinh tron loe sang
    this.whiteCircle.x = knife.x;
    this.whiteCircle.y = knife.y - knife.height / 4;
    this.whiteCircle.scale.set(0.1);
    this.whiteCircle.visible = true;
    this.whiteCircle.alpha = 0.5;

    new TWEEN.Tween(this.whiteCircle)
      .to({ scale: { x: 0.7, y: 0.7 } }, 60)
      .onComplete(() => {
        this.whiteCircle.visible = false;
      }).start();

    //man hinh loe sang
    let sceneFilter = new AdjustmentFilter();
    this.gameplay.filters = [sceneFilter];
    new TWEEN.Tween(this.gameplay)
      .to({ alpha: 1, scale: { x: 1.05, y: 1.05 } }, 150)
      .yoyo(true).repeat(1)
      .onUpdate(() => {
        sceneFilter.gamma = 2;
      })
      .onComplete(() => {
        sceneFilter.gamma = 1;
      }).start();
  }

  _onLose1() {
    // Tạo âm thanh va dao
    this.kHitKSound.play();
    // Dao rơi
    this.knifeManager1.knives[0].setFall();
    this._showKnifeCollisionFlare(this.knifeManager1.knives[0]); // Tạo hiệu ứng
    this.board.setStop();

    //dich chuyen nhe go tao va  dao
    this.board.onHit();
    this.knifeManager1.onBoardHit();
    this.knifeManager2.onBoardHit();

    setTimeout(() => {
      this.loseGame.play(); // âm thanh thua
    }, 500);
    setTimeout(() => {
      this.state = GameState.Lose;
      this.resultUI.showLoseBox(); // Hiện result UI
      this.resultUI.messageText.text = "Player2 Win";
      this.resultUI.buttonText.text = "Restart";
      this.resultUI.messageText.style.fill = "#ADFF2F";
      this.resultUI.button.texture = Game.bundle.greenButton;
    }, 1500);
  }

  _onLose2() {
      this.kHitKSound.play();
      this.knifeManager2.knives[0].setFall();
      this._showKnifeCollisionFlare(this.knifeManager2.knives[0]);
      this.board.setStop();

      //dich chuyen nhe go tao va  dao
      this.board.onHit();
      this.knifeManager1.onBoardHit();
      this.knifeManager2.onBoardHit();

      setTimeout(() => {this.winGame.play();}, 500);
      setTimeout(() => {
        this.state = GameState.Lose;
        this.resultUI.show();
        this.resultUI.messageText.text = "Player1 Win";
        this.resultUI.buttonText.text = "Restart";
        // this.resultUI.messageText.style.fill = "red";
      }, 1500);
 }

 _onWin() {
          // tạo âm thanh
          this.boardBroken.play();
          // Hiện và xử lí các mảnh vỡ bay ra
          this.board.breakUp();
          this.knifeManager1.setObsFall();
          this.knifeManager2.setObsFall();

          // Hiện UI result và sound
          setTimeout(() => {this.winGame.play()}, 1000);
          setTimeout(() => {
            this.state = GameState.Win;
            this.resultUI.show();

            //tao hiệu ứng chiến thắng
            let winGameParticle = new Emitter(
              this.particleContainerResult,
              upgradeConfig(Game.bundle.winGameParticle, [Game.bundle.particleStar, Game.bundle.particle])
            );
            winGameParticle.updateSpawnPos(
              this.resultUI.messageText.x + this.resultUI.messageText.width /2 ,
              this.resultUI.messageText.y
        );
          winGameParticle.playOnceAndDestroy();
          }, 1500);
        // hình tròn và vòng tròn xuất hiện
        this._showCircleFlare();  
 }

  _onCollision() {
    // xét va chạm của knife 1
    if (this.knifeManager1.knives[0] != null) {
      if (this.knifeManager1.knives[0].state === "move") {
        //va cham dao
        if (this.knifeManager1.knives[0].y >= 800) {
            this.knifeManager1.obsKnives.forEach((knife) => {
                if (Util.SATPolygonPolygon(this._cal4PointKnife(this.knifeManager1.knives[0]), Util.find4Vertex(knife))) {
                  this._onLose1();
                  this.resultUI.messageText.text = "Player2 Win";
                  this.resultUI.buttonText.text = "Restart";
                  this.resultUI.messageText.style.fill = "#ADFF2F";
                }
              });

          this.knifeManager2.obsKnives.forEach((knife) => {
            if (Util.SATPolygonPolygon(this._cal4PointKnife(this.knifeManager1.knives[0]),Util.find4Vertex(knife))) {
              this._onLose1();
              this.resultUI.messageText.text = "Player2 Win";
              this.resultUI.buttonText.text = "Restart";
            }
          });
        }

        //va cham go
        if (Util.AABBCheck(this.knifeManager1.knives[0].collider,this.board.collider)) {
          //tao am thanh
          this.kHitWSound.play();

          //tao vun go khi va cham
          let logParticle = new Emitter(
            this.particleContainer,
            upgradeConfig(Game.bundle.logParticle, [Game.bundle.particle])
          );
          logParticle.updateSpawnPos(
            this.knifeManager1.knives[0].x,
            this.knifeManager1.knives[0].y - 30
          );
          logParticle.playOnceAndDestroy();
          
          //dich chuyen nhe go va dao
          this.board.onHit();
          this.knifeManager1.onBoardHit();
          this.knifeManager2.onBoardHit();

          //tang diem
          this.dualUI.updateScore(++this.score1);

          //bien dao thanh vat can
          this.knifeManager1.knives[0].beObs();

          //quay dao theo khoi go
          this._rotateKnife(this.knifeManager1.knives[0]);
          this.knifeManager1.obsKnives.push(this.knifeManager1.knives.shift());
          if (this.knifeManager1.numOfKnife > 0) {
            this.knifeManager1.knives[0].setActivate();
          }
          this.knifeManager1.numOfKnife--;

          // phóng hết dao
          if (this.knifeNumber1 === 0) {
            this._onWin();
            this.board.setBroken2();
            this.resultUI.messageText.text = "Player1 Win";
            this.resultUI.buttonText.text = "Restart";
          }
        }
      }
    }

    // xét va chạm của knife 2
    if (this.knifeManager2.knives[0] != null) {
      if (this.knifeManager2.knives[0].state === "move") {
        //va cham dao
        if (this.knifeManager2.knives[0].y <= 480) {
            this.knifeManager2.obsKnives.forEach((knife) => {
                if (Util.SATPolygonPolygon(this._cal4PointKnife(this.knifeManager2.knives[0]), Util.find4Vertex(knife))) {
                  this._onLose2();
                }
              });
              this.knifeManager1.obsKnives.forEach((knife) => {
                if (Util.SATPolygonPolygon(this._cal4PointKnife(this.knifeManager2.knives[0]), Util.find4Vertex(knife))) {
                  this._onLose2();
                }
              });
        }

        //va cham go
        if ( Util.AABBCheck(this.knifeManager2.knives[0].collider,this.board.collider) ) {
          //tao am thanh
          this.kHitWSound.play();

          //tao vun go khi va cham
          let logParticle = new Emitter(
            this.particleContainer,
            upgradeConfig(Game.bundle.logParticle, [Game.bundle.particle])
          );
          logParticle.rotation = Math.PI;
          logParticle.updateSpawnPos(
            this.knifeManager2.knives[0].x,
            this.knifeManager2.knives[0].y + 30
          );
          logParticle.playOnceAndDestroy();

          //dich chuyen nhe go tao va  dao
          this.board.onHitExtra();
          this.knifeManager1.onBoardHitExtra();
          this.knifeManager2.onBoardHitExtra();

          //tang diem
          this.dualUI.updateScore2(++this.score2);

          //bien dao thanh vat can
          this.knifeManager2.knives[0].beObs();

          //quay dao theo khoi go
          this._rotateKnife2(this.knifeManager2.knives[0]);
          this.knifeManager2.obsKnives.push(this.knifeManager2.knives.shift());
          if (this.knifeManager2.numOfKnife > 0) {
            this.knifeManager2.knives[0].setActivate();
          }
          this.knifeManager2.numOfKnife--;

          // phóng hết dao
          if (this.knifeNumber2 === 0) {
            this._onWin();
            this.knifeManager2.setObsFall();
            this.board.setBroken2();
            this.resultUI.messageText.text = "Player2 Win";
            this.resultUI.buttonText.text = "Restart";
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

  _rotateKnife2(knife) {
    knife.x = this.board.x;
    knife.y = this.board.y;
    knife.anchor.set(0.5, 1.5);
    knife.collider.anchor.set(0.5, 1.5);
  }

  _syncRotate() {
    this.knifeManager1.boardAngleRotation = this.board.angleRotation;
    this.knifeManager2.boardAngleRotation = this.board.angleRotation;
  }

  _cal4PointKnife(knife) {
    let w = knife.collider.getBounds().width;
    let h = knife.collider.getBounds().height;
    let x = knife.collider.getBounds().x;
    let y = knife.collider.getBounds().y;
    return [x, y, x + w, y, x + w, y + h, x, y + h];
  }

  _onClicky1(e) {
    if (this.state === GameState.Playing) {
        if (this.knifeNumber1 > 0) {
            if (this.knifeManager1.onClicky(e)) {
            this.dualUI.updateKnifeIcon(this.dataManager.numOfDualKnife() - this.knifeNumber1--);
            }
          }
    }
  }

  _onClicky2(e) {
    if (this.state === GameState.Playing) {
      if (this.knifeNumber2 > 0) {
        if (this.knifeManager2.onClicky(e)) {
          this.dualUI.updateKnifeIcon2(this.dataManager.numOfDualKnife() - this.knifeNumber2--);
        }
      }
    }
  }
}
