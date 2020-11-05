import { GameMap } from "../controllers/gameMap"
import Player from "./player"

export class PlayerMario extends Player{
  constructor(scene: Phaser.Scene, objectPosition: ObjectPosition, gameMap: GameMap) {
    super(scene, objectPosition, gameMap, 'player')
    this.body.setSize(16, 16)
    this.setScale(1.5).setOffset(25, 42)
  }

  protected createAnimations() {
    this.scene.anims.create({
      key: 'down-idle',
      frames: [{ key: 'sokoban', frame: 52 }],
    })

    this.scene.anims.create({
      key: 'down-walk',
      frames: this.scene.anims.generateFrameNumbers('sokoban', { start: 52, end: 54 }),
      frameRate: 10,
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'up-idle',
      frames: [{ key: 'sokoban', frame: 55 }],
    })

    this.scene.anims.create({
      key: 'up-walk',
      frames: this.scene.anims.generateFrameNumbers('sokoban', { start: 55, end: 57 }),
      frameRate: 10,
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'left-idle',
      frames: [{ key: 'sokoban', frame: 81 }],
    })

    this.scene.anims.create({
      key: 'left-walk',
      frames: this.scene.anims.generateFrameNumbers('sokoban', { start: 81, end: 83 }),
      frameRate: 10,
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'right-idle',
      frames: [{ key: 'sokoban', frame: 78 }],
    })

    this.scene.anims.create({
      key: 'right-walk',
      frames: this.scene.anims.generateFrameNumbers('sokoban', { start: 78, end: 80 }),
      frameRate: 10,
      repeat: -1,
    })
  }
}
