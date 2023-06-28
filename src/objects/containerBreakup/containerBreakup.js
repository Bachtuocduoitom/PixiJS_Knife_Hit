import { Sprite, Container } from "pixi.js";
export class ContainerBreakup extends Container {
    constructor(texture) {
        super(texture);
        this._initCollider();
    }
    _initCollider() {
        this.collider = new Collider();
        this.collider.width = 150;
        this.collider.height = 150;
        this.addChild(this.collider);
    }
    update() {

    }
}