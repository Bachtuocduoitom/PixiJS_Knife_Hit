import { Application, Assets } from "pixi.js";
import { GameConstant } from "./gameConstant";
import { PlayScene } from "./objects/scenes/playScene";
import { manifest } from "./manifest";

export class Game {
    static init() {
        this.app = new Application({
            width: GameConstant.GAME_WIDTH,
            height: GameConstant.GAME_HEIGHT,
            backgroundColor: 0x1099bb,
        });
        document.body.appendChild(this.app.view);
        this._loadGameAssets().then((bundle) => {
            this.bundle = bundle;

            this._initScene();

            this.app.ticker.add(this.update, this);
        })
    }

    static async _loadGameAssets() {
        await Assets.init({manifest: manifest});
        return await Assets.loadBundle('gameBundle');
    }

    static update(dt) {
        this.playScene.update(dt);
    }

    static _initScene() {
        this.playScene = new PlayScene();
        this.app.stage.addChild(this.playScene);
    }
}



window.onload = function () {
    Game.init();
}
