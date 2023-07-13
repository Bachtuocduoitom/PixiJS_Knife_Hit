import { Game } from "../../game";

export class DataManager {

    constructor() {
        this.currentLevel = 0;
        this.getDataLevel();
    }
  
    getDataLevel(currentLevel) {
      return Game.dataLevel[currentLevel -1];  
    }
}