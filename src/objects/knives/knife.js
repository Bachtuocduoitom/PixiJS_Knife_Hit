import { Sprite } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { Board } from "../boards/board";
export class Knife extends Sprite {
    constructor(texture) {
        super(texture);

        this.anchor.set(0.5);
        this.scale.set(0.4);
        this.isMove = false;
        this.isActive = false;
        this.setActive = false;
        this.isObs = false;
        this.speed = 0;
        this.angle = 0;
        this.board = new Board();
    }

    move() {
        this.speed = 25;
        this.isMove = true;
    }

    _toActive(dt) {
        if (this.y > GameConstant.KNIFE_Y_POSITION) {
            this.y -= 50*dt;
        } else {
            this.y = GameConstant.KNIFE_Y_POSITION;
            this.isActive = true;
        }
    }

    setActivate() {
        this.setActive = true;
        this.visible = true;
    }

    beObs() {
        this.isObs = true;
        this.isMove = false;
    }

    update(dt) {
        if (!this.isObs) {
            if (!this.isActive) {
                if (this.setActive) {
                    this._toActive(dt);
                }  
            } else {
                if (this.isMove) {
                    this.y -= this.speed * dt;
                }
            }
        } else {
            this.rotation += this.board.initRotation;
        }
        this.board.update(dt);
    }
   

}