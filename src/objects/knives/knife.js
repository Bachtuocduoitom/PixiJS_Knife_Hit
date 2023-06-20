import { Sprite } from "pixi.js";

export class Knife extends Sprite {
    constructor(texture) {
        super(texture);

        this.anchor.set(0.5);
        this.isMove = false;
        this.speed = 0;
        window.addEventListener("click", (e) => this._onClicky(e));
    }

    update(dt) {
        this.y -= this.speed * dt;
    }

    _onClicky(e) {
        if(!this.isMove) {
            this.speed = 10;
            this.isMove = true;
        } else {
            this.speed = 0;
            this.isMove = false;
        }
        
    }
}