import { Assets, Container, Sprite } from "pixi.js";
import { MenuUI } from "../ui/menuUI";
import { Background } from "../backgrounds/background";
import { Game } from "../../game";
import { PlayScene } from "./playScene";
import { GameConstant } from "../../gameConstant";
import * as TWEEN from "@tweenjs/tween.js";
import { DualScene } from "./dualScene";
import { Sound } from "@pixi/sound";

export class SceneManager extends Container {
    constructor() {
        super();
        this._initLocalStorageData();
        this._initAssetContainer();
        this._initUI();
        this._initStartAnimation();
    }

    _initLocalStorageData() {
        //init currentSkin in localstorage
        if (localStorage.getItem('currentSkin') === null) {
            localStorage.setItem('currentSkin', "knife");
        }

        //init skinBoxData in shop
        for (let i = 0; i < 12; i++) {
            if (localStorage.getItem(`skinBox${i + 1}Data`) === null) {
                let skinBoxData = {state: "lock", skin: `knife${i  + 1}`, cost: 10};
                localStorage.setItem(`skinBox${i + 1}Data`, JSON.stringify(skinBoxData));
            }
        }

        //init appleScore
        if (localStorage.getItem('appleScore') === null) {
            localStorage.setItem('appleScore', 0);
          }
    }
    
    _initAssetContainer() {
        this.assetContainer = new Container();
        this.addChild(this.assetContainer);
        this._initBackground();
        this._initKnifeUI();
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
        this.knifeLogo.scale.set(0.5);
        this.knifeLogo.x = GameConstant.GAME_WIDTH/2;
        this.knifeLogo.y = 480;
        this.assetContainer.addChild(this.knifeLogo);

        //fly knife logo
        this.flyKnifeLogo = new Sprite(Game.bundle.flying_knife_logo);
        this.flyKnifeLogo.anchor.set(0.5);
        this.flyKnifeLogo.x = - this.knifeLogo.width/2;
        this.flyKnifeLogo.y = 290;
        this.flyKnifeLogo.rotation = -Math.PI / 20;
        this.assetContainer.addChild(this.flyKnifeLogo);

        //hit logo
        this.hitLogo = new Sprite(Game.bundle.hit_logo);
        this.hitLogo.anchor.set(0.5, 1.2);
        this.hitLogo.scale.set(0.5);
        this.hitLogo.x = GameConstant.GAME_WIDTH/2;
        this.hitLogo.y = 480;
        this.assetContainer.addChild(this.hitLogo);

        //this._addTweenLogo();
    }

    _initKnifeUI() {
        this.knife = new Sprite(Assets.get(localStorage.getItem('currentSkin')));
        this.assetContainer.addChild(this.knife);
        this.knife.scale.set(1.2);
        this.knife.x = GameConstant.GAME_WIDTH /2 - this.knife.width / 2;
        this.knife.y = GameConstant.GAME_HEIGHT;
    }

    _initUI() {
        this.menuUI = new MenuUI();
        this.menuUI.hide();
        this.addChild(this.menuUI);

        this.menuUI.on("normal button tapped", (e) => this._initNorMode(e));
        this.menuUI.on("dual button tapped", (e) => this._initDualMode(e));
        this.menuUI.on("change skin", () => this._changeKnifeUISkin());
    }

    _initStartAnimation() {
        new TWEEN.Tween(this.knifeLogo).to({scale: {x:1 ,y: 1}}, 1000).easing(TWEEN.Easing.Elastic.Out).start();
        new TWEEN.Tween(this.hitLogo).to({scale: {x:1 ,y: 1}}, 1000).easing(TWEEN.Easing.Elastic.Out).start();
        new TWEEN.Tween(this.flyKnifeLogo).to({x: GameConstant.GAME_WIDTH/2, rotation: 0}, 1000).easing(TWEEN.Easing.Elastic.Out).start();
        new TWEEN.Tween(this.knife).to({y: GameConstant.GAME_HEIGHT /2 -this.knife.height /2}, 400).onComplete(() => {
            this._addTweenLogo();
            this.menuUI.show();
        }).start();

    }

    update(dt) {
        TWEEN.update();
        if (this.playScene != null) {
            this.playScene.update(dt);
        }
        if (this.dualScene != null) {
            this.dualScene.update(dt);
        }
    }

    _initNorMode(e) {
        this.playScene = new PlayScene();
        this.addChild(this.playScene);

    }

    _initDualMode(e) {
        this.dualScene = new DualScene();
        this.addChild(this.dualScene);
    }

    _changeKnifeUISkin() {
        this.knife.texture = Assets.get(localStorage.getItem('currentSkin'));
    }
    
    hideUI() {
        this.assetContainer.destroy();
        this.menuUI.hide();
    }

    norToHome() {
        this.removeChild(this.playScene);
        this.playScene.destroy();
        this.playScene = null;
        
    }

    dualToHome() {
        this.removeChild(this.dualScene);
        this.dualScene.destroy();
        this.dualScene = null;
    }

    _addTweenLogo() {
        new TWEEN.Tween(this.knifeLogo).to({rotation: -Math.PI/30}, 1000).yoyo(true).repeat(Infinity).start();
        new TWEEN.Tween(this.hitLogo).to({rotation: Math.PI/40}, 1000).yoyo(true).repeat(Infinity).start();
    }

}