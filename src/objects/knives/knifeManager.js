import { Container, Graphics } from "pixi.js";
import { Level1, PlayScene } from "../scenes/playScene";
import { Knife, KnifeState } from "./knife";
import { Game } from "../../game";

import { GameConstant } from "../../gameConstant";
import { Util } from "../../helper/utils";



export class KnifeManager extends Container {
    constructor() {
        super();
        this.knives = [];
        this.obsKnives = [];
        this.numOfKnife = Level1.KNIFE_NUMBER - 1; //so dao trong pool
        this.boardAngleRotation = 0;
        this.graphic = new Graphics();
        this.addChild(this.graphic);
        this._spawnKnives(); // sinh dao
        
    }

    _spawnKnives() {
        this._spawnFirstKnife();
        for ( let i = 0; i < this.numOfKnife; i++) {
            this._spawnAnotherKnife();
        }
    }

    //sinh dao dau tien
    _spawnFirstKnife() {
        let knife = new Knife(Game.bundle.knife);
        knife.x = GameConstant.KNIFE_X_POSITION;
        knife.y = GameConstant.KNIFE_Y_POSITION;
        knife.state = KnifeState.ACTIVATED;
        this.knives.push(knife);
        this.addChild(knife);
    }

    //sinh cac dao con lai
    _spawnAnotherKnife() {
        let knife = new Knife(Game.bundle.knife);
        knife.x = GameConstant.KNIFE_X_POSITION;
        knife.y = 1080;
        knife.visible = false;
        knife.state = KnifeState.DEFAULT;
        //knife.alpha = 0;
        this.knives.push(knife);
        this.addChild(knife);
    }

    //sinh obstacle knife
    spawnObsKnives(avaiAngle) {
        let numOfDefautObs = Util.randomInteger(0, 3);
        for (let i = 0; i < numOfDefautObs; i++) {
            this._spawnObs(avaiAngle);
        }        
    }


    _spawnObs(avaiAngle) {
        let knife = new Knife(Game.bundle.knife);
        knife.x = GameConstant.BOARD_X_POSITION;
        knife.y = GameConstant.BOARD_Y_POSITION;
        knife.anchor.set(0.5, -0.5);
        knife.collider.anchor.set(0.5, -0.5);
        this._setObsAng(knife, avaiAngle);
        knife.beObs();
        this.obsKnives.push(knife);
        this.addChild(knife);
    }

    //dat goc ban dau cho dao gam tren go
    _setObsAng(obs, avaiAngle) {
        let i = Util.randomInteger(0, 17);
        while (!avaiAngle[i].available) {
            if (i === 17) {
                i = 0;
            } else {
                ++i;
            }
        }
        obs.angle = avaiAngle[i].angle;
        avaiAngle[i].available = false;
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
      
        this.obsKnives.forEach(obs => {
            obs.angleRotation = this.boardAngleRotation;
            obs.update(dt);

            //ve bound
            // this.graphic.beginFill(0x880808, 1);
            // this.graphic.drawRect(obs.collider.getBounds().x, obs.collider.getBounds().y, obs.collider.getBounds().width, obs.collider.getBounds().height);
            // this.graphic.endFill();
            // console.log(- obs.angle *Math.PI / 180 % (2* Math.PI));
            // let bb = obs.collider.getBounds()
            // console.log(bb.x + bb.width/2, bb.y + bb.height/2);
        })
    }

    setObsFall() {
        this.obsKnives.forEach(obs => {
            obs.x = obs.collider.getBounds().x + obs.collider.getBounds().width/2;
            obs.y = obs.collider.getBounds().y + obs.collider.getBounds().height/2;
            obs.anchor.set(0.5);
            obs.collider.anchor.set(0.5);
            if (this.obsKnives.indexOf(obs) === (this.obsKnives.length - 1)) {
                obs.setLastObsFall();
            } else {
                obs.setAnotherObsFall();
            }
            
        })
    }

    onClicky(e) {
        if (this.knives[0].state === "activated") {
            this.knives[0].move();
            console.log(this.obsKnives.length, this.knives.length);
            return true;
        } else {return false;}
        
    }

    onBoardHit() {
        this.obsKnives.forEach(obs => {
           obs.moveUpABit();
        })
    }


}