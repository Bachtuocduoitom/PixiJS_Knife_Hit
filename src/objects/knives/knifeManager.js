import { Container, Graphics } from "pixi.js";
import { Level1, PlayScene } from "../scenes/playScene";
import { Knife } from "./knife";
import { Game } from "../../game";

import { GameConstant } from "../../gameConstant";



export class KnifeManager extends Container {
    constructor() {
        super();
        this.knives = [];
        this.obsKnives = [];
        this.numOfKnife = Level1.KNIFE_NUMBER - 1; //so dao trong pool
        this.boardAngleRotation = 0;
        // this.velocity = {x: 0, y: 0};
        // this.gravity = 0.5;
        this.graphic = new Graphics();
        this.addChild(this.graphic);
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
        this.graphic.clear();

        this.knives.forEach(knife => {
            knife.update(dt);

            //ve bound
            // this.graphic.beginFill(0x880808, 1);
            // this.graphic.drawRect(knife.collider.getBounds().x, knife.collider.getBounds().y, knife.collider.getBounds().width, knife.collider.getBounds().height);
            // this.graphic.endFill();
        });

        this.obsKnives.forEach(knife => {
            knife.angleRotation = this.boardAngleRotation;
            knife.update(dt);
            //ve bound
            // this.graphic.beginFill(0x880808, 1);
            // this.graphic.drawRect(knife.collider.getBounds().x, knife.collider.getBounds().y, knife.collider.getBounds().width, knife.collider.getBounds().height);
            // this.graphic.endFill();
            // console.log(- knife.angle *Math.PI / 180 % (2* Math.PI));
            // let bb = knife.collider.getBounds()
            // console.log(bb.x + bb.width/2, bb.y + bb.height/2);
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