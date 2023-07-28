import { Assets, Container, Graphics } from "pixi.js";
import { Level1, PlayScene } from "../scenes/playScene";
import { Knife, KnifeState } from "./knife";
import { Game } from "../../game";

import { GameConstant } from "../../gameConstant";
import { Util } from "../../helper/utils";
import { KnifeManagerPrototype } from "./knifeManagerPrototype";



export class KnifeManager extends KnifeManagerPrototype {
    constructor(data) {
        super(data);
    }

    //sinh dao dau tien
    _spawnFirstKnife() {
        let knife = new Knife(Assets.get(localStorage.getItem('currentSkin')));
        knife.x = GameConstant.KNIFE_X_POSITION;
        // knife.y = GameConstant.KNIFE_Y_POSITION;
        // knife.state = KnifeState.ACTIVATED;
        knife.y = 1320;
        knife.firstToActive();
        this.knives.push(knife);
        this.addChild(knife);
    }

    //sinh cac dao con lai
    _spawnAnotherKnife() {
        let knife = new Knife(Assets.get(localStorage.getItem('currentSkin')));
        knife.x = GameConstant.KNIFE_X_POSITION;
        knife.y = 1080;
        knife.visible = false;
        knife.state = KnifeState.DEFAULT;
        //knife.alpha = 0;
        this.knives.push(knife);
        this.addChild(knife);
    }

    // sinh dao gam tren go
    _spawnObs(avaiAngle) {
        let knife = new Knife(Game.bundle.knife);
        knife.x = GameConstant.BOARD_X_POSITION;
        knife.y = GameConstant.BOARD_Y_POSITION;
        knife.anchor.set(0.5, -0.5);
        knife.collider.anchor.set(0.5, -0.5);
        knife.scale.set(0.5);
        knife.zoomOut();
        this._setObsAng(knife, avaiAngle);
        knife.beObs();
        this.obsKnives.push(knife);
        this.addChild(knife);
    }


    update(dt) {
        super.update(dt);
    }

}