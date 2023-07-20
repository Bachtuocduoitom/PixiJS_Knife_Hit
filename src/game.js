import { Application, Assets } from "pixi.js";
import { GameConstant } from "./gameConstant";
import { PlayScene } from "./objects/scenes/playScene";
import { manifest } from "./manifest";
import { SceneManager } from "./objects/scenes/sceneManager";

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

            this._loadGameDataLevel().then((data) => {
                this.dataLevel = data.level;

                // this._initSceneManager();
                
                // this.app.ticker.add(this.update, this);

                this._initSceneManager();
                
                this.app.ticker.add(this.update, this);
            })
          
        })
        this.resize();
        window.addEventListener("resize", this.resize);
    }

    static async _loadGameAssets() {
        await Assets.init({manifest: manifest});
        return await Assets.loadBundle('gameBundle');
    }
    
    static async _loadGameDataLevel() {
        return fetch('assets/json/levels.json').then(res => res.json());
    }

    static update(dt) {
        //this.playScene.update(dt);
        this.sceneManager.update(dt);
    }

    static _initScene() {
        this.playScene = new PlayScene();
        this.app.stage.addChild(this.playScene);
    }

    static _initSceneManager() {
        this.sceneManager = new SceneManager();
        this.app.stage.addChild(this.sceneManager);
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
}
