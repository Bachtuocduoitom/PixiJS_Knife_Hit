import { Sprite } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { Collider } from "../physics/collider";
import { Util } from "../../helper/utils";
import * as TWEEN from "@tweenjs/tween.js";

export class Knife extends Sprite {
    constructor(texture) {
        super(texture);
        this.anchor.set(0.5);         
        this.isMove = false;
        this.isActive = false; //da chuan bi de bi phong chua
        this.startActive = false; //da bat dau set active chua
        this.isObs = false;
        this.isFall = false;
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
        this.speed = 70;
        this.isMove = true;
    }

    _toActive(dt) {
        if (this.y > GameConstant.KNIFE_Y_POSITION) {
            this.y -= 70*dt;
        } else {
            this.y = GameConstant.KNIFE_Y_POSITION;
            this.isActive = true;
        }
    }
    setActivate() {
        this.startActive = true;
        this.visible = true;
    }

    setFall() {
        this.isFall = true;
    }

    setEndFall() {
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

    setLastFall() {
        this.isLast = true;
        this.fallRotation = Util.random(0.05, 0.1);
        this.fallX = Util.random(-5,5);
        this.fallY = Util.random(15,20);
        this.pushForce = 50;
    }

    beObs() {
        this.isObs = true;
        this.isMove = false;
    }

    update(dt) {
        if (!this.isObs) {
            if (!this.isActive) {
                if (this.startActive) {
                    this._toActive(dt);
                }  
            } else {
                if (this.isMove) {
                    this.y -= this.speed * dt;
                }
                if (this.isFall) {
                    this.speed = 0;
                    this.y += 20 + 1/2 * 9.8 * dt * dt;
                    this.rotation += 0.1;
                }
            }
        } else {
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
            } else if(this.isLast) {
                this.x -= this.fallX*dt;;
                this.y += this.fallY*dt + 1/2*9.8*dt*dt - this.pushForce*dt;
                this.rotation -= this.fallRotation;
                this.pushForce --;
            } else {
                this.rotation += this.angleRotation;
            }
        }
        this.currentTime += dt;
    }
   
    moveUpABit() {
        new TWEEN.Tween(this).to({y: this.y - 10}, GameConstant.JUMP_TIMER).yoyo(true).repeat(1).start(this.currentTime);
      }
}