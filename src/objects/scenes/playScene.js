import { Container, Sprite, Graphics } from "pixi.js";
import { Game } from "../../game";
import { Background } from "../backgrounds/background";
import { Knife } from "../knives/knife";
import { KnifeManager } from "../knives/knifeManager";
import { Board } from "../boards/board";
import { GameConstant } from "../../gameConstant";

export const GameState = Object.freeze({
    Lobby: "lobby",
    Playing: "playing",
    Win: "win",
    Lose: "lose"
})

export const Level1 = Object.freeze({
    KNIFE_NUMBER: 7,
})

export class PlayScene extends Container {
    constructor() {
        super();
        this.state = GameState.Lobby;
        this._initGamePlay();
    }

    _initGamePlay() {
        this.gameplay = new Container();
        this.gameplay.sortableChildren = true;
        this.addChild(this.gameplay);
        this._initBackground();
        this._initBoard();
       
        this._initKnifeManager();
    }

    _initBackground() {
        this.background = new Background(Game.bundle.background);
        this.background.x = 0;
        this.background.y = 0;
        this.gameplay.addChild(this.background);
    }

    _initBoard() {
        this.board = new Board(Game.bundle.board);
        this.board.x =GameConstant.GAME_WIDTH / 2;
        this.board.y = GameConstant.GAME_HEIGHT /3- 40;
        this.gameplay.addChild(this.board);
        this.board.zIndex = 100;
    }
    _initKnifeManager() {
        this.knifeManager = new KnifeManager();
        this.knifeManager.x = 0;
        this.knifeManager.y = 0; 
        this.gameplay.addChild(this.knifeManager);
        this.knifeManager.zIndex = 0;
    }

    _onCollision() {
        if (this.knifeManager.knives[0] != null) {
            if (this.knifeManager.knives[0].isMove) {
                this.knifeManager.obsKnives.forEach(knife => {
                    if (this._checkColliderObs(this._cal4PointKnife(this.knifeManager.knives[0]), this._cal4PointObs(knife))) {
                        console.log("aaaaa");
                    } 
                })
                if (this._isCollision(this.knifeManager.knives[0].collider, this.board.collider)) {
                    this.knifeManager.knives[0].beObs();
                    this._rotateKnife(this.knifeManager.knives[0]);
                    this.knifeManager.obsKnives.push(this.knifeManager.knives.shift());
                    if (this.knifeManager.numOfKnife > 0) {
                        this.knifeManager.knives[0].setActivate();
                        this.knifeManager.numOfKnife--;
                    }
                    // console.log(Math.round(this.board.rotation / (Math.PI * 2)) , 'vòng');
                    console.log("va roi!");
                    }
                
                
            }
        }
    }
    _isCollision(a, b) {
        const aBox = a.getBounds()
        const bBox = b.getBounds();
        return aBox.x + aBox.width > bBox.x &&
            aBox.x < bBox.x + bBox.width &&
            aBox.y + aBox.height > bBox.y &&
            aBox.y < bBox.y + bBox.height
    }

    _rotateKnife(knife) {
        knife.x = this.board.x;
        knife.y = this.board.y;
        knife.anchor.set(0.5, -0.5);
        knife.collider.anchor.set(0.5, -0.5);
    }
    _syncRotate() {
        this.knifeManager.boardAngleRotation = this.board.angleRotation;
    }

    update(dt) {
        this.knifeManager.update(dt);
        this.board.update(dt);
        this._onCollision();
        // this._onCollision2Knife();
        this._syncRotate();
    }

    _cal4PointObs(knife) {
        let centerX = knife.collider.getBounds().x + knife.collider.getBounds().width/2;    //toa do x cua tam 
        let centerY = knife.collider.getBounds().y + knife.collider.getBounds().height/2;   //toa do y cua tam
        let ang = - knife.angle * Math.PI / 180;    //angle
        let wid = knife.collider.width;     //width
        let hei = knife.collider.height;    //height
        
        //TOP RIGHT VERTEX:
        let Top_RightX = centerX + ((wid / 2) * Math.cos(ang)) - ((hei / 2) * Math.sin(ang))
        let Top_RightY = centerY - ((wid / 2) * Math.sin(ang)) - ((hei / 2) * Math.cos(ang))

        //TOP LEFT VERTEX:
        let Top_LeftX = centerX - ((wid / 2) * Math.cos(ang)) - ((hei / 2) * Math.sin(ang))
        let Top_LeftY = centerY + ((wid / 2) * Math.sin(ang)) - ((hei / 2) * Math.cos(ang))

        //BOTTOM LEFT VERTEX:
        let Bot_LeftX = centerX - ((wid / 2) * Math.cos(ang)) + ((hei / 2) * Math.sin(ang))
        let Bot_LeftY = centerY + ((wid / 2) * Math.sin(ang)) + ((hei / 2) * Math.cos(ang))

        //BOTTOM RIGHT VERTEX:
        let Bot_RightX = centerX + ((wid / 2) * Math.cos(ang)) + ((hei / 2) * Math.sin(ang))
        let Bot_RightY = centerY - ((wid / 2) * Math.sin(ang)) + ((hei / 2) * Math.cos(ang))
    
        return [Top_LeftX, Top_LeftY, Top_RightX, Top_RightY, Bot_RightX, Bot_RightY, Bot_LeftX, Bot_LeftY]
    }

    _cal4PointKnife(knife) {
        let w = knife.collider.getBounds().width
        let h = knife.collider.getBounds().height
        let x = knife.collider.getBounds().x
        let y = knife.collider.getBounds().y
      
        return [x, y, x + w, y, x + w, y + h, x, y + h]
    }

    _checkColliderObs(points1, points2) {
        let a = points1
        let b = points2
        let polygons = [a, b]
        let minA, maxA, projected, minB, maxB, j
        for (let i = 0; i < polygons.length; i++)
        {
            let polygon = polygons[i]
            for (let i1 = 0; i1 < polygon.length; i1 += 2)
            {
                let i2 = (i1 + 2) % polygon.length
                let normal = { x: polygon[i2 + 1] - polygon[i1 + 1], y: polygon[i1] - polygon[i2] }
                minA = maxA = null
                for (j = 0; j < a.length; j += 2)
                {
                    projected = normal.x * a[j] + normal.y * a[j + 1]
                    if (minA === null || projected < minA)
                    {
                        minA = projected
                    }
                    if (maxA === null || projected > maxA)
                    {
                        maxA = projected
                    }
                }
                minB = maxB = null
                for (j = 0; j < b.length; j += 2)
                {
                    projected = normal.x * b[j] + normal.y * b[j + 1]
                    if (minB === null || projected < minB)
                    {
                        minB = projected
                    }
                    if (maxB === null || projected > maxB)
                    {
                        maxB = projected
                    }
                }
                if (maxA < minB || maxB < minA)
                {
                    return false
                }
            }
        }
        return true
    }

}