import { GameMap } from "../controllers/gameMap"
import Player from "./player"

export class PlayerMario extends Player{
  constructor(scene: Phaser.Scene, objectPosition: ObjectPosition, gameMap: GameMap) {
    super(scene, objectPosition, gameMap, 'player')
    this.body.setSize(16, 16)
    this.setScale(1.5).setOffset(25, 42)
  }

}
