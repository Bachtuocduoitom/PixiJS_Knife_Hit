import { Container, Graphics } from "pixi.js";
import { Level1, PlayScene } from "../scenes/playScene";
import { Knife, KnifeState } from "./knife";
import { Game } from "../../game";

import { GameConstant } from "../../gameConstant";
import { Util } from "../../helper/utils";



export class KnifeManagerPrototype extends Container {
    constructor(data) {
        super();
        this.knifeData = data;  
        this.knives = [];
        this.obsKnives = [];
        this.numOfKnife = this.knifeData.knifeNumber - 1; //so dao trong pool
        this.boardAngleRotation = 0;
        this.graphic = new Graphics();
        this.addChild(this.graphic);
        this._spawnKnives(); // sinh dao
    }

    //sinh mang dao cho nguoi choi
    _spawnKnives() {
        this._spawnFirstKnife();
        for ( let i = 0; i < this.numOfKnife; i++) {
            this._spawnAnotherKnife();
        }
    }

    //sinh dao dau tien
    _spawnFirstKnife() {}

    //sinh cac dao con lai
    _spawnAnotherKnife() {}

    //sinh mang dao gam tren go
    spawnObsKnives(avaiAngle) {
        let numOfDefautObs = Util.randomInteger(this.knifeData.minOnBoard, this.knifeData.maxOnBoard);
        for (let i = 0; i < numOfDefautObs; i++) {
            this._spawnObs(avaiAngle);
        }        
    }
    
    // sinh dao gam tren go
    _spawnObs(avaiAngle) {}

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

    //cho roi dao
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

    //xu ly va cham
    onClicky(e) {
        if (this.knives[0].state === "activated") {
            this.knives[0].move();
            return true;
        } else {return false;}
        
    }

    //xu ly dao di chuyen nhe
    onBoardHit() {
        this.obsKnives.forEach(obs => {
           obs.moveUpABit();
        })
    }


}