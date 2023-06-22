import { Container } from "pixi.js";
import { Level1 } from "../scenes/playScene";
import { Knife } from "./knife";
import { Game } from "../../game";

import { GameConstant } from "../../gameConstant";



export class KnifeManager extends Container {
    constructor() {
        super();
        this.knives = [];
        this.obsKnives = [];
        this.numOfKnife = Level1.KNIFE_NUMBER - 1; //so dao trong pool
        this._spawnKnives();
        window.addEventListener("click", (e) => this._onClicky(e));
    }

    _spawnKnives() {
        this._spawnFirstKnife();
        for ( let i = 0; i < this.numOfKnife; i++) {
            this._spawnAnotherKnife();
        }
    }

    _spawnFirstKnife() {
        let knife = new Knife(Game.bundle.knife);
        knife.x = GameConstant.KNIFE_X_POSITION;
        knife.y = GameConstant.KNIFE_Y_POSITION;
        knife.isActive = true;
        this.knives.push(knife);
        this.addChild(knife);
    }

    _spawnAnotherKnife() {
        let knife = new Knife(Game.bundle.knife);
        knife.x = GameConstant.KNIFE_X_POSITION;
        knife.y = 1280;
        knife.visible = false;
        this.knives.push(knife);
        this.addChild(knife);
    }

    update(dt) {
        this.knives.forEach(knife => {
            knife.update(dt);
        });
        this.obsKnives.forEach(knife => {
            knife.update(dt);
        })
    }

    _onClicky(e) {
        // this.knives.forEach(knife => {
        //     if(!knife.isMove) {
        //         knife.isMove = true;
        //         knife.move();
        //     }
        // })
        // if (this.numOfKnife > 0) {
        //     //this._spawnAnotherKnife();
        //     this.numOfKnife--;
        // }
        
        if (this.knives[0].isActive) {
            this.knives[0].move();
            console.log(this.obsKnives.length, this.knives.length);
        }
        
    }
}