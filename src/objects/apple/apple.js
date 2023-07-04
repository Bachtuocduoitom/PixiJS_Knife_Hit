import { Sprite } from "pixi.js";
import { Collider } from "../physics/collider";
import * as TWEEN from "@tweenjs/tween.js";
import { GameConstant } from "../../gameConstant";

export class Apple extends Sprite {
    constructor(texture) {
        super(texture);
        this.isFall = false;
        this.angleRotation = 0;
        this.currentTime = 0;
        this._initCollider();
    }

    _initCollider() {
        this.collider = new Collider();
        this.collider.width = this.width;
        this.collider.height = this.height - 10;
        this.addChild(this.collider);
    }

    setFall() {
        this.isFall = true;
        this.y = this.collider.getBounds().y + this.collider.getBounds().height/2;
        this.x = this.collider.getBounds().x + this.collider.getBounds().width/2;
        this.anchor.set(0.5);
        this.collider.anchor.set(0.5);
        
    }

    update(dt) {
        if (!this.isFall) {
            this.rotation += this.angleRotation;
        } else {
            
            this.y += 20 + 1/2 * 9.8 * dt * dt;
            this.rotation += 0.1;
        }
        this.currentTime += dt;
    }

    moveUpABit() {
        new TWEEN.Tween(this).to({y: this.y - 10}, GameConstant.JUMP_TIMER).yoyo(true).repeat(1).start(this.currentTime);
    }
    
}