import { AnimatedSprite, Sprite, Texture, Container } from "pixi.js";
import { Collider } from "../physics/collider";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
import * as TWEEN from "@tweenjs/tween.js";
import { Util } from "../../helper/utils";
export class Board extends Sprite {
  constructor(texture) {
    super(texture);
    this.anchor.set(0.5);
    this.boardSprite = new Sprite(Game.bundle.board);
    this.boardSprite.anchor.set(0.5);
    this.angleRotation = 0.05;
    this.countRotation = 0;
    this.numRotation = 0;
    this.rotateDirection = 1;
    this._initCollider();
    this._initFragments();
    this.randomRotationToChange();
    this._initFilter();
    this.sortableChildren = true;
    this.zIndex = 0;
    this.addChild(this.boardSprite);
    this.currentDt = 0;
  }

  _initCollider() {
    this.collider = new Collider();
    this.collider.width = 150;
    this.collider.height = 110;
    this.collider.zIndex = 110;
    this.addChild(this.collider);
  }

  _initFragments() {
    this.frgLgFrames = [];
    for (let i = 2; i <= 5; i++) {
      let frgLgframe = Texture.from(`../assets/images/frgLg${i}.png`);
      this.frgLgFrames.push(frgLgframe);
    }
       this.fragments1 = new AnimatedSprite(this.frgLgFrames);
       // this.fragments1 = Sprite.from('../assets/images/frgLg1.png');
    this.fragments1.anchor.set(0.5);
    this.fragments1.scale.set(0.7);
    this.fragments1.rotation = -0.5;
    this.fragments1.visible = false;
    this.fragments1.zIndex = 100;

    this.frgMdFrames = [];
    for (let i = 2; i <= 4; i++) {
      let frgMdframe = Texture.from(`../assets/images/frgMd${i}.png`);
      this.frgMdFrames.push(frgMdframe);
    }
       this.fragments2 = new AnimatedSprite(this.frgMdFrames);
    // this.fragments2 =  Sprite.from('../assets/images/frgMd1.png');
    this.fragments2.anchor.set(0.5);
    this.fragments2.scale.set(0.8);
    this.fragments2.visible = false;
    this.fragments2.zIndex = 100;

    this.frgSmFrames = [];
    for (let i = 2; i <= 5; i++) {
      let frgSmframe = Texture.from(`../assets/images/frgSm${i}.png`);
      this.frgSmFrames.push(frgSmframe);
    }
    this.fragments3 = new AnimatedSprite(this.frgSmFrames);
    // this.fragments3 =  Sprite.from('../assets/images/frgSm1.png');
    this.fragments3.anchor.set(0.5);
    this.fragments3.scale.set(0.8);
    this.fragments3.visible = false;
    this.fragments3.zIndex = 100;
    this.addChild(this.fragments1, this.fragments2, this.fragments3);
  }

  _initFilter() {
    this.boardFilter = new AdjustmentFilter();
    this.boardSprite.filters = [this.boardFilter];
  }
  breakUp() {
    // this.texture = null;
    this.fragments1.visible = true;
    this.fragments1.play();
    this.fragments1.animationSpeed = 0.08 ;
    this.fragments1.loop = false;

    this.fragments2.visible = true;
    this.fragments2.play();
    this.fragments2.animationSpeed = 0.12;
    this.fragments2.loop = false;

    this.fragments3.visible = true;
    this.fragments3.play();
    this.fragments3.animationSpeed = 0.12;  
    this.fragments3.loop = false;

    this.setBroken();
  }

  setBroken() {
    this.isBroken = true;
    // set rơi manh 1
    new TWEEN.Tween(this.fragments1)
      .to({ x: 200, y: -2, rotation: 0.0001},20)
      .onComplete(() => {
        new TWEEN.Tween(this.fragments1)
          .to({ x: 280, y: 1200, rotation: 0.0005 },40)
          .start(this.currentDt);
      })
      .start(this.currentDt);

    // set rơi manh 2
    new TWEEN.Tween(this.fragments2)
      .to({ x: 180, y: -350, rotation: 0.005 }, 20)
      .onComplete(() => {
        new TWEEN.Tween(this.fragments2)
          .to({ x: 380, y: 1250, rotation: 0.05 },55)
          .start(this.currentDt);
      })
      .start(this.currentDt);

    // set rơi manh 3
    new TWEEN.Tween(this.fragments3)
      .to({ x: -200, y: -350, rotation: -0.005 },20)
      .onComplete(() => {
        new TWEEN.Tween(this.fragments3)
          .to({ x: -400, y: 1350, rotation: -0.05 },50)
          .start(this.currentDt);
      })
      .start(this.currentDt);
  }

  update(dt) {
    this.currentDt += dt;
    TWEEN.update(this.currentDt);
    if (this.isBroken) {
      this.boardSprite.texture = null;
      this.angleRotation = 0;
    } else {
      this.fragments1.rotation += this.angleRotation;
      this.fragments2.rotation += this.angleRotation;
      this.fragments3.rotation += this.angleRotation;
      this.boardSprite.rotation += this.angleRotation;
      this.changeRotation();
    }
  }

  changeRotation() {
    this.countRotation += Math.abs(this.angleRotation);
    this.numRotation = this.countRotation / (Math.PI * 2);
    if (this.numRotation >= this.numRotationToChange) {
      if (this.rotateDirection === 1) {
        this.angleRotation -= 1/2400;
        if (this.angleRotation <= 0) {
          this.countRotation = 0;
          this.numRotation = 0;
          this.randomRotationToChange();
          this.rotateDirection = Util.randomInteger(0, 1);
        } 
      } else {
        this.angleRotation += 1/2400;
        if (this.angleRotation >= 0) {
          this.countRotation = 0;
          this.numRotation = 0;
          this.randomRotationToChange();
          this.rotateDirection = Util.randomInteger(0, 1);
        } 
      }
      
    } else if (this.angleRotation < 0.05 && this.rotateDirection === 1) {
      this.angleRotation += 1/2000;
    } else if (this.angleRotation > -0.05 && this.rotateDirection === 0) {
      this.angleRotation -= 1/2000;
    }
    
    
  }

  onHit() {
    new TWEEN.Tween(this).to({y: this.y - 10}, GameConstant.JUMP_TIMER).yoyo(true).repeat(1).onUpdate(() => {
      this.boardFilter.gamma = 2;
    }).onComplete(() => {
      this.boardFilter.gamma = 1;
    }).start(this.currentDt);
  }

  randomRotationToChange() {
    this.numRotationToChange = Util.random(2, 3);
  }

}