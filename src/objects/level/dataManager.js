import { Game } from "../../game";

export class DataManager {

    constructor(currentLevel) {
      this.currentLevel = currentLevel;
      this.dataLevel = Game.dataLevel[currentLevel - 1];
    }
  
    getDataLevel() {
      return this.dataLevel; 
    }

    getKnifeData() {
      return this.dataLevel.knifeData;
    }

    getBoardData() {
      return this.dataLevel.boardData;
    }

    getAppleData() {
      return this.dataLevel.appleData;
    }

    haveAppleOnBoard() {
      return this.dataLevel.appleData.haveOnBoard;
    }
    
    haveKnifeOnBoard() {
      return this.dataLevel.knifeData.haveOnBoard;
    }

    numOfKnife() {
      return this.dataLevel.knifeData.knifeNumber;
    }
}