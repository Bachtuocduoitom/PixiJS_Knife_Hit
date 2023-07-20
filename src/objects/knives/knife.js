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

export class Knife extends Sprite {
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
        new TWEEN.Tween(this).to({y: GameConstant.KNIFE_Y_POSITION}, 1).onComplete(() => {
            this.state = KnifeState.ACTIVATED;
        }).start();
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
        this.fallRotation = Util.random(0.1, 0.3);
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
        this.currentTime += dt;
        switch (this.state) {
            case "move":
                this.y -= this.speed * dt;
                break;

            case "active":
                this._toActive();
                break;

            case "fall":
                if (this.isFallDownLeft) {
                    this.x += this.fallX*dt;
                    this.y += this.fallY*dt + 1/2 * 9.8 * dt * dt;
                    this.rotation += this.fallRotation;
                } else if (this.isFallDownRight) {
                    this.x -= this.fallX*dt;
                    this.y += this.fallY*dt + 1/2 * 9.8 * dt * dt;
                    this.rotation -= this.fallRotation;
                } else if(this.isFallUpLeft) {
                    this.x += this.fallX*dt;
                    this.y += this.fallY*dt + 1/2*9.8*dt*dt - this.pushForce*dt;
                    this.rotation -= this.fallRotation;
                    this.pushForce --;
                } else if(this.isFallUpRight) {
                    this.x -= this.fallX*dt;
                    this.y += this.fallY*dt + 1/2*9.8*dt*dt - this.pushForce*dt;
                    this.rotation -= this.fallRotation;
                    this.pushForce --;
                } else if(this.isLastOne) {
                    this.x -= this.fallX*dt;;
                    this.y += this.fallY*dt + 1/2*9.8*dt*dt - this.pushForce*dt;
                    this.rotation -= this.fallRotation;
                    this.pushForce --;
                } else {
                    this.y += 20 + 1/2 * 9.8 * dt * dt;
                    this.rotation += 0.1;
                }
                break;
            
            case "obstacle":
                this.rotation += this.angleRotation * dt;
                break;

        }

    }
   
    moveUpABit() {
        new TWEEN.Tween(this).to({y: this.y - GameConstant.JUMP_DISTANCE}, GameConstant.JUMP_TIMER).yoyo(true).repeat(1).start();
      }
}