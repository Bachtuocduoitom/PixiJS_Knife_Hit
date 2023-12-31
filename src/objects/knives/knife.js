import { Sprite } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { Collider } from "../physics/collider";
import { Util } from "../../helper/utils";
import * as TWEEN from "@tweenjs/tween.js";
import { KnifePrototype } from "./knifePrototype";

export const KnifeState = Object.freeze({
    DEFAULT: "default",
    ACTIVATED: "activated",
    ACTIVATING: "activating",
    ACTIVE: "active",
    MOVE: "move",
    OBSTACLE: "obstacle",
    FALL: "fall",
  });

export class Knife extends KnifePrototype{
    constructor(texture) {
        super(texture);
        
    }

    firstToActive() {
        new TWEEN.Tween(this).to({y: GameConstant.KNIFE_Y_POSITION }, 200).onComplete(() => {
            this.state = KnifeState.ACTIVATED;
        }).start();
    }
    
    _toActive() {
        super._toActive();
        new TWEEN.Tween(this).to({y: GameConstant.KNIFE_Y_POSITION }, 1).onComplete(() => {
            this.state = KnifeState.ACTIVATED;
        }).start();
    }

    update(dt) {
        super.update(dt);
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
   
    
}