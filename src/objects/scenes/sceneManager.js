import { Container, Sprite } from "pixi.js";
import { MenuUI } from "../ui/menuUI";
import { Background } from "../backgrounds/background";
import { Game } from "../../game";
import { PlayScene } from "./playScene";
import { GameConstant } from "../../gameConstant";
import * as TWEEN from "@tweenjs/tween.js";
import { DualScene } from "./dualScene";

export class SceneManager extends Container {
    constructor() {
        super();
        this.currentDt = 0;
        this._initAssetContainer();
        this._initUI();
        this._initKnifeUI();
    }

    _initAssetContainer() {
        this.assetContainer = new Container();
        this.addChild(this.assetContainer);
        this._initBackground();
        this._initLogo();
    }

    _initBackground() {
        this.background = new Background(Game.bundle.background);
        this.background.x = 0;
        this.background.y = 0;
        this.assetContainer.addChild(this.background);
    }

    _initLogo() {
        //knife logo
        this.knifeLogo = new Sprite(Game.bundle.knife_logo);
        this.knifeLogo.anchor.set(0.5, 2.2);
        //this.knifeLogo.rotation = Math.PI/30;
        this.knifeLogo.x = GameConstant.GAME_WIDTH/2;
        this.knifeLogo.y = 480;
        this.assetContainer.addChild(this.knifeLogo);

        //fly knife logo
        this.flyKnifeLogo = new Sprite(Game.bundle.flying_knife_logo);
        this.flyKnifeLogo.anchor.set(0.5);
        //this.flyKnifeLogo.rotation = Math.PI/30;
        this.flyKnifeLogo.x = GameConstant.GAME_WIDTH/2;
        this.flyKnifeLogo.y = 290;
        this.assetContainer.addChild(this.flyKnifeLogo);

        //hit logo
        this.hitLogo = new Sprite(Game.bundle.hit_logo);
        this.hitLogo.anchor.set(0.5, 1.2);
        //this.knifeLogo.rotation = Math.PI/30;
        this.hitLogo.x = GameConstant.GAME_WIDTH/2;
        this.hitLogo.y = 480;
        this.assetContainer.addChild(this.hitLogo);

        this._addTweenLogo();
    }

    _initKnifeUI() {
        this.knifeUI = new Sprite(Game.bundle.knife);
        this.addChild(this.knifeUI);
        this.knifeUI.scale.set(1.2);
        this.knifeUI.x = GameConstant.GAME_WIDTH /2 - this.knifeUI.width / 2;
        this.knifeUI.y = GameConstant.GAME_HEIGHT /2 -this.knifeUI.height /2;
    }

    _initUI() {
        this.menuUI = new MenuUI();
        this.addChild(this.menuUI);

        this.menuUI.on("normal button tapped", (e) => this._initNorMode(e));
        this.menuUI.on("dual button tapped", (e) => this._initDualMode(e));
    }

    update(dt) {
        this.currentDt += dt;
        TWEEN.update();
        if (this.playScene != null) {
            this.playScene.update(dt);
        }
        if (this.dualScene != null) {
            this.dualScene.update(dt);
        }
    }

    _initNorMode(e) {
        console.log("normal button tapped");
        this.playScene = new PlayScene();
        this.addChild(this.playScene);
    }

    _initDualMode(e) {
        console.log("dual button tapped");
        this.dualScene = new DualScene();
        this.addChild(this.dualScene);
    }

    hideUI() {
        this.assetContainer.destroy();
        this.menuUI.hide();
    }

    norToHome() {
        this.removeChild(this.playScene);
        this.playScene.destroy();
    }

    dualToHome() {
        this.removeChild(this.dualScene);
        this.dualScene.destroy();
    }

    _addTweenLogo() {
        new TWEEN.Tween(this.knifeLogo).to({rotation: -Math.PI/30}, 1000).yoyo(true).repeat(Infinity).start();
        new TWEEN.Tween(this.hitLogo).to({rotation: Math.PI/40}, 1000).yoyo(true).repeat(Infinity).start();
    }

}