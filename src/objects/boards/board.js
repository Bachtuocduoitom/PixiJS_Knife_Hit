import { AnimatedSprite, Sprite, Texture, Container} from "pixi.js";
import { Collider } from "../physics/collider";
import { Game } from "../../game";
import { Fragments } from "../breakUp/fragments";
import { GameConstant } from "../../gameConstant";
export class Board extends Sprite {
    constructor(texture) {
        super(texture);
        this.anchor.set(0.5);
        this.scale.set(0.8);
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
        // this.changeRotation();
    }

    changeRotation() {
        this.numRotation = this.rotation / (Math.PI * 2);
        console.log(this.numRotation);
        if (this.numRotation > 2) {
          setTimeout(() => {
            this.angleRotation -= 0.00005;
          }, 500)
        }
        if (this.numRotation < 0) {
          this.angleRotation += 0.02;
        }
      }
}