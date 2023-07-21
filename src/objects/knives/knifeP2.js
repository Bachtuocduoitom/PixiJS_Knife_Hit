import { Sprite } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { Collider } from "../physics/collider";
import { Util } from "../../helper/utils";
import * as TWEEN from "@tweenjs/tween.js";
import { KnifePrototype, KnifeState } from "./knifePrototype";


export class KnifeP2 extends KnifePrototype {
    constructor(texture) {
        super(texture);
    }
    
    _toActive() {
        super._toActive();
        new TWEEN.Tween(this).to({y: GameConstant.KNIFE_P2_Y_POSITION}, 20).onComplete(() => {
            this.state = KnifeState.ACTIVATED;
        }).start();
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
        this.fallRotation = Util.random(0.05, 0.08);
        this.fallX = Util.random(8,15);
        this.fallY = Util.random(20,25);
    }

    setLastObsFall() {
        this.setFall();
        this.isLastOne = true;
        this.fallRotation = Util.random(0.05, 0.08);
        this.fallX = Util.random(-5,5);
        this.fallY = Util.random(15,20);
    }


    update(dt) {
        super.update(dt);
        this.currentTime += dt;
        switch (this.state) {
            case "move":
                this.y += this.speed * dt;
                break;
            case "active":
                this._toActive();
                break;
            case "fall":
                if (this.isFallDownLeft) {
                    this.x -= this.fallX*dt;
                    this.y += this.fallY*dt;
                    this.rotation += this.fallRotation;
                } else if (this.isFallDownRight) {
                    this.x += this.fallX*dt;
                    this.y += this.fallY*dt;
                    this.rotation -= this.fallRotation;
                } else if(this.isFallUpLeft) {
                    this.x -= this.fallX*dt;
                    this.y -= this.fallY*dt;
                    this.rotation -= this.fallRotation;
                } else if(this.isFallUpRight) {
                    this.x += this.fallX*dt;
                    this.y -= this.fallY*dt;
                    this.rotation -= this.fallRotation;
                } else if(this.isLastOne) {
                    this.x -= this.fallX*dt;;
                    this.y -= this.fallY*dt;
                    this.rotation -= this.fallRotation;
                } else {
                    this.y -= 20 - 1/2 * 9.8 * dt * dt;
                    this.rotation += 0.1;
                }
                break;
            
            case "obstacle":
                this.rotation += this.angleRotation * dt;
                break;

        }

    }
   
}