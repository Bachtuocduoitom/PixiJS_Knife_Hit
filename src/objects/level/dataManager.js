import { Game } from "../../game";

export class DataManager {

    constructor(currentLevel) {
      this.data = Game.data;
      this.currentLevel = currentLevel;
      this.dataLevel = this.data.level[currentLevel - 1];
      this.dataDual = this.data.dual[0]; 
    }
  
    getDataLevel() {
      return this.dataLevel; 
    }

    getDataDual() {
      return this.dataDual; 
    }

    getKnifeDataLevel() {
      return this.dataLevel.knifeData;
    }

    getKnifeDataDual() {
      return this.dataDual.knifeData;
    }

    getBoardDataLevel() {
      return this.dataLevel.boardData;
    }

    getBoardDataDual() {
      return this.dataDual.boardData;
    }

    getAppleDataLevel() {
      return this.dataLevel.appleData;
    }

    getAppleDataDual() {
      return this.dataDual.appleData;
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

    numOfDualKnife() {
      return this.dataDual.knifeData.knifeNumber;
    }
}