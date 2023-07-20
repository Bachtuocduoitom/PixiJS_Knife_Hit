import { AnimatedSprite, Sprite, Texture, Container } from "pixi.js";
import { Collider } from "../physics/collider";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { DataManager } from "../level/dataManager";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
import * as TWEEN from "@tweenjs/tween.js";
import { Util } from "../../helper/utils";

export class Board extends Sprite {
  constructor(data) {
    super();
    this.boardData = data;

    this.anchor.set(0.5);
    this.boardSprite = new Sprite(Game.bundle.board);
    this.boardSprite.anchor.set(0.5);
    this.addChild(this.boardSprite);
    
    this.angleRotation = this.boardData.rotationSpeed;
    this.countRotation = 0;
    this.numRotation = 0;
    this.rotateDirection = 1;
    this.isStop = false;
    this.currentDt = 0;

    this._initCollider();
    this._initFragments();
    this.randomRotationToChange();
    this._initFilter();

    if (this.boardData.isChangeSpeed) {
      this.minusSpeed = this.angleRotation/60/2;
      this.plusSpeed = this.angleRotation/60;
    }
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
  }

  setBroken() {
    this.isBroken = true;
    // set rơi manh 1
    new TWEEN.Tween(this.fragments1)
      .to({ x: 200, y: -2, rotation: this.fragments1.rotation + 3},350)
      .onComplete(() => {
        new TWEEN.Tween(this.fragments1)
          .to({ x: 280, y: 1200, rotation:this.fragments1.rotation + 4 },850)
          .start();
      })
      .start();

    // set rơi manh 2
    new TWEEN.Tween(this.fragments2)
      .to({ x: 180, y: -350, rotation:this.fragments2.rotation + 2 },350)
      .onComplete(() => {
        new TWEEN.Tween(this.fragments2)
          .to({ x: 380, y: 1250, rotation: this.fragments2.rotation + 3 },850)
          .start();
      })
      .start();

    // set rơi manh 3
    new TWEEN.Tween(this.fragments3)
      .to({ x: -200, y: -350, rotation:this.fragments3.rotation -3 },400)
      .onComplete(() => {
        new TWEEN.Tween(this.fragments3)
          .to({ x: -400, y: 1350, rotation:this.fragments3.rotation -5 },850)
          .start();
      })
      .start();

      // set rơi mảnh vụn
      new TWEEN.Tween(this.fragmentsMin)
      .to({ x: -200, y: 1500, rotation:this.fragmentsMin.rotation -0.005 },800)
      .start();
  }
  setBroken2() {
    this.isBroken = true;
    // set rơi manh 1
    new TWEEN.Tween(this.fragments1)
      .to({ x: -120, y: -170, rotation: this.fragments1.rotation + 3},350)
      .onComplete(() => {
        new TWEEN.Tween(this.fragments1)
          .to({ x: -680, y: -320, rotation:this.fragments1.rotation + 4 },300)
          .start();
      })
      .start();

    // set rơi manh 2
    new TWEEN.Tween(this.fragments2)
      .to({ x: 200, y: -230, rotation:this.fragments2.rotation + 2 },350)
      .onComplete(() => {
        new TWEEN.Tween(this.fragments2)
        .to({ x: 380, y: 1250, rotation: this.fragments2.rotation + 3 },850)
        .start();
      })
      .start();

    // set rơi manh 3
    new TWEEN.Tween(this.fragments3)
      .to({ x: 400, y: 60, rotation:this.fragments3.rotation -3 },200)
      .onComplete(() => {
        new TWEEN.Tween(this.fragments3)
          .to({ x: 980, y: 450, rotation:this.fragments3.rotation -5 },350)
          .start();
      })
      .start();

      // set rơi mảnh vụn
      new TWEEN.Tween(this.fragmentsMin)
      .to({ x: -200, y: 1500, rotation:this.fragmentsMin.rotation -0.005 },800)
      .start();
  }
  setStop() {
    this.isStop = true;
  }

  update(dt) {
    this.currentDt += dt;
    //TWEEN.update(this.currentDt);
    if (this.isBroken) {
      this.boardSprite.texture = null;
      this.angleRotation = 0;
    } else if (this.isStop) {
      this.angleRotation = 0; //dung quay
    } else {
      this.fragments1.rotation += this.angleRotation * dt;
      this.fragments2.rotation += this.angleRotation * dt;
      this.fragments3.rotation += this.angleRotation * dt;
      this.boardSprite.rotation += this.angleRotation * dt;
      
      //kiem tra co quay bang hay khong
      if (this.boardData.isChangeSpeed) {    
        this.changeRotation();  
      }
    }
  }

  //thay doi toc do va huong quay
  changeRotation() {
    this.countRotation += Math.abs(this.angleRotation);
    this.numRotation = this.countRotation / (Math.PI * 2);
    if (this.numRotation >= this.numRotationToChange) {
      if (this.rotateDirection === 1) {
        this.angleRotation -= this.minusSpeed;
        if (this.angleRotation <= 0) {
          this.countRotation = 0;
          this.numRotation = 0;
          this.randomRotationToChange();
          this.rotateDirection = Util.randomInteger(0, 1);
        } 
      } else {
        this.angleRotation += this.minusSpeed;
        if (this.angleRotation >= 0) {
          this.countRotation = 0;
          this.numRotation = 0;
          this.randomRotationToChange();
          this.rotateDirection = Util.randomInteger(0, 1);
        } 
      }
      
    } else if (this.angleRotation < 0.05 && this.rotateDirection === 1) {
      this.angleRotation += this.plusSpeed;
    } else if (this.angleRotation > -0.05 && this.rotateDirection === 0) {
      this.angleRotation -= this.plusSpeed;
    }
    
    
  }

  onHit() {
    new TWEEN.Tween(this).to({y: this.y - GameConstant.JUMP_DISTANCE}, GameConstant.JUMP_TIMER).yoyo(true).repeat(1).onUpdate(() => {
      this.boardFilter.gamma = 1.5;
    }).onComplete(() => {
      this.boardFilter.gamma = 1;
    }).start();
  }

  randomRotationToChange() {
    this.numRotationToChange = Util.random(1, 2);
  }

}