import { Sprite } from "pixi.js";

export class Knife extends Sprite {
    constructor(texture) {
        super(texture);

        this.anchor.set(0.5);
        this.scale.set(0.5);
        this.isMove = false;
        this.speed = 0;
        
    }

    move() {
        this.speed = 20;
        this.isMove = true;
    }

    update(dt) {
        this.y -= this.speed * dt;
    }


}