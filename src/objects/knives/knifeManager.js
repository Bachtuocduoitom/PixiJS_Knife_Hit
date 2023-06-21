import { Container } from "pixi.js";
import { Level1 } from "../scenes/playScene";
import { Knife } from "./knife";
import { Game } from "../../game";

import { GameConstant } from "../../gameConstant";



export class KnifeManager extends Container {
    constructor() {
        super();
        this.knives = [];
        this.numOfKnife = Level1.KNIFE_NUMBER - 1;
        this._spawnKnife();
        window.addEventListener("click", (e) => this._onClicky(e));
    }

    // _spawnKnives() {
    //     for ( let i = 0; i < Level1.KNIFE_NUMBER; i++) {
    //         let knife = new Knife(Game.bundle.knife);
    //         knife.x = this.x;
    //         knife.y = this.y;
    //         this.knives.push(knife);
    //         this.addChild(knife);
    //     }
    // }

    _spawnKnife() {
        let knife = new Knife(Game.bundle.knife);
        knife.x = GameConstant.GAME_WIDTH / 2;
        knife.y = GameConstant.GAME_HEIGHT /2 - 20;
        this.knives.push(knife);
        this.addChild(knife);
    }

    update(dt) {
        this.knives.forEach(knife => {
            knife.update(dt);
        });
    }

    _onClicky(e) {
        this.knives.forEach(knife => {
            if(!knife.isMove) {
                knife.isMove = true;
                knife.move();
            }
        })
        if (this.numOfKnife > 0) {
            this._spawnKnife();
            this.numOfKnife--;
        }
    }
}