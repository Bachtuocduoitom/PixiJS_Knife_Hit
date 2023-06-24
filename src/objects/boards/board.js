import { Sprite } from "pixi.js";

export class Board extends Sprite {
    constructor(texture) {
        super(texture);
        this.anchor.set(0.5);
        this.scale.set(0.7);
        // this.numRotation = this.rotation / (Math.PI * 2);
        this.initRotation = 0.03;
    }

    update(dt) {
        this.rotation += this.initRotation;
        this.changeRotation();
    }
    changeRotation() {
        this.numRotation = this.rotation / (Math.PI * 2);
        console.log(this.numRotation);
        if (this.numRotation > 2) {
          setTimeout(() => {
            this.initRotation -= 0.00005;
          }, 500)
        }
        if (this.numRotation < 0) {
          this.initRotation += 0.02;
        }
      }
}