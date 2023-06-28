import { Sprite, Container } from "pixi.js";
import { Collider } from "../physics/collider";
export class Fragments extends Sprite {
    constructor(texture) {
        super(texture);
        this.anchor.set(0.5);
        this.scale.set(0.7);
        this.visible = true;
    }
   
}