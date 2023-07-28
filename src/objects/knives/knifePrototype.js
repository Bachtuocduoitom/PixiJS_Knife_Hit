import { Sprite } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { Collider } from "../physics/collider";
import { Util } from "../../helper/utils";
import * as TWEEN from "@tweenjs/tween.js";

export const KnifeState = Object.freeze({
    DEFAULT: "default",
    ACTIVATED: "activated",
    ACTIVATING: "activating",
    ACTIVE: "active",
    MOVE: "move",
    OBSTACLE: "obstacle",
    FALL: "fall",
});

export class KnifePrototype extends Sprite {
    constructor(texture) {
        super(texture);
        this.anchor.set(0.5);     
        this.state = KnifeState.DEFAULT;    
        this.speed = 0;
        this.angleRotation = 0;
        this.currentTime = 0;
        this._initCollider();
    }

    _initCollider() {
        this.collider = new Collider();
        this.collider.width = this.width/2;
        this.collider.height = this.height;
        this.addChild(this.collider);
    }

    move() {
        this.state = KnifeState.MOVE;
        this.speed = 70;
    }
    
    _toActive() {
        this.state= KnifeState.ACTIVATING;
    }

    setActivate() {
        this.visible = true;
        this.state = KnifeState.ACTIVE;
    }

    setFall() {
        this.state = KnifeState.FALL;
    }

    setAnotherObsFall() {
        this.setFall();
        if ((this.angle%360) <= 180) {
            if((this.angle%360) >= 90) {
                this.isFallUpLeft = true;
            } else {
                this.isFallDownLeft = true;
            }
        } else {
            if((this.angle%360) <= 270) {
                this.isFallUpRight = true;
            } else {
                this.isFallDownRight = true;
            }
        }
        this.fallRotation = Util.random(0.05, 0.1);
        this.fallX = Util.random(8,15);
        this.fallY = Util.random(15,20);
        this.pushForce = 50;
    }

    setLastObsFall() {
        this.setFall();
        this.isLastOne = true;
        this.fallRotation = Util.random(0.05, 0.1);
        this.fallX = Util.random(-5,5);
        this.fallY = Util.random(15,20);
        this.pushForce = 50;
    }

    beObs() {
        this.state = KnifeState.OBSTACLE;
    }

    update(dt) {

    }
   
    moveUpABit() {
        new TWEEN.Tween(this).to({y: this.y - GameConstant.JUMP_DISTANCE}, GameConstant.JUMP_TIMER).yoyo(true).repeat(1).start();
    }

    moveUpABitExtra() {
        new TWEEN.Tween(this).to({y: this.y + GameConstant.JUMP_DISTANCE}, GameConstant.JUMP_TIMER).yoyo(true).repeat(1).start();
    }

    zoomOut() {
        new TWEEN.Tween(this).to({scale: {x:1 ,y: 1}}, 200).start(); 
    }
}