import { Application, Assets } from "pixi.js";
import { GameConstant } from "./gameConstant";
import { PlayScene } from './objects/scenes/playScene'
import { manifest } from "./manifest";
import { SceneManager } from "./objects/scenes/sceneManager";
import { LoadingScene } from "./objects/scenes/loadingScene";
import * as TWEEN from "@tweenjs/tween.js";

export class Game {
    static init() {
        this.app = new Application({
            width: GameConstant.GAME_WIDTH,
            height: GameConstant.GAME_HEIGHT,
            backgroundColor: 0x000000,
        });
        document.body.appendChild(this.app.view);

        this.readyState = false;
        this.start = false;

        this._initLoadingScene();

        this._loadGameAssets().then((bundle) => {
            this.bundle = bundle;

            this._loadGameDataLevel().then((data) => {
                this.data = data;
                this.readyState = true;            
            })
          
        });
        this.app.ticker.add(this.update, this);

        this.resize();

    }

    static async _loadGameAssets() {
        await Assets.init({manifest: manifest});
        return await Assets.loadBundle('gameBundle');
    }
    
    static async _loadGameDataLevel() {
        return fetch('assets/json/levels.json').then(res => res.json());
    }

    static update(dt) {
        this.loadingScene.update(dt);
        if (this.sceneManager != null) {
            this.sceneManager.update(dt);
        }
        this._checkLoaded();
    }

    static _initSceneManager() {
        this.sceneManager = new SceneManager();
        this.app.stage.addChild(this.sceneManager);
    }

    static _initLoadingScene() {
        this.loadingScene = new LoadingScene();
        this.app.stage.addChild(this.loadingScene);
    }

    static _checkLoaded() {
        if(this.readyState && !this.start) {
            this.start = true;
            setTimeout(() => {
                this._onLoaded();
            }, 100)
            
        }
    }

    static _onLoaded() {
        this.loadingScene.onLoaded();
        this.loadingScene.on("loaded", () => {
            this.app.stage.removeChild(this.loadingScene);
            this.loadingScene.destroy();

            this._initSceneManager();
        })

    }

    static resize() {
        const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        // uniform scale for our game
        const scale = Math.min(screenWidth / GameConstant.GAME_WIDTH, screenHeight / GameConstant.GAME_HEIGHT);

        // the "uniformly englarged" size for our game
        const enlargedWidth = Math.floor(scale * GameConstant.GAME_WIDTH);
        const enlargedHeight = Math.floor(scale * GameConstant.GAME_HEIGHT);

        // margins for centering our game
        const horizontalMargin = (screenWidth - enlargedWidth) / 2;
        const verticalMargin = (screenHeight - enlargedHeight) / 2;

        this.app.view.style.width = `${enlargedWidth}px`;
        this.app.view.style.height = `${enlargedHeight}px`;
        this.app.view.style.marginLeft = this.app.view.style.marginRight = `${horizontalMargin}px`;
        this.app.view.style.marginTop = this.app.view.style.marginBottom = `${verticalMargin}px`;
    }
}



window.onload = function () {
    Game.init();
    window.onresize = () => {
        Game.resize();
    }
}
