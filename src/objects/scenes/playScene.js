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

import { BoxNotice } from "../BoxNoti/boxNotice";
import * as TWEEN from "@tweenjs/tween.js";
export const GameState = Object.freeze({
    Tutorial: "tutorial",
    Playing: "playing",
    Win: "win",
    Lose: "lose"
})
export const Level1 = Object.freeze({
    KNIFE_NUMBER: 7,
})
export class PlayScene extends Container {
    constructor() {
        super();
        this.state = GameState.Tutorial;
        this.appleScore = 0;
        this.score = 0;
        this._initGamePlay();
        this.currentDt =0;
        this._initUI();
    }
    
    _initGamePlay() {
        this.gameplay = new Container();
        this.gameplay.eventMode = 'static';
        this.gameplay.sortableChildren = true;
        this.knifeNumber = Level1.KNIFE_NUMBER;
        this.addChild(this.gameplay);
        this._initBackground();
        this._initBoard();
        this._initKnifeManager();
        this._initObstacle();
        this._initParticles();
        this._initSound();
        this.gameplay.on("pointerdown", (e) => this._onClicky(e));
        //window.addEventListener("pointerdown", (e) => this._onClicky(e));
    }

    _initUI() {
        //tao play UI
        this.playUI = new PlayUI(this.score, this.appleScore);
        this.addChild(this.playUI);

        //tao lobby UI
        this.tutorialUI = new TutorialUI();
        this.tutorialUI.zIndex = 200;
        this.addChild(this.tutorialUI);

        this.tutorialUI.on("tapped", (e) => this._onStart(e));
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
        //this.board.zIndex = 100;
    }

    _initKnifeManager() {
        this.knifeManager = new KnifeManager();
        this.knifeManager.x = 0;
        this.knifeManager.y = 0; 
        this.gameplay.addChild(this.knifeManager);
        this.knifeManager.zIndex = 0;
    }

    _initObstacle() {
        this.avaiAngle = [];
        for(let i = 0; i < 18; i++) {
            this.avaiAngle[i] = {
                angle: i*20,
                available: true,
            }
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
    }
    
    update(dt) {
        // this.currentDt += dt;
        // TWEEN.update(this.currentDt);
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

    _onStart(e) {
        this.state = GameState.Playing;
        this.tutorialUI.hide();
        this._onClicky(e);
    }

    _onCollision() {
        if (this.knifeManager.knives[0] != null) {
            if (this.knifeManager.knives[0].isMove) {
                //va cham dao
                if (this.knifeManager.knives[0].y >= 610) {
                    this.knifeManager.obsKnives.forEach(knife => {
                        if (Util.SATPolygonPolygon(this._cal4PointKnife(this.knifeManager.knives[0]), Util.find4Vertex(knife))) {
                            console.log("aaaaa");
                            this.kHitKSound.play();
                            this.knifeManager.knives[0].setFall();
                            this.boxNotice = new BoxNotice();
                            setTimeout(() => {
                                this.state = GameState.Lose;
                                this.gameplay.removeChild(this.board);
                                this.gameplay.removeChild(this.knifeManager);
                                this.gameplay.removeChild(this.appleManager);
                                this.gameplay.addChild(this.boxNotice);
                                this.boxNotice.messageText.text = 'You lose !';
                                this.boxNotice.buttonText.text = 'Chơi lại'
                                this.boxNotice.messageText.style.fill = 'red';
                            }, 1500)
                            this.boxNotice.button.on("pointerdown", () => {
                                //this.gameplay.removeChild(this.boxNotice);
                                this.removeChild(this.gameplay);
                                this._initGamePlay();
                                this._initUI();
                            
                                //this._restartGame();
                            });
                        } 
                    }); 
                }
                
                //va cham tao
                this.appleManager.apples.forEach(apple => {
                    if (Util.SATPolygonPolygon(this._cal4PointKnife(this.knifeManager.knives[0]), Util.find4Vertex(apple))) {
                        console.log("xuyen tao");
                        this.kHitApple.play();
                        this.appleManager.removeApple(apple);

                        //tang diem
                        this.playUI.updateAppleScore(++this.appleScore);
                        console.log(this.appleManager.apples);
                    } 
                });
                
                //va cham go
                if (!this.knifeManager.knives[0].isFall) {

                }
                if (Util.AABBCheck(this.knifeManager.knives[0].collider, this.board.collider)) {
                    //bien dao thanh vat can
                    this.knifeManager.knives[0].beObs();
                    //bang di chuyen nhe
                    this.board.onHit();
                    //dao can di chuyen nhe
                    this.knifeManager.onBoardHit();
                    //tao am thanh
                    this.kHitWSound.play();
                    //tao vun go khi va cham
                    let logParticle = new Emitter(this.particleContainer, upgradeConfig(Game.bundle.logParticle, [Game.bundle.particle]));
                    logParticle.updateSpawnPos(this.knifeManager.knives[0].x, this.knifeManager.knives[0].y - 30);
                    logParticle.playOnceAndDestroy();
                    //quay dao theo khoi go
                    this._rotateKnife(this.knifeManager.knives[0]);
                    this.knifeManager.obsKnives.push(this.knifeManager.knives.shift());
                    if (this.knifeManager.numOfKnife > 0) {
                        this.knifeManager.knives[0].setActivate();
                        this.knifeManager.numOfKnife--;
                    }
                    // phóng hết dao
                    if (this.knifeManager.knives.length == 0) {
                        this.boardBroken.play();
                        this.board.breakUp();
                        this.board.setBroken();
                        //this.gameplay.removeChild(this.knifeManager);
                        this.knifeManager.setObsFall();
                        this.appleManager.setApplesFall();
                        this.boxNotice = new BoxNotice();
                        setTimeout(() => {
                            this.state = GameState.Win;
                            this.boxNotice = new BoxNotice();
                            this.gameplay.removeChild(this.board);
                            this.gameplay.addChild(this.boxNotice);
                            // click button
                            this.boxNotice.button.on("pointerdown", () => {
                                this.removeChild(this.gameplay);
                                this._initGamePlay();
                                this._initUI();
                            });
                        }, 1500)
                    }
                    
                    //tang diem
                    this.playUI.updateScore(++this.score);
                    console.log("va roi!");
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
        let w = knife.collider.getBounds().width
        let h = knife.collider.getBounds().height
        let x = knife.collider.getBounds().x
        let y = knife.collider.getBounds().y
        return [x, y, x + w, y, x + w, y + h, x, y + h]
    }

    _onClicky(e) {
        if (!(this.state === GameState.Playing)) {
            return;
        }
        
        if ( this.knifeNumber > 0) {
            this.playUI.updateKnifeIcon(Level1.KNIFE_NUMBER - (this.knifeNumber--));
            this.knifeManager._onClicky(e);
        }
    }

}