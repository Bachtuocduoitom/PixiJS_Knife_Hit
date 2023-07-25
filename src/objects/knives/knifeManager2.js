import { Container, Graphics } from "pixi.js";
import { Level1, PlayScene } from "../scenes/playScene";
import { Knife, KnifeState } from "./knife";
import { Game } from "../../game";

import { GameConstant } from "../../gameConstant";
import { Util } from "../../helper/utils";
import { KnifeP2 } from "./knifeP2";
import { KnifeManagerPrototype } from "./knifeManagerPrototype";

export class KnifeManager2 extends KnifeManagerPrototype {
    constructor(data) {
        super(data);    
    }

    //sinh dao dau tien
    _spawnFirstKnife() {
        let knife = new KnifeP2(Game.bundle.knife2);
        knife.x = GameConstant.KNIFE_X_POSITION;
        knife.y = GameConstant.KNIFE_P2_Y_POSITION;
        knife.state = KnifeState.ACTIVATED;
        this.knives.push(knife);
        this.addChild(knife);
    }

    //sinh cac dao con lai
    _spawnAnotherKnife() {
        let knife = new KnifeP2(Game.bundle.knife2);
        knife.x = GameConstant.KNIFE_X_POSITION;
        knife.y = 0;
        knife.visible = false;
        knife.state = KnifeState.DEFAULT;
        //knife.alpha = 0;
        this.knives.push(knife);
        this.addChild(knife);
    }

    // sinh dao gam tren go
    _spawnObs(avaiAngle) {
        let knife = new KnifeP2(Game.bundle.knife2_reverse);     
        knife.x = GameConstant.BOARD_X_POSITION;
        knife.y = GameConstant.BOARD_DUAL_Y_POSITION;
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