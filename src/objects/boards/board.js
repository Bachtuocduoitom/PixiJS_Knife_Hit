import { Sprite } from "pixi.js";

export class Board extends Sprite {
    constructor(texture) {
        super(texture);
        this.anchor.set(0.5);
        this.scale.set(0.7);
    }

    update(dt) {
        this.rotation += 0.03;
    }
}