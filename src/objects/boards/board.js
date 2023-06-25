import { Sprite } from "pixi.js";
import { Collider } from "../physics/collider";

export class Board extends Sprite {
    constructor(texture) {
        super(texture);
        this.anchor.set(0.5);
        //this.scale.set(0.7);
        this.angleRotation = 0.03;
        this._initCollider();
    }

    _initCollider() {
        this.collider = new Collider();
        this.collider.width = 150;
        this.collider.height = 150;
        this.addChild(this.collider);
    }

    update(dt) {
        this.rotation += this.angleRotation;
        this.collider.rotation -= this.angleRotation;
    }
}