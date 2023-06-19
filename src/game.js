import { Application, Assets } from "pixi.js";
import { GameConstant } from "./gameConstant";
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
            this.app.ticker.add(this.update, this);
        })
    }

    static async _loadGameAssets() {
        await Assets.init({manifest: manifest});
        return await Assets.loadBundle('gameBundle');
    }

    static update(dt) {

    }
}



window.onload = function () {
    Game.init();
}
