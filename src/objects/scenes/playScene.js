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
import { AdjustmentFilter } from "@pixi/filter-adjustment";
import { DataManager } from "../level/dataManager";
import * as TWEEN from "@tweenjs/tween.js";
import { MenuUI } from "../ui/menuUI";

export const GameState = Object.freeze({
  Tutorial: "tutorial",
  Playing: "playing",
  Win: "win",
  Lose: "lose",
});

export class PlayScene extends Container {
  constructor() {
    super();
    this.state = GameState.Tutorial;
    this.score = 0;
    this.appleScore = 0;
    this.currentLevel = 1;
    this._initGamePlay();
    this._initUI();
  }

  _initAppleScore() {
    if (localStorage.getItem("appleScore") === null) {
      this.appleScore = 0;
      localStorage.setItem("appleScore", 0)
    } else {
      this.appleScore = localStorage.getItem("appleScore");
    }
  }

  _initGamePlay() {
    this._initDataManager();
    this.gameplay = new Container();
    this.gameplay.eventMode = "static";
    this.gameplay.sortableChildren = true;
    this.knifeNumber = this.dataManager.numOfKnife();
    this.currentDt = 0;
    this.addChild(this.gameplay);
    this._initBackground();
    this._initBoard();
    this._initKnifeManager();
    this._initObstacle();
    this._initParticles();
    this._initSound();
    this._initCircleFlare();
    this.gameplay.on("pointerdown", (e) => this._onClicky(e));
  }

  _initUI() {
    //tao play UI
    this.playUI = new PlayUI(this.dataManager, this.score, this.appleScore);
    this.addChild(this.playUI);
    this.playUI.on("backHome", (e) => this._backHome(e));
    // result UI
    this.resultUI = new ResultGameUI();
    this.addChild(this.resultUI);
    //tao tutorial UI
    if (this.currentLevel === 1) {
      this.tutorialUI = new TutorialUI();
      this.addChild(this.tutorialUI);
      this.tutorialUI.on("tapped", (e) => this._onStart(e));
    } else {
      this.state = GameState.Playing;
    }
    this.resultUI.hide();
    this.resultUI.on("tapped", (e) => this._onContOrRestart(e));
    this.resultUI.on("home", (e) => this._backHome(e));
    this._initParticlesResultgame();
  }

  _initDataManager() {
    this.dataManager = new DataManager(this.currentLevel);
  }

  _initBackground() {
    this.background = new Background(Game.bundle.background);
    this.background.x = 0;
    this.background.y = 0;
    this.gameplay.addChild(this.background);
  }

  _initBoard() {
    this.board = new Board(this.dataManager.getBoardDataLevel());
    this.board.x = GameConstant.BOARD_X_POSITION;
    this.board.y = GameConstant.BOARD_Y_POSITION;
    this.gameplay.addChild(this.board);
    this.board.zIndex = 100;
  }

  _initKnifeManager() {
    this.knifeManager = new KnifeManager(this.dataManager.getKnifeDataLevel());
    this.knifeManager.x = 0;
    this.knifeManager.y = 0;
    this.gameplay.addChild(this.knifeManager);
    this.knifeManager.zIndex = 0;
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
    if (this.dataManager.haveKnifeOnBoard()) {
      this.knifeManager.spawnObsKnives(this.avaiAngle);
    }

    // create tao can tren board
    this._initAppleManager();
    if (this.dataManager.haveAppleOnBoard()) {
      this.appleManager.spawnApples(this.avaiAngle);
    }
  }

  _initAppleManager() {
    this.appleManager = new AppleManager(this.dataManager.getAppleDataLevel());
    this.appleManager.x = 0;
    this.appleManager.y = 0;
    this.gameplay.addChild(this.appleManager);
    this.appleManager.zIndex = 101;
  }

  // Check if win or lose
  _onContOrRestart() {
    if (this.resultUI.messageText.text === "You lose" ||this.currentLevel === 4) {
      this._onRestartGame();
    } else {
      this._onContGame();
    }
  }

  // Xử lí click tiếp tục
  _onContGame() {
    //update level
    this.currentLevel++;
    this.winGame.stop();

    //destroy gameplay and initial new one
    this.removeChild(this.gameplay);
    this.gameplay.destroy();

    //destroy UI and initial new ones
    this.removeChild(this.playUI, this.tutorialUI, this.resultUI);
    this.playUI.destroy();
    this.tutorialUI.destroy();
    this.resultUI.destroy();

    //init new UI and gameplay
    this._initGamePlay();
    this._initUI();
  }

