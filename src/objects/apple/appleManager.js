import { Container, Graphics, Sprite } from "pixi.js";
import { Level1, PlayScene } from "../scenes/playScene";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Util } from "../../helper/utils";
import { Apple } from "./apple";
import * as TWEEN from "@tweenjs/tween.js";

export class AppleManager extends Container {
    constructor() {
        super();
        this.apples = [];
        this.numOfApple = Util.randomInteger(0, 2);
        this.boardAngleRotation = 0;
        this.graphic = new Graphics();
        this.addChild(this.graphic);
        //this._spawnSlices();
        this.currentTime = 0;
    }

    spawnApples(avaiAngle) {
        for (let i = 0; i < this.numOfApple; i++) {
            this._spawnApple(avaiAngle);
        }
    }

    _spawnApple(avaiAngle) {
        let apple = new Apple(Game.bundle.apple);
        apple.x = GameConstant.BOARD_X_POSITION;
        apple.y = GameConstant.BOARD_Y_POSITION;
        apple.anchor.set(0.5, -2.6);
        apple.collider.anchor.set(0.5, -3);
        this._setAppleAng(apple, avaiAngle);
        this.apples.push(apple);
        this.addChild(apple);
    }

    _setAppleAng(apple, avaiAngle) {
        let i = Util.randomInteger(0, 17);
        while (!avaiAngle[i].available) {
            if (i === 17) {
                i = 0;
            } else {
                ++i;
            }
        }
        apple.angle = avaiAngle[i].angle;
        avaiAngle[i].available = false;
    }

  

    update(dt) {
        this.currentTime += dt;
        TWEEN.update(this.currentTime);
        this.graphic.clear();
        this.apples.forEach(apple => {
            apple.update(dt);
            apple.angleRotation = this.boardAngleRotation;
        })  
        //console.log(this.slice1.x, this.slice1.y);
    }

    setApplesFall() {
        this.apples.forEach(apple => {
            apple.setFall();
        })
    }
    removeApple(apple) {
        //lat cat 1
        let slice1 = new Sprite(Game.bundle.apple_slice_1);
        slice1.anchor.set(0.5);
        slice1.x = apple.getBounds().x + apple.getBounds().width/2;
        slice1.y = apple.getBounds().y + apple.getBounds().height/2;
        this.addChild(slice1);

        //lat cat 2
        let slice2 = new Sprite(Game.bundle.apple_slice_2);
        slice2.anchor.set(0.5);
        slice2.x = apple.getBounds().x + apple.getBounds().width/2;
        slice2.y = apple.getBounds().y + apple.getBounds().height/2;
        this.addChild(slice2);

        //loe sang
        let flare = new Sprite(Game.bundle.flare);
        flare.alpha = 0;
        flare.tint = 0xFFFAFA;
        flare.scale.set(0.2);
        flare.anchor.set(0.5);
        flare.x = apple.getBounds().x;
        flare.y = apple.getBounds().y + apple.getBounds().height;
        this.addChild(flare);


        new TWEEN.Tween(slice1).to({x: slice1.x - 90, y: slice1.y - 120}, 13).onComplete(() => {
            new TWEEN.Tween(slice1).to({x: slice1.x - 150, y: 1350}, 35).start(this.currentTime).onComplete(() => {
                this.removeChild(slice1);
                slice1.destroy();
            });
        }).start(this.currentTime);

        //new TWEEN.Tween(this.slice2).to({x: this.slice2.x + 40, y: this.slice2.y - 50}, 9).onComplete(() => {
            new TWEEN.Tween(slice2).to({x: slice2.x + 150, y: 1350}, 35).start(this.currentTime).onComplete(() => {
                this.removeChild(slice2);
                slice2.destroy();
            });
        //}).start(this.currentTime);

        new TWEEN.Tween(flare).to({alpha: 1, scale: { x: 1.0, y: 1.0 }}, 5).yoyo(true).repeat(1).start(this.currentTime).onComplete(() => {
            this.removeChild(flare);
            flare.destroy();
        });;
        
        this.removeChild(apple);
        this.apples.splice(this.apples.indexOf(apple), 1);
    }

    onBoardHit() {
        this.apples.forEach(apple => {
           apple.moveUpABit();
        })
    }

}