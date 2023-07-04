import { AnimatedSprite, Sprite, Texture, Container } from "pixi.js";
import { Collider } from "../physics/collider";
import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import * as TWEEN from "@tweenjs/tween.js";
export class Board extends Sprite {
  constructor(texture) {
    super(texture);
    this.anchor.set(0.5);
    this.boardSprite = new Sprite(Game.bundle.board);
    this.boardSprite.anchor.set(0.5);
    this.angleRotation = 0.03;
    this._initCollider();
    this._initFragments();
    this.sortableChildren = true;
    this.zIndex = 0;
    this.addChild(this.boardSprite);
    this.currentDt = 0;
  }
  _initCollider() {
    this.collider = new Collider();
    this.collider.width = 150;
    this.collider.height = 150;
    this.collider.zIndex = 110;
    this.addChild(this.collider);
  }
  _initFragments() {
    this.frgLgFrames = [];
    for (let i = 1; i <= 2; i++) {
      let frgLgframe = Texture.from(`../assets/images/frgLg${i}.png`);
      this.frgLgFrames.push(frgLgframe);
    }
    this.fragments1 = new AnimatedSprite(this.frgLgFrames);
    this.fragments1.anchor.set(0.5);
    this.fragments1.scale.set(0.7);
    this.fragments1.rotation = -0.5;
    this.fragments1.visible = false;
    this.fragments1.zIndex = 100;

    this.frgMdFrames = [];
    for (let i = 1; i <= 2; i++) {
      let frgMdframe = Texture.from(`../assets/images/frgMd${i}.png`);
      this.frgMdFrames.push(frgMdframe);
    }
    this.fragments2 = new AnimatedSprite(this.frgMdFrames);
    this.fragments2.anchor.set(0.5);
    this.fragments2.scale.set(0.8);
    this.fragments2.visible = false;
    this.fragments2.zIndex = 100;
    this.frgSmFrames = [];
    for (let i = 1; i <= 2; i++) {
      let frgSmframe = Texture.from(`../assets/images/frgSm${i}.png`);
      this.frgSmFrames.push(frgSmframe);
    }
    this.fragments3 = new AnimatedSprite(this.frgSmFrames);
    this.fragments3.anchor.set(0.5);
    this.fragments3.scale.set(0.8);
    this.fragments3.visible = false;
    this.fragments3.zIndex = 100;
    this.addFragmentsIntoBoard();
  }
  addFragmentsIntoBoard() {
    this.addChild(this.fragments1, this.fragments2, this.fragments3);
  }
  breakUp() {
    // this.texture = null;
    this.fragments1.visible = true;
    this.fragments1.play();
    this.fragments1.animationSpeed = 0.08;
    this.fragments1.loop = false;

    this.fragments2.visible = true;
    this.fragments2.play();
    this.fragments2.animationSpeed = 0.08;
    this.fragments2.loop = false;

    this.fragments3.visible = true;
    this.fragments3.play();
    this.fragments3.animationSpeed = 0.08;
    this.fragments3.loop = false;
  }
  setBroken() {
    this.isBroken = true;
    // set rơi manh 1
    new TWEEN.Tween(this.fragments1)
      .to({ x: -170, y: - 170, rotation: 4 }, 10)
      .onComplete(() => {
        new TWEEN.Tween(this.fragments1)
          .to({ x: -250, y: 1350, rotation: -3 }, 50)
          .start(this.currentDt);
      })
      .start(this.currentDt);
    // set rơi manh 2
    new TWEEN.Tween(this.fragments2)
      .to({ x: 250, y: -200, rotation: 5 }, 10)
      .onComplete(() => {
        new TWEEN.Tween(this.fragments2)
          .to({ x: 100, y: 1550, rotation: 3 }, 40)
          .start(this.currentDt);
      })
      .start(this.currentDt);
    // set rơi manh 3
    new TWEEN.Tween(this.fragments3)
      .to(
        { x: 15, y: -210, rotation: 5 },
        10
      )
      .onComplete(() => {
        new TWEEN.Tween(this.fragments3)
          .to({ x: 120, y: 1350, rotation: 3 }, 60)
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
    this.numRotation = this.boardSprite.rotation / (Math.PI * 2);
    if (this.numRotation >= 0.2) {
      setTimeout(() => {
        this.angleRotation -= 0.00005;
      },100)
    }
    if (this.numRotation < 0) {
      this.angleRotation += 0.02;
    }
  }

  onHit() {
    new TWEEN.Tween(this).to({y: this.y - 10}, 3).yoyo(true).repeat(1).start(this.currentDt);
  }
}
