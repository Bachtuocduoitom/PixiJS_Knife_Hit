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
        this.numOfApple = Math.round(Util.random(0,2));
        this.boardAngleRotation = 0;
        this.graphic = new Graphics();
        this.addChild(this.graphic);
        this._spawnSlices();
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
        let i = Math.round(Util.random(0,17));
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

    _spawnSlices() {
        //lat cat 1
        this.slice1 = new Sprite(Game.bundle.apple_slice_1);
        this.slice1.anchor.set(0.5);
        this.slice1.visible = false;
        this.addChild(this.slice1);

        //lat cat 2
        this.slice2 = Sprite.from(Game.bundle.apple_slice_2);
        this.slice2.anchor.set(0.5);
        this.slice2.visible = false;
        this.addChild(this.slice2);

      
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

    removeApple(apple) {
        //lat cat 1
        this.slice1.x = apple.getBounds().x + apple.getBounds().width/2;
        this.slice1.y = apple.getBounds().y + apple.getBounds().height/2;
        this.slice1.visible = true;
        

        //lat cat 2
        this.slice2.x = apple.getBounds().x + apple.getBounds().width/2;
        this.slice2.y = apple.getBounds().y + apple.getBounds().height/2;
        this.slice2.visible = true;


        new TWEEN.Tween(this.slice1).to({x: this.slice1.x - 50, y: this.slice1.y - 50}, 8).onComplete(() => {
            new TWEEN.Tween(this.slice1).to({x: this.slice1.x - 200, y: 1350}, 30).start(this.currentTime)
        }).start(this.currentTime);

        new TWEEN.Tween(this.slice2).to({x: this.slice2.x + 50, y: this.slice2.y - 50}, 10).onComplete(() => {
            new TWEEN.Tween(this.slice2).to({x: this.slice2.x + 200, y: 1350}, 25).start(this.currentTime)
        }).start(this.currentTime);
        
        this.removeChild(apple);
        this.apples.splice(this.apples.indexOf(apple), 1);
    }

}