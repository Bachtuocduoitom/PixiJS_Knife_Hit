import { Container, Sprite } from "pixi.js";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";

export class Background extends Container {
    constructor(texture) {
        super(); 
        this._initSprite(texture);
        this.width = GameConstant.GAME_WIDTH;
        this.height = GameConstant.GAME_HEIGHT; 
    }

    _initSprite(texture) {
        this.sprite = Sprite.from(texture);
        this.addChild(this.sprite);
    }
}