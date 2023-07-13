import { AnimatedSprite, Sprite, Texture, Container } from "pixi.js";
import { Collider } from "../physics/collider";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
import * as TWEEN from "@tweenjs/tween.js";
import { Util } from "../../helper/utils";
export class Board extends Sprite {
  constructor() {
    super();
    this.anchor.set(0.5);
    this.boardSprite = new Sprite(Game.bundle.board);
    this.boardSprite.anchor.set(0.5);
    this.angleRotation = 0.05; 
    this.countRotation = 0;
    this.numRotation = 0;
    this.rotateDirection = 1;
    this.isStop = false;
    this._initCollider();
    this._initFragments();
    this.randomRotationToChange();
    this._initFilter();
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
    // mảnh 1
    this.fragments1 = new AnimatedSprite(Game.bundle.frgLg._frameKeys.map(image => Texture.from(image)));
    this.fragments1.anchor.set(0.5);
    this.fragments1.scale.set(0.7);
    this.fragments1.rotation = -0.5;
    this.fragments1.visible = false;
   
    // mảnh 2
    this.fragments2 = new AnimatedSprite(Game.bundle.frgMd._frameKeys.map(image => Texture.from(image)));
    this.fragments2.anchor.set(0.5);
    this.fragments2.scale.set(0.8);
    this.fragments2.visible = false;

    // mảnh 3
    this.fragments3 = new AnimatedSprite(Game.bundle.frgSm._frameKeys.map(image => Texture.from(image)));
    this.fragments3.anchor.set(0.5);
    this.fragments3.scale.set(0.8);
    this.fragments3.visible = false;

    // mảnh vụn
    this.fragmentsMin = Sprite.from('../assets/images/minFrg.png');
    this.fragmentsMin.anchor.set(0.5);
    this.fragmentsMin.scale.set(0.8);
    this.fragmentsMin.visible = false;
    this.addChild(this.fragments1, this.fragments2, this.fragments3,  this.fragmentsMin);
    
  }

  _initFilter() {
    this.boardFilter = new AdjustmentFilter();
    this.boardSprite.filters = [this.boardFilter];
  }
  breakUp() {
    // this.texture = null;
    this.fragments1.visible = true;
    this.fragments1.play();
    this.fragments1.animationSpeed = 0.12 ;
    this.fragments1.loop = false;

    this.fragments2.visible = true;
    this.fragments2.play();
    this.fragments2.animationSpeed = 0.12;
    this.fragments2.loop = false;

    this.fragments3.visible = true;
    this.fragments3.play();
    this.fragments3.animationSpeed = 0.12;  
    this.fragments3.loop = false;

    this.fragmentsMin.visible = true;
    this.setBroken();
  }

  setBroken() {
    this.isBroken = true;
    // set rơi manh 1
    new TWEEN.Tween(this.fragments1)
      .to({ x: 200, y: -2, rotation: this.fragments1.rotation + 3},40)
      .onComplete(() => {
        new TWEEN.Tween(this.fragments1)
          .to({ x: 280, y: 1200, rotation:this.fragments1.rotation + 4 },50)
          .start(this.currentDt);
      })
      .start(this.currentDt);

    // set rơi manh 2
    new TWEEN.Tween(this.fragments2)
      .to({ x: 180, y: -350, rotation:this.fragments2.rotation + 2 },40)
      .onComplete(() => {
        new TWEEN.Tween(this.fragments2)
          .to({ x: 380, y: 1250, rotation: this.fragments2.rotation + 3 },55)
          .start(this.currentDt);
      })
      .start(this.currentDt);

    // set rơi manh 3
    new TWEEN.Tween(this.fragments3)
      .to({ x: -200, y: -350, rotation:this.fragments3.rotation -3 },40)
      .onComplete(() => {
        new TWEEN.Tween(this.fragments3)
          .to({ x: -400, y: 1350, rotation:this.fragments3.rotation -5 },60)
          .start(this.currentDt);
      })
      .start(this.currentDt);

      // set rơi mảnh vụn
      new TWEEN.Tween(this.fragmentsMin)
      .to({ x: -200, y: 1500, rotation:this.fragmentsMin.rotation -0.005 },80)
      .start(this.currentDt);
  }

  setStop() {
    this.isStop = true;
  }

  update(dt) {
    this.currentDt += dt;
    TWEEN.update(this.currentDt);
    if (this.isBroken) {
      this.boardSprite.texture = null;
      this.angleRotation = 0;
    } else if (this.isStop) {
      this.angleRotation = 0;
    } else {
      this.fragments1.rotation += this.angleRotation * dt;
      this.fragments2.rotation += this.angleRotation * dt;
      this.fragments3.rotation += this.angleRotation * dt;
      this.boardSprite.rotation += this.angleRotation * dt;
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
      this.boardFilter.gamma = 1.5;
    }).onComplete(() => {
      this.boardFilter.gamma = 1;
    }).start(this.currentDt);
  }

  randomRotationToChange() {
    this.numRotationToChange = Util.random(1, 3);
  }

}