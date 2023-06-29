import { Sprite } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { Collider } from "../physics/collider";

export class Knife extends Sprite {
    constructor(texture) {
        super(texture);
        this.scale.set(0.3);
        this.anchor.set(0.5);         
        this.isMove = false;
        this.isActive = false; //da chuan bi de bi phong chua
        this.startActive = false; //da bat dau set active chua
        this.isObs = false;
        this.isFall = false;
        this.speed = 0;
        this.angleRotation = 0;
        this._initCollider();
    }

    _initCollider() {
        this.collider = new Collider();
        this.collider.width = this.width/2;
        this.collider.height = this.height;
        this.addChild(this.collider);
    }

    move() {
        this.speed = 100;
        this.isMove = true;
    }

    _toActive(dt) {
        if (this.y > GameConstant.KNIFE_Y_POSITION) {
            this.y -= 100*dt;
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
            this.rotation += this.angleRotation;
        }
        
    }
   

}