  // xử lí click restart
  _onRestartGame() {
    //update level
    this.currentLevel = 1;
    this.loseGame.stop();

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
  }

  _backHome(e) {
    this.parent.norToHome();
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
  }

  update(dt) {
    this.currentDt += dt;
    // /TWEEN.update(this.currentDt);
    this.knifeManager.update(dt);
    this.appleManager.update(dt);
    this.board.update(dt);
    this._onCollision();
    this._syncRotate();

    if (this.state === GameState.Tutorial) {
      this.tutorialUI.updateUI(dt);
    }
  }

  _initCircleFlare() {
    //tao hin tron loe sang
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
  
  _onStart(e) {
    this.state = GameState.Playing;
    this.tutorialUI.hide();
    this._onClicky(e);
  }
  _onWin() {
    // tạo âm thanh
    this.boardBroken.play();
    // Hiện và xử lí các mảnh vỡ bay ra
    this.board.breakUp();
    this.knifeManager.setObsFall();
    this.appleManager.setApplesFall();
    // Hiện UI result và sound
    setTimeout(() => {
      this.winGame.play();
    }, 1000);
    setTimeout(() => {
      this.state = GameState.Win;
      this.resultUI.show();
      //tao hiệu ứng chiến thắng
      let winGameParticle = new Emitter(
        this.particleContainerResult,
        upgradeConfig(Game.bundle.winGameParticle, [
          Game.bundle.particleStar,
          Game.bundle.particle,
        ])
      );
      winGameParticle.updateSpawnPos(
        this.resultUI.messageText.x + this.resultUI.messageText.width / 2,
        this.resultUI.messageText.y
      );
      winGameParticle.playOnceAndDestroy();
    }, 1200);
    // hình tròn và vòng tròn xuất hiện
    this._showCircleFlare();
  }

  _onLose() {
    // Tạo âm thanh va dao
    this.kHitKSound.play();
    // Dao rơi
    this.knifeManager.knives[0].setFall();
    this._showKnifeCollisionFlare(this.knifeManager.knives[0]); // Tạo hiệu ứng
    this.board.setStop();

    //dich chuyen nhe go tao va  dao
    this.board.onHit();
    this.knifeManager.onBoardHit();
    this.appleManager.onBoardHit();

    setTimeout(() => {
      this.loseGame.play(); // âm thanh thua
    }, 500);
    setTimeout(() => {
      this.state = GameState.Lose;
      this.resultUI.showLoseBox(); // Hiện result UI
    }, 1500);
  }

  _onCollision() {
    if (this.knifeManager.knives[0] != null) {
      if (this.knifeManager.knives[0].state === "move") {
        //va cham dao
        if (this.knifeManager.knives[0].y >= 590) {
          this.knifeManager.obsKnives.forEach((knife) => {
            if (
              Util.SATPolygonPolygon(
                this._cal4PointKnife(this.knifeManager.knives[0]),
                Util.find4Vertex(knife)
              )
            ) {
              this._onLose();
            }
          });
        }

        //va cham tao
        this.appleManager.apples.forEach((apple) => {
          if (Util.SATPolygonPolygon(this._cal4PointKnife(this.knifeManager.knives[0]),Util.find4Vertex(apple))) {
            this.kHitApple.play();
            this.appleManager.removeApple(apple);
            //tang diem
            this.playUI.updateAppleScore(++this.appleScore);
          }
        });

        //va cham go
        if (Util.AABBCheck(this.knifeManager.knives[0].collider,this.board.collider)) {
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

          //bien dao thanh vat can
          this.knifeManager.knives[0].beObs();

          //quay dao theo khoi go
          this._rotateKnife(this.knifeManager.knives[0]);
          this.knifeManager.obsKnives.push(this.knifeManager.knives.shift());
          if (this.knifeManager.numOfKnife > 0) {
            this.knifeManager.knives[0].setActivate();
          }
          this.knifeManager.numOfKnife--;

          // phóng hết dao
          if (this.knifeNumber === 0) {
            this._onWin();
            this.board.setBroken();
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
          this.playUI.updateKnifeIcon(
            this.dataManager.numOfKnife() - this.knifeNumber--
          );
        }
      }
    }
  }
}
