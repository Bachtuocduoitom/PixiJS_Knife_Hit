import { Container, Sprite } from "pixi.js";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";

export class Background extends Container {
    constructor() {
        super(); 
        this._initSprite();
        this.width = GameConstant.GAME_WIDTH;
        this.height = GameConstant.GAME_HEIGHT; 
    }

    _initSprite() {
        this.sprite = Sprite.from(Game.bundle.background);
        this.addChild(this.sprite);
    }
}